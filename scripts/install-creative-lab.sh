#!/usr/bin/env bash
# JARVIS Creative Lab — isolated setup for Debian/Termux or Linux.
set -u
umask 077
ROOT="${JARVIS_CREATIVE_ROOT:-$HOME/jarvis-creative-lab}"
mkdir -p "$ROOT/sources" "$ROOT/runtime" "$ROOT/.agents/skills" "$ROOT/.claude/skills" "$ROOT/.opencode/skills" "$ROOT/bin" "$ROOT/flow-home" || exit 1
REPORT="$ROOT/install-report-$(date +%Y%m%d-%H%M%S).txt"
exec > >(tee "$REPORT") 2>&1
echo "=== JARVIS CREATIVE LAB ==="
uname -m; df -h "$ROOT"; free -m || true
space_ok() { [ "$(df -Pk "$ROOT" | awk 'END {print $4}')" -ge 10485760 ]; }
space_ok || { echo "BLOCKED: less than 10 GiB free"; exit 1; }
for cmd in git node npm python3 timeout; do command -v "$cmd" >/dev/null || { echo "BLOCKED: missing $cmd"; exit 1; }; done
node -v; npm -v
export GIT_TERMINAL_PROMPT=0 DISABLE_TELEMETRY=1 DO_NOT_TRACK=1
export PATH="$ROOT/bin:$ROOT/runtime/node_modules/.bin:$HOME/.local/bin:$PATH"
export JARVIS_LAB="$ROOT"
# Keep dependency versions recorded in the local package-lock. Install one component at a time.
install_npm() { space_ok && timeout 420 npm install --prefix "$ROOT/runtime" --no-audit --no-fund --save-exact "$@"; }

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
if ! command -v bun >/dev/null; then
  install_npm bun || echo "BLOCKED Bun package"
fi
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
        else:
            print("Existing lab configuration preserved; verify MCP entry before use")
        print("MCP configuration:",dest)
    except Exception as e: print("BLOCKED MCP smoke:",e)
    finally:
        p.terminate()
        try: p.wait(timeout=3)
        except subprocess.TimeoutExpired: p.kill();p.wait()
PY

