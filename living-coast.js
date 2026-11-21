import fragmentSource from './living-coast.frag?raw';

/**
 * THE LIVING COAST — original procedural coast, no photo/video assets.
 * WebGL with hard frame cap, adaptive resolution and visible CSS fallback.
 */
export function initLivingCoast() {
  const root = document.querySelector('.hero[data-living-coast]');
  const canvas = document.getElementById('livingCoastCanvas');
  if (!root || !canvas) return;

  const controls = [...root.querySelectorAll('[data-coast-chapter]')];
  const status = root.querySelector('#coastChapterStatus');
  const pointer = { x:0.5, y:0.5 };
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const lowMemory = Number(navigator.deviceMemory || 8) <= 2;
  const dataSaver = Boolean(navigator.connection?.saveData);
  const chapters = ['sea','adventure','night'];
  const names = {
    es: ['El océano marca el comienzo.', 'El camino también es aventura.', 'La noche tiene otro ritmo.'],
    en: ['The ocean is only the beginning.', 'The journey is part of the adventure.', 'The night has its own rhythm.']
  };
  let gl = null, program = null, uniforms = null;
  let raf = 0, lastFrame = 0, startedAt = performance.now(), current = 0;
  let visible = true, failed = false;

  function updateStatus() {
    const lang = document.documentElement.lang === 'en' ? 'en' : 'es';
    if (status) status.textContent = names[lang][current];
  }
  function setChapter(id, updateCatalog) {
    if (!chapters.includes(id)) return;
    current = chapters.indexOf(id);
    root.dataset.coastScene = id;
    controls.forEach(b=>b.setAttribute('aria-pressed', String(b.dataset.coastChapter === id)));
    updateStatus();
    if (updateCatalog) document.querySelector('.filter-pill[data-filter="' + id + '"]')?.click();
    if (gl) draw(performance.now());
  }

  const vertexSource = 'attribute vec2 position; void main(){ gl_Position=vec4(position,0.0,1.0); }';
  function compile(type, source) {
    const sh=gl.createShader(type);
    gl.shaderSource(sh,source);
    gl.compileShader(sh);
    if(!gl.getShaderParameter(sh,gl.COMPILE_STATUS)) {
      gl.deleteShader(sh);
      throw Error('Coast shader compilation failed');
    }
    return sh;
  }
  function resize() {
    if (!gl) return;
    const rect=canvas.getBoundingClientRect();
    const multiplier=(navigator.hardwareConcurrency||8)<=4 ? 1 : 1.4;
    const ratio=Math.min(window.devicePixelRatio||1,multiplier) * .85;
    const w=Math.max(1,Math.round(rect.width*ratio));
    const h=Math.max(1,Math.round(rect.height*ratio));
    if(canvas.width!==w || canvas.height!==h) {
      canvas.width=w;canvas.height=h;
      gl.viewport(0,0,w,h);
    }
  }
  function draw(now) {
    if (!gl||!program) return;
    resize();
    gl.useProgram(program);
    gl.uniform2f(uniforms.resolution,canvas.width,canvas.height);
    gl.uniform2f(uniforms.pointer,pointer.x,pointer.y);
    gl.uniform1f(uniforms.time,(now-startedAt)/1000);
    gl.uniform1f(uniforms.scene,current);
    gl.drawArrays(gl.TRIANGLES,0,6);
  }
  const fps=(navigator.hardwareConcurrency||8)<=4 ? 18 : 30;
  const minInterval=1000/fps;
  function stop(){if(raf) cancelAnimationFrame(raf);raf=0;}
  function start(){if(!raf && gl && visible && !document.hidden && !reduced.matches)raf=requestAnimationFrame(tick);}
  function tick(now) {
    raf=0;
    if(!gl||!visible||document.hidden||reduced.matches)return;
    if(now-lastFrame>=minInterval){lastFrame=now;draw(now);}
    start();
  }
  function initializeGL() {
    if(reduced.matches||dataSaver||lowMemory||failed)return;
    try {
      gl=canvas.getContext('webgl',{alpha:false,antialias:false,depth:false,stencil:false,powerPreference:'low-power'});
      if(!gl)return;
      const vert=compile(gl.VERTEX_SHADER,vertexSource);
      const frag=compile(gl.FRAGMENT_SHADER,fragmentSource);
      program=gl.createProgram();
      gl.attachShader(program,vert);gl.attachShader(program,frag);gl.linkProgram(program);
      gl.deleteShader(vert);gl.deleteShader(frag);
      if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error('Coast shader link failed');
      gl.useProgram(program);
      const quad=gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER,quad);
      gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
      const attr=gl.getAttribLocation(program,'position');
      gl.enableVertexAttribArray(attr);
      gl.vertexAttribPointer(attr,2,gl.FLOAT,false,0,0);
      uniforms={
        resolution:gl.getUniformLocation(program,'u_resolution'),
        pointer:gl.getUniformLocation(program,'u_pointer'),
        time:gl.getUniformLocation(program,'u_time'),
        scene:gl.getUniformLocation(program,'u_scene')
      };
      resize();
      draw(performance.now());
      canvas.classList.add('coast-ready');
      startedAt=performance.now();
      start();
    }catch(error) {
      failed=true;gl=null;
      canvas.classList.remove('coast-ready');
    }
  }

  controls.forEach(button=>button.addEventListener('click',()=>setChapter(button.dataset.coastChapter,true)));
  root.querySelector('.hero-buttons a[href="#excursiones"]')?.addEventListener('click',()=>{
    document.querySelector('.filter-pill[data-filter="'+chapters[current]+'"]')?.click();
  });
  root.addEventListener('pointermove',event=>{
    if(event.pointerType!=='mouse'||reduced.matches)return;
    const r=root.getBoundingClientRect();
    pointer.x=Math.max(0,Math.min(1,(event.clientX-r.left)/Math.max(1,r.width)));
    pointer.y=Math.max(0,Math.min(1,1-(event.clientY-r.top)/Math.max(1,r.height)));
    root.style.setProperty('--coast-pointer-x',(pointer.x-.5).toFixed(3));
    root.style.setProperty('--coast-pointer-y',(pointer.y-.5).toFixed(3));
  },{passive:true});
  if('IntersectionObserver' in window) {
    const view=new IntersectionObserver(entries=>{
      visible=entries.some(e=>e.isIntersecting);
      if(visible)start();else stop();
    },{threshold:.01});
    view.observe(root);
  }
  const languageObserver=new MutationObserver(updateStatus);
  languageObserver.observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else start();});
  window.addEventListener('resize',()=>{if(gl){resize();draw(performance.now());}},{passive:true});
  canvas.addEventListener('webglcontextlost',event=>{
    event.preventDefault();stop();gl=null;failed=true;canvas.classList.remove('coast-ready');
  });
  setChapter('sea',false);
  initializeGL();
}