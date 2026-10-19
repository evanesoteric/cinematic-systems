import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { ArrowUpRight, ChevronDown, Command, Expand, LockKeyhole, Minimize, Pause, Play, RotateCcw, Repeat2, SlidersHorizontal, SquareTerminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { applets, LoadingApplet, type AppletName } from '@/components/cipher-applet';

export const Route = createFileRoute('/')({
  head: () => ({ meta: [
    { title: 'Cipher — Cinematic Screen System' },
    { name: 'description', content: 'A cinematic, scalable decryption screen with animated ASCII, signal telemetry, and swappable simulation applets.' },
    { property: 'og:title', content: 'Cipher — Cinematic Screen System' },
    { property: 'og:description', content: 'A cinematic decryption simulation. Designed for the screen.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: Index,
});

function Index() {
  const [applet, setApplet] = useState<AppletName>('decrypt');
  const [running, setRunning] = useState(true);
  const [progress, setProgress] = useState(0);
  const [code, setCode] = useState('X7#K9@2F');
  const [speed, setSpeed] = useState(1);
  const [duration, setDuration] = useState(40);
  const [loop, setLoop] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [settings, setSettings] = useState(false);
  const [screenError, setScreenError] = useState('');

  useEffect(() => {
    const args = new URLSearchParams(window.location.search);
    const name = args.get('applet');
    if (name && Object.hasOwn(applets, name)) setApplet(name as AppletName);
    const requestedSpeed = Number(args.get('speed'));
    if ([.5, 1, 2].includes(requestedSpeed)) setSpeed(requestedSpeed);
    const requestedDuration = Number(args.get('duration'));
    if (requestedDuration >= 5 && requestedDuration <= 300) setDuration(requestedDuration);
    if (args.get('loop') === 'false') setLoop(false);
    const onFullscreen = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onFullscreen);
    return () => document.removeEventListener('fullscreenchange', onFullscreen);
  }, []);

  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => {
      setProgress(previous => previous >= 100 ? (loop ? 0 : 100) : Math.min(100, previous + 10 * speed / duration));
    }, 100);
    return () => clearInterval(timer);
  }, [running, speed, duration, loop]);
  useEffect(() => {
    if (!running || progress >= 100) return;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*';
    const timer = setInterval(() => setCode(Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')), 90);
    return () => clearInterval(timer);
  }, [running, progress >= 100]);

  const restart = () => { setProgress(0); setRunning(true); };
  const toggleFullscreen = async () => {
    try { if (document.fullscreenElement) await document.exitFullscreen(); else await document.documentElement.requestFullscreen(); }
    catch { setScreenError('Fullscreen is unavailable in this preview. Open the screen in a separate browser tab.'); }
  };

  return <main className={`screen ${fullscreen ? 'is-fullscreen' : ''}`}>
    <div className="ambient-grid" aria-hidden="true" />
    <header className="screen-header"><a href="/" className="brand"><span className="brand-symbol"><Command /></span>CIPHER<span className="brand-divider" /><span className="brand-subtitle">CINEMATIC SYSTEMS</span></a><div className="header-right"><span className="header-indicator" />SYSTEM ONLINE<span className="header-version">V.01.06</span></div></header>
    <div className="scene-caption"><span className="eyebrow">SCREEN SIMULATION / 001</span><span className="caption-rule" /><span>Nothing real. Everything cinematic.</span></div>
    <section className={`applet-window theme-${applet}`} aria-label="Cinematic simulation applet">
      <div className="window-chrome"><div className="window-title"><SquareTerminal />cipher / {applet}.applet</div><div className="window-chrome-right"><span><LockKeyhole /> ENCRYPTED SESSION</span><Button variant="screenIcon" size="icon" title="Toggle fullscreen" aria-label="Toggle fullscreen" onClick={toggleFullscreen}>{fullscreen ? <Minimize /> : <Expand />}</Button></div></div>
      <div className="window-content"><LoadingApplet applet={applet} progress={progress} code={code} running={running} /></div>
      <div className="window-footer"><span><i />{progress >= 100 ? 'SEQUENCE COMPLETE' : running ? 'SIMULATION RUNNING' : 'SIMULATION PAUSED'}</span><span>SESSION <strong>8F2A–04C1</strong><LockKeyhole /></span></div>
    </section>
    <div className="controls-wrap"><div className="controls-toolbar"><div className="applet-picker"><SquareTerminal /><label className="sr-only" htmlFor="applet">Applet</label><select id="applet" value={applet} onChange={event => { setApplet(event.target.value as AppletName); restart(); }}>{Object.entries(applets).map(([key, config]) => <option value={key} key={key}>{config.label} applet</option>)}</select><ChevronDown /></div><span className="control-divider" /><Button variant="controlIcon" size="icon" aria-label={running ? 'Pause simulation' : 'Play simulation'} title={running ? 'Pause' : 'Play'} onClick={() => setRunning(!running)}>{running ? <Pause /> : <Play />}</Button><Button variant="controlIcon" size="icon" aria-label="Restart simulation" title="Restart" onClick={restart}><RotateCcw /></Button><Button variant="controlIcon" size="icon" className={loop ? 'control-selected' : ''} aria-label="Loop simulation" aria-pressed={loop} title="Loop" onClick={() => setLoop(!loop)}><Repeat2 /></Button><span className="control-divider" /><label className="speed-picker"><span>SPEED</span><select aria-label="Animation speed" value={speed} onChange={event => setSpeed(Number(event.target.value))}><option value={.5}>0.5×</option><option value={1}>1.0×</option><option value={2}>2.0×</option></select></label><span className="control-divider" /><Button variant="controlIcon" size="icon" aria-label="Simulation settings" title="Settings" aria-expanded={settings} onClick={() => setSettings(!settings)}><SlidersHorizontal /></Button><Button variant="controlIcon" size="icon" aria-label="Enter fullscreen" title="Fullscreen" onClick={toggleFullscreen}>{fullscreen ? <Minimize /> : <Expand />}</Button></div>{settings && <div className="settings-panel"><label htmlFor="duration">Sequence duration <strong>{duration}s</strong></label><input id="duration" type="range" min="5" max="120" step="5" value={duration} onChange={event => setDuration(Number(event.target.value))} /><span>SIMULATED DATA ONLY</span></div>}<div className="control-caption"><span className="little-dot" />{loop ? 'CONTINUOUS LOOP' : 'SINGLE SEQUENCE'}<span>•</span>NO NETWORK ACTIVITY</div>{screenError && <p className="fullscreen-error" role="alert">{screenError}</p>}</div>
    <footer className="screen-footer"><span>DESIGNED FOR THE SCREEN.<br /><strong>NOT THE REAL WORLD.</strong></span><span className="footer-center">1080 × 1920 <span>/</span> SCALABLE OUTPUT</span><span className="footer-right">CIPHER STUDIO<ArrowUpRight /></span></footer>
  </main>;
}
