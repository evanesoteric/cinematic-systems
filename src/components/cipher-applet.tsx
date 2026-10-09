import { useEffect, useRef } from 'react';
import { Fingerprint, ShieldCheck, Radio } from 'lucide-react';

export const applets = {
  decrypt: { label: 'Decryption', verb: 'DECRYPTING', file: 'classified_archive.enc', Icon: Fingerprint },
  verify: { label: 'Verification', verb: 'VERIFYING', file: 'security_signature.key', Icon: ShieldCheck },
  transfer: { label: 'Data transfer', verb: 'TRANSFERRING', file: 'secure_payload.bin', Icon: Radio },
};
export type AppletName = keyof typeof applets;
export type AppletProps = { progress: number; code: string; running: boolean; applet: AppletName };

function SignalField({ running }: { running: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const css = getComputedStyle(canvas);
    const color = css.getPropertyValue('--signal').trim();
    const muted = css.getPropertyValue('--signal-muted').trim();
    let frame = 0;
    let animation = 0;
    const draw = () => {
      if (running) frame += 0.012;
      ctx.clearRect(0, 0, 400, 200);
      for (let row = 0; row < 18; row++) {
        for (let col = 0; col < 44; col++) {
          const x = 14 + col * 8.6;
          const y = 20 + row * 9.4;
          const wave = Math.sin(col * .18 + frame) * Math.cos(row * .26 - frame);
          const distance = Math.hypot((col - 22) / 22, (row - 9) / 9);
          ctx.fillStyle = wave > .25 && distance < .95 ? color : muted;
          ctx.globalAlpha = .35 + Math.max(0, wave) * .65;
          ctx.fillRect(x, y + wave * 5, wave > .5 ? 2.5 : 1.5, 2);
        }
      }
      ctx.globalAlpha = 1;
      animation = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animation);
  }, [running]);
  return <canvas ref={ref} width={400} height={200} className="signal-field" aria-label="Animated encryption signal" />;
}

export function LoadingApplet({ progress, code, running, applet }: AppletProps) {
  const config = applets[applet];
  const Icon = config.Icon;
  const done = progress >= 100;
  return <>
    <div className="applet-intro"><span className="section-index">01 / SECURE OPERATIONS</span><span className="live-tag"><i />{done ? 'COMPLETE' : running ? 'PROCESS ACTIVE' : 'STANDBY'}</span></div>
    <div className="operation-heading"><div className="operation-icon"><Icon strokeWidth={1.3} /></div><div><h1>{config.label} sequence</h1><p>Processing encrypted data stream</p></div><span className="security-level">AES<br /><strong>256</strong></span></div>
    <div className="cipher-readout"><span className={running && !done ? 'flashing-label' : ''}>{done ? 'COMPLETE' : config.verb}:</span><strong>{done ? '00000000' : code}</strong><span className="cursor-mark" /></div>
    <div className="progress-meta"><span>{done ? 'Sequence completed' : 'Resolving encryption blocks'}</span><span><strong>{progress.toFixed(0).padStart(2, '0')}</strong><small>%</small></span></div>
    <div className="loading-track" role="progressbar" aria-label="Simulation progress" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}><div className="loading-fill" style={{ width: `${progress}%` }} /><div className="track-ticks" /></div>
    <div className="progress-scale"><span>0</span><span>25</span><span>50</span><span>75</span><span>100</span></div>
    <div className="analysis-grid"><div className="signal-panel"><div className="panel-label">ENTROPY MONITOR<span>LIVE</span></div><SignalField running={running && !done} /><div className="signal-caption"><span>Signal integrity</span><strong>99.98<span>%</span></strong></div></div><div className="telemetry-panel"><div className="panel-label">STREAM TELEMETRY</div><dl><div><dt>Target file</dt><dd>{config.file}</dd></div><div><dt>Blocks resolved</dt><dd>{Math.floor(progress * 40.96).toLocaleString()} <span>/ 4,096</span></dd></div><div><dt>Throughput</dt><dd>{running ? '128.4' : '0.0'} <span>MB/s</span></dd></div><div><dt>Protocol</dt><dd>TLS 1.3 <span className="secure-text">SECURE</span></dd></div></dl></div></div>
    <div className="terminal"><div><span className="terminal-time">00:00:00</span><span className="terminal-ok">[ OK ]</span> Secure connection established</div><div><span className="terminal-time">00:00:01</span><span className="terminal-ok">[ OK ]</span> Encryption handshake verified</div><div><span className="terminal-time">00:00:02</span><span className="terminal-active">[ {done ? 'OK' : '… '} ]</span> {done ? 'All blocks resolved. Sequence complete.' : 'Decoding block'} {!done && <span className="terminal-block">0x{Math.floor(progress * 655).toString(16).toUpperCase().padStart(4, '0')}</span>}</div></div>
  </>;
}