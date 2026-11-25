#!/usr/bin/env bash
# JARVIS Creative Lab — isolated setup for Debian/Termux or Linux.
set -u
umask 077
ROOT="${JARVIS_CREATIVE_ROOT:-$HOME/jarvis-creative-lab}"
mkdir -p "$ROOT/sources" "$ROOT/runtime" "$ROOT/.agents/skills" "$ROOT/.claude/skills" "$ROOT/.opencode/skills" || exit 1
REPORT="$ROOT/install-report-$(date +%Y%m%d-%H%M%S).txt"
exec > >(tee "$REPORT") 2>&1
echo "=== JARVIS CREATIVE LAB ==="
uname -m; df -h "$ROOT"; free -m || true
space_ok() { [ "$(df -Pk "$ROOT" | awk 'END {print $4}')" -ge 10485760 ]; }
space_ok || { echo "BLOCKED: less than 10 GiB free"; exit 1; }
for cmd in git node npm python3 timeout; do command -v "$cmd" >/dev/null || { echo "BLOCKED: missing $cmd"; exit 1; }; done
node -v; npm -v
export GIT_TERMINAL_PROMPT=0 DISABLE_TELEMETRY=1 DO_NOT_TRACK=1
clone_repo() {
  local name="$1" upstream="$2" target="$ROOT/sources/$1"
  space_ok || { echo "BLOCKED $name: low storage"; return 1; }
  if [ -d "$target/.git" ]; then
    [ "$(git -C "$target" remote get-url origin)" = "$upstream" ] || { echo "BLOCKED $name: different origin"; return 1; }
    echo "REUSED $name"
  elif [ -e "$target" ]; then echo "BLOCKED $name: existing path"; return 1
  else timeout 180 git clone --depth 1 -- "$upstream" "$target" || { echo "BLOCKED $name: clone failed"; return 1; }; fi
  echo "SOURCE $name $(git -C "$target" rev-parse HEAD)"
  du -sh "$target"
}
clone_repo cinematic-site https://github.com/icryptan/cinematic-site-skill.git
clone_repo awwwards-jury https://github.com/juliobsz/skills.git
clone_repo awwwards-mcp https://github.com/INSANE0777/Awwwards-mcp.git
clone_repo openflow https://github.com/Vasiniks/OpenFlow.git
clone_repo open-design https://github.com/ZakFong/f-open-design.git
clone_repo onlook https://github.com/onlook-dev/onlook.git
clone_repo opencode https://github.com/anomalyco/opencode.git
clone_repo openhands https://github.com/OpenHands/OpenHands.git

# Stage project-scoped skills, never overwrite existing skills or global settings.
for item in cinematic-site/CinematicSite awwwards-jury/awwwards awwwards-jury/jury; do
  src="$ROOT/sources/$item"; name="${item##*/}"
  if [ -f "$src/SKILL.md" ]; then
    for dir in .agents .claude .opencode; do
      dest="$ROOT/$dir/skills/$name"
      if [ ! -e "$dest" ]; then cp -R "$src" "$dest" || echo "BLOCKED copy $dest"; fi
      [ -f "$dest/SKILL.md" ] && echo "SKILL STAGED $dest"
    done
  else echo "BLOCKED skill $item"; fi
done

# Install only the minimal runtime in its own npm prefix; do not change global packages.
if space_ok && node -e 'const [a,b]=process.versions.node.split(".").map(Number); process.exit(a>22||a===22&&b>=13?0:1)'; then
  timeout 240 npm install --prefix "$ROOT/runtime" --no-audit --no-fund --save-exact awwwards-mcp@1.9.0 || echo "BLOCKED MCP install"
else echo "BLOCKED MCP: storage or Node >=22.13 required"; fi
if command -v opencode >/dev/null; then
  echo "REUSE existing OpenCode"
  OC="$(command -v opencode)"
elif space_ok; then
  timeout 240 npm install --prefix "$ROOT/runtime" --no-audit --no-fund --save-exact @opencode/cli || echo "BLOCKED OpenCode install"
  OC="$ROOT/runtime/node_modules/.bin/opencode"