# Optional browser runtime: same node_modules as the MCP, per upstream docs.
if install_npm playwright ffmpeg-static; then
  if timeout 240 "$ROOT/runtime/node_modules/.bin/playwright" install chromium; then
    (cd "$ROOT/runtime" && timeout 45 node --input-type=module -e '
      import {chromium} from "playwright";
      const browser=await chromium.launch({headless:true});
      try { const p=await browser.newPage(); await p.setContent("<h1>JARVIS</h1>");
        if(await p.locator("h1").innerText()!=="JARVIS") throw Error("fixture");
        await p.screenshot({path:"browser-smoke.png"}); console.log("PASS Chromium screenshot");
      } finally {await browser.close();}
    ') || echo "BLOCKED Chromium on this host; use remote browser QA"
  else echo "BLOCKED Chromium download; use remote browser QA"; fi
else echo "BLOCKED browser dependencies"; fi

# uv in an isolated Python environment if not already installed.
if ! command -v uv >/dev/null && space_ok; then
  if python3 -m venv "$ROOT/runtime/uv-venv"; then
    timeout 180 "$ROOT/runtime/uv-venv/bin/pip" install uv && {
      ln -sfn "$ROOT/runtime/uv-venv/bin/uv" "$ROOT/bin/uv"
      ln -sfn "$ROOT/runtime/uv-venv/bin/uvx" "$ROOT/bin/uvx"
    } || echo "BLOCKED uv installation"
  else echo "BLOCKED Python venv; uv unavailable"; fi
fi
command -v uv >/dev/null && uv --version || true

# OpenFlow: its real CLI, in a separate HOME. No writes into existing agent configurations.
# Install its agents and skills first, not global plugins/MCP or unrelated packages.
FLOW="$ROOT/sources/openflow/openflow.mjs"
if [ -f "$FLOW" ] && [ -s "$ROOT/runtime/opencode-path" ] && space_ok; then
  OC="$(cat "$ROOT/runtime/opencode-path")"
  mkdir -p "$ROOT/flow-home/.config/opencode" "$ROOT/flow-home/.local/share" "$ROOT/flow-home/.cache"
  flow() {
    env HOME="$ROOT/flow-home" XDG_CONFIG_HOME="$ROOT/flow-home/.config" XDG_DATA_HOME="$ROOT/flow-home/.local/share" XDG_CACHE_HOME="$ROOT/flow-home/.cache" PATH="$(dirname "$OC"):$PATH" node "$FLOW" "$@"
  }
  flow install --only opencode --skip tools,mcp,plugins --dry-run || echo "BLOCKED OpenFlow dry-run"
  if timeout 900 env HOME="$ROOT/flow-home" XDG_CONFIG_HOME="$ROOT/flow-home/.config" XDG_DATA_HOME="$ROOT/flow-home/.local/share" XDG_CACHE_HOME="$ROOT/flow-home/.cache" PATH="$(dirname "$OC"):$PATH" node "$FLOW" install --only opencode --skip tools,mcp,plugins; then
    echo "PASS OpenFlow installer (agents and skills)"
  else echo "PARTIAL OpenFlow: see output"; fi
  # Copy the upstream fleet as a fallback only into the isolated lab, never overwrite.
  for kind in agents commands; do
    dst="$ROOT/flow-home/.config/opencode/$kind"
    mkdir -p "$dst"
    if [ -d "$ROOT/sources/openflow/$kind/opencode" ]; then
      cp -an "$ROOT/sources/openflow/$kind/opencode/." "$dst/"
    fi
    find "$dst" -maxdepth 1 -name '*.md' -print
  done
  for skill in "$ROOT/sources/openflow/skills/"*; do
    if [ -f "$skill/SKILL.md" ]; then
      dest="$ROOT/.agents/skills/$(basename "$skill")"
      [ -e "$dest" ] || cp -R "$skill" "$dest"
    fi
  done
  flow doctor || echo "PARTIAL OpenFlow doctor: optional tools not all installed"
else echo "BLOCKED OpenFlow: missing source or OpenCode"; fi

# Open Design: documented web/daemon mode, no Electron or Docker.
# pnpm is installed in a private prefix; use the repository lockfile.
if [ -f "$ROOT/sources/open-design/pnpm-lock.yaml" ] && space_ok; then
  if install_npm pnpm@10.33.2; then
    if (cd "$ROOT/sources/open-design" && timeout 900 "$ROOT/runtime/node_modules/.bin/pnpm" install --frozen-lockfile); then
      echo "PASS Open Design dependencies"
      (cd "$ROOT/sources/open-design" && timeout 60 "$ROOT/runtime/node_modules/.bin/pnpm" tools-dev --help) && echo "PASS Open Design launcher" || echo "BLOCKED Open Design launcher"
    else echo "BLOCKED Open Design dependency install"; fi
  else echo "BLOCKED pnpm"; fi
else echo "BLOCKED Open Design source or storage"; fi

# OpenHands maintained Agent Canvas package. No paid provider and no Docker.
if command -v uv >/dev/null && space_ok; then
  if install_npm @openhands/agent-canvas; then
    timeout 30 "$ROOT/runtime/node_modules/.bin/agent-canvas" --version && echo "PASS Agent Canvas CLI" || echo "PARTIAL Agent Canvas CLI; inspect startup"
  else echo "BLOCKED Agent Canvas package"; fi
else echo "BLOCKED Agent Canvas: uv or storage"; fi

# Prepare an isolated client checkout using the user's existing GitHub authorization.
# No push, no merge, no change to the original checkout.
cat > "$ROOT/bin/prepare-client" <<'PREP'
#!/usr/bin/env bash
set -eu
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PROJECT="$ROOT/project"
if [ ! -e "$PROJECT" ]; then
  command -v gh >/dev/null || { echo "BLOCKED: GitHub CLI not available"; exit 1; }
  gh auth status --hostname github.com >/dev/null 2>&1 || { echo "BLOCKED: GitHub CLI needs existing authorized login"; exit 1; }
  gh repo clone INDESIFRABLE8090/Punta-Cana-Arena-Palmera "$PROJECT" -- --single-branch --branch design/beyond-paradise-final-cut-20261124
  git -C "$PROJECT" switch -c "creative/open-studio-$(date +%Y%m%d-%H%M%S)"
elif [ ! -d "$PROJECT/.git" ]; then
  echo "BLOCKED: existing project is not a git checkout"; exit 1
fi
cd "$PROJECT"
if [ ! -f docs/FINAL-CUT-CREATIVE-DIRECTION.md ]; then
  echo "BLOCKED: checkout lacks creative direction"; exit 1
fi
# Make the lab skills available to OpenCode and other agents in this checkout.
for skill in "$ROOT/.agents/skills/"*; do
  [ -f "$skill/SKILL.md" ] || continue
  name="$(basename "$skill")"
  mkdir -p .agents/skills
  [ -e ".agents/skills/$name" ] || cp -R "$skill" ".agents/skills/$name"
done
# Use the config in this worktree only; preserve any existing configuration.
if [ -f "$ROOT/opencode.json" ] && [ ! -e opencode.json ] && [ ! -e opencode.jsonc ]; then
  cp "$ROOT/opencode.json" opencode.json
fi
# Keep machine-specific files out of git by default.
for pattern in /opencode.json /.agents/skills/; do
  grep -Fxq "$pattern" .git/info/exclude || printf '%s\n' "$pattern" >> .git/info/exclude
done
echo "CLIENT READY: $(pwd) | $(git branch --show-current) | $(git rev-parse HEAD)"
PREP
chmod 700 "$ROOT/bin/prepare-client"
bash -n "$ROOT/bin/prepare-client" && echo "PASS client preparation syntax"
# Existing projects and credentials are preserved. A failed checkout is recoverable.
if space_ok; then timeout 240 "$ROOT/bin/prepare-client" || echo "BLOCKED client checkout; run prepare-client after restoring GitHub access"; fi

# Project-scoped launchers. Do not launch all services in parallel.
cat > "$ROOT/bin/studio" <<'LAUNCH'
#!/usr/bin/env bash
set -eu
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
export PATH="$ROOT/bin:$ROOT/runtime/node_modules/.bin:$HOME/.local/bin:$PATH"
export DISABLE_TELEMETRY=1 DO_NOT_TRACK=1
case "${1:-help}" in
  code)
    OC="$(cat "$ROOT/runtime/opencode-path")"
    if [ -d "$ROOT/project/.git" ]; then cd "$ROOT/project"; else cd "$ROOT"; fi
    shift
    exec "$OC" "$@"
    ;;
  flow)
    OC="$(cat "$ROOT/runtime/opencode-path")"
    if [ -d "$ROOT/project/.git" ]; then cd "$ROOT/project"; else cd "$ROOT"; fi
    shift
    export HOME="$ROOT/flow-home" XDG_CONFIG_HOME="$ROOT/flow-home/.config" XDG_DATA_HOME="$ROOT/flow-home/.local/share" XDG_CACHE_HOME="$ROOT/flow-home/.cache"
    exec "$OC" "$@"
    ;;
  design)
    cd "$ROOT/sources/open-design"
    exec "$ROOT/runtime/node_modules/.bin/pnpm" tools-dev run web
    ;;
  design-stop)
    cd "$ROOT/sources/open-design"
    exec "$ROOT/runtime/node_modules/.bin/pnpm" tools-dev stop
    ;;
  canvas)
    cd "$ROOT"
    exec "$ROOT/runtime/node_modules/.bin/agent-canvas"
    ;;
  cinematic)
    shift
    exec bun "$ROOT/sources/cinematic-site/CinematicSite/Tools/NewSite.ts" "$@"
    ;;
  prepare)
    exec "$ROOT/bin/prepare-client"
    ;;
  doctor)
    uname -m; df -h "$ROOT"
    for x in node npm bun uv ffmpeg; do command -v "$x" && "$x" --version 2>/dev/null | head -1 || true; done
    ls -lt "$ROOT"/install-report-*.txt
    ;;
  *) printf '%s\n' "studio code | flow | design | design-stop | canvas | cinematic | prepare | doctor"
    ;;
