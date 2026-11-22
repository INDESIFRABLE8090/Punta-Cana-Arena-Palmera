import { s } from './client';

/**
 * Sonido ambiental del mar, sintetizado con Web Audio (sin archivos de audio).
 * Solo arranca cuando la persona pulsa el botón; nunca se reproduce solo.
 */
let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let tone: BiquadFilterNode | null = null;
let on = false;

function noiseBuffer(ac: AudioContext, seconds: number, brown: boolean) {
  const buffer = ac.createBuffer(1, ac.sampleRate * seconds, ac.sampleRate);
  const data = buffer.getChannelData(0);
  let last = 0;
  for (let i = 0; i < data.length; i++) {
    const white = Math.random() * 2 - 1;
    last = brown ? (last + 0.02 * white) / 1.02 : white;
    data[i] = brown ? last * 3.5 : white;
  }
  return buffer;
}

/** Capa de ruido filtrado cuyo volumen sube y baja como el oleaje. */
function layer(ac: AudioContext, out: AudioNode, opts: { brown: boolean; type: BiquadFilterType; freq: number; q: number; gain: number; swell: number; rate: number }) {
  const src = ac.createBufferSource();
  src.buffer = noiseBuffer(ac, 5, opts.brown);
  src.loop = true;
  const filter = ac.createBiquadFilter();
  filter.type = opts.type;
  filter.frequency.value = opts.freq;
  filter.Q.value = opts.q;
  const gain = ac.createGain();
  gain.gain.value = opts.gain;
  const lfo = ac.createOscillator();
  lfo.frequency.value = opts.rate;
  const depth = ac.createGain();
  depth.gain.value = opts.swell;
  lfo.connect(depth).connect(gain.gain);
  src.connect(filter).connect(gain).connect(out);
  src.start();
  lfo.start();
}

function build() {
  const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return false;
  ctx = new AC();
  master = ctx.createGain();
  master.gain.value = 0;
  tone = ctx.createBiquadFilter();
  tone.type = 'lowpass';
  tone.frequency.value = 9000;
  tone.connect(master).connect(ctx.destination);
  layer(ctx, tone, { brown: true, type: 'lowpass', freq: 420, q: 0.4, gain: 0.5, swell: 0.3, rate: 0.085 }); // cuerpo de la ola
  layer(ctx, tone, { brown: false, type: 'bandpass', freq: 1700, q: 0.5, gain: 0.05, swell: 0.04, rate: 0.12 }); // espuma
  layer(ctx, tone, { brown: false, type: 'highpass', freq: 5200, q: 0.3, gain: 0.012, swell: 0.01, rate: 0.19 }); // brisa
  return true;
}

function fade(to: number, seconds: number) {
  if (!ctx || !master) return;
  master.gain.cancelScheduledValues(ctx.currentTime);
  master.gain.setTargetAtTime(to, ctx.currentTime, seconds / 3);
}

/** 0 = sobre el agua, 1 = sumergido (el sonido se apaga como bajo el mar). */
export function setUnderwater(amount: number) {
  if (!ctx || !tone || !on) return;
  const hz = 9000 * Math.pow(0.045, Math.min(1, Math.max(0, amount)));
  tone.frequency.setTargetAtTime(hz, ctx.currentTime, 0.15);
}

export function initAudio() {
  const buttons = document.querySelectorAll<HTMLButtonElement>('[data-sound]');
  if (!buttons.length) return;

  const render = () =>
    buttons.forEach((b) => {
      b.setAttribute('aria-pressed', String(on));
      const label = b.querySelector('[data-sound-label]');
      if (label) label.textContent = s(on ? 'soundOn' : 'soundOff');
      b.setAttribute('aria-label', s(on ? 'soundOn' : 'soundOff'));
    });

  buttons.forEach((b) =>
    b.addEventListener('click', async () => {
      if (!ctx && !build()) return;
      on = !on;
      if (on) {
        await ctx!.resume();
        fade(0.5, 1.5);
      } else {
        fade(0, 0.5);
        setTimeout(() => !on && ctx?.suspend(), 900);
      }
      render();
    }),
  );

  document.addEventListener('visibilitychange', () => {
    if (!ctx || !on) return;
    if (document.hidden) void ctx.suspend();
    else void ctx.resume();
  });
  render();
}