else OC=""; fi
if [ -n "$OC" ] && [ -x "$OC" ]; then
  timeout 20 "$OC" --version && echo "PASS OpenCode CLI" || echo "BLOCKED OpenCode CLI"
  printf '%s\n' "$OC" > "$ROOT/runtime/opencode-path"
else echo "BLOCKED OpenCode executable"; fi
if command -v bun >/dev/null; then
  bun --version
  if [ -d "$ROOT/sources/cinematic-site/CinematicSite/Tools" ]; then
    (cd "$ROOT/sources/cinematic-site" && timeout 60 bun test ./CinematicSite/Tools) && echo "PASS CinematicSite tests" || echo "BLOCKED CinematicSite tests"
  fi
else echo "PENDING Bun needed for CinematicSite generator (skills can still be read)"; fi

# JSON-RPC smoke test with bounded time; no credentials and no model inference.
export JARVIS_LAB="$ROOT"
python3 - <<'PY'
import json, os, subprocess, pathlib
root = pathlib.Path(os.environ["JARVIS_LAB"])
exe = root / "runtime/node_modules/.bin/awwwards-mcp"
if not exe.exists():
    print("BLOCKED MCP executable"); raise SystemExit(0)
messages = [
    {"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"jarvis-smoke","version":"1"}}},
    {"jsonrpc":"2.0","method":"notifications/initialized"},
    {"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}
]
# Start server and use select with a bounded deadline for each response.
import select, time
with open(root/"runtime/mcp-smoke-stderr.log","w") as err:
    p = subprocess.Popen([str(exe)], stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=err, bufsize=0)
    pending=b""
    def send(msg):
        p.stdin.write((json.dumps(msg)+"\n").encode()); p.stdin.flush()
    def receive(id):
        global pending
        deadline=time.monotonic()+25
        while time.monotonic()<deadline:
            while b"\n" in pending:
                line,pending=pending.split(b"\n",1)
                try: obj=json.loads(line)
                except ValueError: continue
                if obj.get("id")==id: return obj
            ready,_,_=select.select([p.stdout],[],[],max(0,deadline-time.monotonic()))
            if not ready: break
            chunk=os.read(p.stdout.fileno(),65536)
            if not chunk: break
            pending+=chunk
        raise RuntimeError("MCP response timed out")
    try:
        send(messages[0]); init=receive(1)
        if "result" not in init: raise RuntimeError("initialize error")
        send(messages[1]); send(messages[2]); reply=receive(2)
        tools=reply.get("result",{}).get("tools",[])
        if not tools: raise RuntimeError("tools list empty")
        print("PASS MCP tools/list:",len(tools))
        (root/"runtime/mcp-tools.json").write_text(json.dumps([t["name"] for t in tools],indent=2))
        cfg={"$schema":"https://opencode.ai/config.json","mcp":{"awwwards":{"type":"local","command":[str(exe)],"enabled":True}}}
        dest=root/"opencode.json"
        if not dest.exists(): dest.write_text(json.dumps(cfg,indent=2)+"\n")
        print("MCP configuration:",dest)
    except Exception as e: print("BLOCKED MCP smoke:",e)
    finally:
        p.terminate()
        try: p.wait(timeout=3)
        except subprocess.TimeoutExpired: p.kill();p.wait()
PY

cat > "$ROOT/README-JARVIS.txt" <<'EOF'
Run OpenCode from this lab only after reviewing the staged skills:
  cd ~/jarvis-creative-lab
  cat runtime/opencode-path
  "$(cat runtime/opencode-path)" models
  "$(cat runtime/opencode-path)"
Select a model explicitly marked free; no automatic inference calls are made.
The MCP core has no browser extras. Browser tools require Playwright/Chromium
and FFmpeg, preferably in an authorized remote machine; test separately.
OpenFlow, Open Design, Onlook and OpenHands are SOURCE ONLY: review requirements,
licenses and installation scripts before activation. Onlook has no supported
Linux release in the upstream README. No global config, client repository,
billing or existing sessions were modified. Review install-report*.txt.
EOF
echo "=== COMPLETE WITH POSSIBLE BLOCKERS: $REPORT ==="
echo "OpenCode start: cd $ROOT && \"\$(cat runtime/opencode-path)\""