esac
LAUNCH
chmod 700 "$ROOT/bin/studio"
bash -n "$ROOT/bin/studio" && echo "PASS launcher syntax"
# Project brief in the lab; actual client changes must remain in isolated worktrees.
if [ ! -e "$ROOT/AGENTS.md" ]; then
  cat > "$ROOT/AGENTS.md" <<'BRIEF'
# JARVIS Creative Studio
Priority: Arena & Palmera / Beyond Paradise. Read the client repository's
docs/FINAL-CUT-CREATIVE-DIRECTION.md and .claude/skills/beyond-paradise-studio/SKILL.md.
Do not reuse the rejected layout. Make an original cinematic spatial welcome
scene and verify it in a real browser. Use CinematicSite and awwwards for
production, jury for independent review, and Awwwards MCP for references.
Never copy proprietary assets or publish without owner approval. Work in
a separate branch/worktree; no new costs. Select only a verified free model
unless the owner authorizes an existing subscription. No automatic inference.
BRIEF
fi
cat > "$ROOT/README-JARVIS.txt" <<'EOF'
JARVIS Creative Studio
  ~/jarvis-creative-lab/bin/studio code     # existing OpenCode identity
  ~/jarvis-creative-lab/bin/studio flow     # isolated OpenFlow frontend fleet
  ~/jarvis-creative-lab/bin/studio design   # Open Design; open printed local URL
  ~/jarvis-creative-lab/bin/studio design-stop
  ~/jarvis-creative-lab/bin/studio canvas   # Agent Canvas; default localhost:8000
  ~/jarvis-creative-lab/bin/studio cinematic --help
  ~/jarvis-creative-lab/bin/studio prepare  # retry private checkout if blocked
  ~/jarvis-creative-lab/bin/studio doctor
The installer attempts to create a separate private client checkout in project/.
If successful, code and flow open that checkout directly. Review local-only skills and configs before pushing.
Choose a model explicitly marked free. OpenFlow isolation may require choosing
a model again; existing credentials are not copied. Open Design may detect
existing agents on PATH; select an authorized model. Do not enter paid API keys.
Run only one heavy visual server at a time. No public tunnel.
Awwwards MCP core is configured in the lab; browser availability is separately
tested. Project skills are in .agents/skills and .claude/skills. OpenFlow installs
agents/skills only; its optional MCP/plugins/tools are not all enabled.
Onlook is source reference: no supported Android desktop runtime.
A PASS of a CLI or dependency install is not a successful UI/model test.
Agent Canvas and Open Design require first-launch verification. See report.
EOF
echo "=== INSTALLATION ATTEMPTS FINISHED: $REPORT ==="
echo "OpenCode: $ROOT/bin/studio code"
echo "OpenFlow: $ROOT/bin/studio flow"
echo "Open Design: $ROOT/bin/studio design"
echo "OpenHands: $ROOT/bin/studio canvas"
echo "Review PASS/PARTIAL/BLOCKED in $REPORT"
