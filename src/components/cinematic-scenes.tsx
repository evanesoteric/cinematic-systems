import type { AppletProps } from "./cipher-applet";

const hex = (n: number) =>
  (Math.imul(n + 1, 2654435761) >>> 0).toString(16).toUpperCase().padStart(8, "0");
const scenes = {
  decrypt: ["ARCHIVE RECOVERY / AES-256", "The block vault", "FILE RESTORED"],
  hash: ["COLLISION ENGINE / SHA-256", "Find the fingerprint.", "MATCH FOUND"],
  bruteforce: ["ACCESS CONTROL / TERMINAL 07", "No way in. Yet.", "ACCESS GRANTED"],
  crypto: ["DISTRIBUTED LEDGER / SANDBOX", "Ghost chain", "CONSENSUS REACHED"],
} as const;

export function CinematicScene({ applet, progress, code, running }: AppletProps) {
  const scene = scenes[applet as keyof typeof scenes];
  const done = progress >= 100;
  const tick = Math.floor(progress * 64);
  return (
    <div className={`cinema-scene scene-${applet}`} data-active={running && !done}>
      <div className="scene-kicker">
        <span>{scene[0]}</span>
        <span>{done ? "RESOLVED" : running ? "ACTIVE" : "HOLD"}</span>
      </div>
      <div className="scene-title">
        <h1>{done ? scene[2] : scene[1]}</h1>
        <span>FICTIONAL SYSTEM</span>
      </div>
      {applet === "decrypt" && (
        <div className="vault-layout">
          <div className="block-cluster" aria-label="Encrypted block cluster">
            {Array.from({ length: 96 }, (_, i) => (
              <div
                key={i}
                className={
                  i < Math.floor(progress * 0.96)
                    ? "resolved"
                    : i === Math.floor(progress * 0.96)
                      ? "scanning"
                      : ""
                }
              >
                <span>{hex(i < progress * 0.96 ? i : i + tick).slice(0, 2)}</span>
              </div>
            ))}
          </div>
          <aside className="vault-index">
            <span>CLASSIFIED_ARCHIVE.ENC</span>
            <strong>
              {progress.toFixed(1)}
              <small>%</small>
            </strong>
            <p>Reconstructing encrypted fragments</p>
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i}>
                <span>SEG 0{i}</span>
                <b>{progress >= (i + 1) * 20 ? "RESTORED" : "SEALED"}</b>
              </div>
            ))}
            <p>{Math.floor(progress * 0.96)} / 96 BLOCKS RESOLVED</p>
          </aside>
        </div>
      )}
      {applet === "hash" && (
        <>
          <div className="hash-target">
            <span>TARGET DIGEST</span>
            <code>{Array.from({ length: 8 }, (_, i) => hex(42 + i)).join("")}</code>
          </div>
          <div className="hash-engine">
            <div className="hash-orbit">
              <div className="orbit-ring" />
              <div className="orbit-ring inner" />
              <div className="orbit-core">
                <strong>{done ? "MATCH" : progress.toFixed(0) + "%"}</strong>
                <span>SEARCH SPACE</span>
              </div>
            </div>
            <div className="candidate-stream">
              <span>CANDIDATE PIPELINE</span>
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i}>
                  <small>{String(tick + i).padStart(5, "0")}</small>
                  <code>
                    {hex(done && i === 5 ? 42 : tick + i)}
                    {hex(done && i === 5 ? 43 : tick + i + 1)}
                  </code>
                  <b>{done && i === 5 ? "HIT" : "×"}</b>
                </div>
              ))}
            </div>
          </div>
          <div className="scene-metrics">
            <span>GPU × 08</span>
            <strong>{running && !done ? "48.7" : "0.0"} GH/s</strong>
            <span>{Math.floor(progress * 487000).toLocaleString("en-US")} CANDIDATES</span>
          </div>
        </>
      )}
      {applet === "bruteforce" && (
        <>
          <div className="password-display" aria-label="Simulated password reconstruction">
            {"MIDNIGHT".split("").map((letter, i) => (
              <div key={i} className={progress >= (i + 1) * 12.5 ? "locked" : ""}>
                <small>0{i + 1}</small>
                <strong>{progress >= (i + 1) * 12.5 ? letter : code[i]}</strong>
                <span>{progress >= (i + 1) * 12.5 ? "LOCKED" : "SCAN"}</span>
              </div>
            ))}
          </div>
          <div className="brute-layout">
            <div className="attempt-log">
              <span>ATTEMPT HISTORY</span>
              {Array.from({ length: 7 }, (_, i) => (
                <div key={i}>
                  <small>#{String(Math.max(0, tick * 173 - (6 - i) * 173)).padStart(7, "0")}</small>
                  <code>{done && i === 6 ? "MIDNIGHT" : hex(tick + i)}</code>
                  <b>{done && i === 6 ? "ACCEPT" : "DENIED"}</b>
                </div>
              ))}
            </div>
            <div className="keyspace">
              <span>KEYSPACE EXHAUSTION</span>
              <strong>{progress.toFixed(1)}%</strong>
              <div className="keyspace-bars">
                {Array.from({ length: 24 }, (_, i) => (
                  <i
                    key={i}
                    className={progress >= ((i + 1) * 100) / 24 ? "filled" : ""}
                    style={{ height: `${25 + ((i * 17) % 75)}%` }}
                  />
                ))}
              </div>
              <p>OFFLINE CANDIDATE SIMULATION</p>
            </div>
          </div>
        </>
      )}
      {applet === "crypto" && (
        <>
          <div className="chain-map">
            <svg viewBox="0 0 640 240" role="img" aria-label="Simulated cryptocurrency network">
              <g className="chain-links">
                {Array.from({ length: 12 }, (_, i) => {
                  const a = (i * Math.PI) / 6;
                  return (
                    <path
                      key={i}
                      d={`M320 120 L${320 + Math.cos(a) * 260} ${120 + Math.sin(a) * 95} L${320 + Math.cos(a + Math.PI / 3) * 260} ${120 + Math.sin(a + Math.PI / 3) * 95}`}
                    />
                  );
                })}
              </g>
              {Array.from({ length: 12 }, (_, i) => (
                <g
                  key={i}
                  className={progress >= ((i + 1) * 100) / 12 ? "node confirmed" : "node"}
                  transform={`translate(${320 + Math.cos((i * Math.PI) / 6) * 260},${120 + Math.sin((i * Math.PI) / 6) * 95})`}
                >
                  <circle r="7" />
                  <text y={i < 6 ? 22 : -14} textAnchor="middle">
                    N{String(i + 1).padStart(2, "0")}
                  </text>
                </g>
              ))}
              <circle className="chain-core" cx="320" cy="120" r="44" />
              <text className="chain-symbol" x="320" y="130" textAnchor="middle">
                ◇
              </text>
            </svg>
            <div className="network-caption">
              <span>12 NODES / TESTNET</span>
              <span>{Math.floor(progress * 0.12)} CONFIRMED</span>
            </div>
          </div>
          <div className="ledger-blocks">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className={progress >= (i + 1) * 25 ? "sealed" : ""}>
                <span>BLOCK {842091 + i}</span>
                <strong>{progress >= (i + 1) * 25 ? "SEALED" : "PENDING"}</strong>
                <code>{hex(71 + i)}</code>
              </div>
            ))}
          </div>
        </>
      )}
      <div className="scene-console">
        {done
          ? `> ${scene[2].toLowerCase()}. sequence complete.`
          : `> ${running ? "processing" : "paused"} / sector ${hex(tick)} / ${code}`}
      </div>
      <div
        className="scene-progress"
        role="progressbar"
        aria-label="Simulation progress"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
