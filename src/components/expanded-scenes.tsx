import type { AppletProps } from "./cipher-applet";

export const expandedScenes = {
  memory: ["Memory Forensics", "Volatile evidence", "EVIDENCE RECOVERED"],
  intrusion: ["Network Intrusion", "Inside the perimeter", "TARGET REACHED"],
  mitm: ["MITM Attack", "Between the lines", "SESSION CAPTURED"],
  wallet: ["Bitcoin Wallet Tracing", "Follow the money", "DESTINATION IDENTIFIED"],
  wipe: ["Secure Wipe", "Leave no trace", "MEDIA SANITIZED"],
  triangulation: ["Location Triangulation", "Somewhere in the static", "LOCATION LOCKED"],
  firewall: ["Firewall Breach", "Beyond the barrier", "PERIMETER OPEN"],
} as const;
export type ExpandedName = keyof typeof expandedScenes;
const hex = (n: number) =>
  (Math.imul(n + 1, 2654435761) >>> 0).toString(16).padStart(8, "0").toUpperCase();
const hosts = ["EDGE", "RELAY", "GATEWAY", "CORE", "ARCHIVE"];

export function ExpandedScene({
  applet,
  progress,
  running,
}: AppletProps & { applet: ExpandedName }) {
  const [label, title, ending] = expandedScenes[applet];
  const done = progress >= 100;
  const step = Math.floor(progress * 16);
  return (
    <div className={`cinema-scene expanded-scene scene-${applet}`} data-active={running && !done}>
      <div className="scene-kicker">
        <span>{label.toUpperCase()} / SIMULATION</span>
        <span>{done ? "COMPLETE" : running ? "ACTIVE" : "HOLD"}</span>
      </div>
      <div className="scene-title">
        <h1>{done ? ending : title}</h1>
        <span>{progress.toFixed(1)}%</span>
      </div>

      {applet === "memory" && (
        <>
          <div className="memory-dump" aria-label="Simulated memory hex dump">
            {Array.from({ length: 12 }, (_, i) => (
              <div key={i} className={progress >= ((i + 1) * 100) / 12 ? "evidence-found" : ""}>
                <small>0x{hex(i).slice(0, 6)}</small>
                <code>
                  {Array.from({ length: 4 }, (_, j) =>
                    hex(i < progress * 0.12 ? i * 4 + j : step + i * 4 + j),
                  ).join(" ")}
                </code>
                <span>
                  {progress >= ((i + 1) * 100) / 12
                    ? ["SESSION", "KEYFILE", "RECORD"][i % 3]
                    : "........"}
                </span>
              </div>
            ))}
          </div>
          <div className="evidence-cards">
            {["SESSION TOKEN", "PROCESS IMAGE", "DELETED RECORD"].map((item, i) => (
              <div key={item}>
                <span>ARTIFACT / 0{i + 1}</span>
                <strong>{item}</strong>
                <small>{progress >= ((i + 1) * 100) / 3 ? "RECOVERED" : "SCANNING MEMORY"}</small>
              </div>
            ))}
          </div>
        </>
      )}

      {applet === "intrusion" && (
        <>
          <div className="intrusion-map" aria-label="Simulated network intrusion route">
            {hosts.map((host, i) => (
              <div key={host} className={progress >= (i + 1) * 20 ? "host-reached" : ""}>
                <span>ZONE 0{i + 1}</span>
                <div className="host-icon">{["◇", "⌘", "⬡", "▣", "◈"][i]}</div>
                <strong>{host}</strong>
                <small>{progress >= (i + 1) * 20 ? "ROUTE OPEN" : "ISOLATED"}</small>
              </div>
            ))}
          </div>
          <div className="route-lanes">
            {["EXTERNAL", "DEMILITARIZED", "PRIVATE SUBNET"].map((lane, i) => (
              <div key={lane}>
                <span>{lane}</span>
                <div>
                  <i style={{ width: `${Math.max(0, Math.min(100, progress * 3 - i * 100))}%` }} />
                </div>
                <small>{progress >= ((i + 1) * 100) / 3 ? "MAPPED" : "PROBING"}</small>
              </div>
            ))}
          </div>
          <p className="scene-note">ROUTE DISCOVERY / 192.0.2.0 → 198.51.100.24</p>
        </>
      )}

      {applet === "mitm" && (
        <>
          <div className="intercept-route">
            <div>
              <span>ENDPOINT A</span>
              <strong>CLIENT</strong>
              <small>192.0.2.12</small>
            </div>
            <div className="intercept-wire" />
            <div className="intercept-proxy">
              <span>INTERMEDIARY</span>
              <strong>RELAY</strong>
              <small>{done ? "CAPTURE SEALED" : "LISTENING"}</small>
            </div>
            <div className="intercept-wire" />
            <div>
              <span>ENDPOINT B</span>
              <strong>SERVER</strong>
              <small>198.51.100.8</small>
            </div>
          </div>
          <div className="packet-table">
            <div>
              <span>FRAME</span>
              <span>DIRECTION / PAYLOAD</span>
              <span>STATE</span>
            </div>
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i}>
                <small>{String(step + i).padStart(5, "0")}</small>
                <code>
                  {i % 2 ? "B → A" : "A → B"} / {hex(step + i)}
                </code>
                <b>{done ? "ARCHIVED" : running ? "MIRRORED" : "HELD"}</b>
              </div>
            ))}
          </div>
          <div className="scene-metrics">
            <span>SIMULATED PACKETS</span>
            <strong>{Math.floor(progress * 128)}</strong>
            <span>SESSION / TLS PROP</span>
          </div>
        </>
      )}

      {applet === "wallet" && (
        <>
          <div className="wallet-flow" aria-label="Fictional Bitcoin transaction trace">
            <svg viewBox="0 0 640 260" role="img" aria-label="Branching transaction paths">
              <g className="wallet-paths">
                {[55, 130, 205].map((y, i) => (
                  <path
                    key={y}
                    className={progress >= (i + 1) * 25 ? "traced" : ""}
                    d={`M70 130 C170 130 150 ${y} 260 ${y} S400 130 460 130 L570 130`}
                  />
                ))}
              </g>
              {(
                [
                  [70, 130],
                  [260, 55],
                  [260, 130],
                  [260, 205],
                  [460, 130],
                  [570, 130],
                ] as const
              ).map(([x, y], i) => (
                <g
                  key={i}
                  className={progress >= ((i + 1) * 100) / 6 ? "wallet-node traced" : "wallet-node"}
                >
                  <circle cx={x} cy={y} r={i === 0 || i === 5 ? 25 : 15} />
                  <text x={x} y={y + 4} textAnchor="middle">
                    {i === 0 ? "₿" : i === 5 ? "◎" : i}
                  </text>
                  <text className="wallet-label" x={x} y={y + 40} textAnchor="middle">
                    {i === 0 ? "SOURCE" : i === 5 ? "DESTINATION" : "HOP 0" + i}
                  </text>
                </g>
              ))}
            </svg>
          </div>
          <div className="wallet-receipt">
            <span>FICTIONAL LEDGER / NO LIVE FUNDS</span>
            <strong>{done ? "DESTINATION: bc1q…7x4p" : "CORRELATING TRANSACTION OUTPUTS"}</strong>
            <div>
              <span>
                TRACE AMOUNT <b>12.480 BTC</b>
              </span>
              <span>
                CONFIDENCE <b>{(progress * 0.998).toFixed(1)}%</b>
              </span>
            </div>
          </div>
        </>
      )}

      {applet === "wipe" && (
        <>
          <div className="wipe-summary">
            <div>
              <span>VOLUME / EVIDENCE_04</span>
              <strong>
                {(512 * (1 - progress / 100)).toFixed(1)}
                <small> GB REMAINING</small>
              </strong>
            </div>
            <span>{done ? "VERIFIED EMPTY" : "OVERWRITE IN PROGRESS"}</span>
          </div>
          <div className="wipe-grid" aria-label="Simulated disk sanitization">
            {Array.from({ length: 160 }, (_, i) => (
              <i
                key={i}
                className={
                  i < Math.floor(progress * 1.6)
                    ? "erased"
                    : i === Math.floor(progress * 1.6)
                      ? "erase-head"
                      : ""
                }
              />
            ))}
          </div>
          <div className="wipe-legend">
            <span>■ ALLOCATED</span>
            <span>□ SANITIZED</span>
            <span>{Math.floor(progress * 1.6)} / 160 SECTORS</span>
          </div>
          <div className="wipe-result">
            {done ? "∅" : hex(step)}
            <small>{done ? "NO RESIDUAL DATA" : "REWRITING FICTIONAL SECTORS"}</small>
          </div>
        </>
      )}

      {applet === "triangulation" && (
        <>
          <div className="location-map">
            <svg viewBox="0 0 640 340" role="img" aria-label="Simulated triangulation map">
              <defs>
                <pattern id="location-grid" width="32" height="32" patternUnits="userSpaceOnUse">
                  <path d="M32 0H0V32" fill="none" stroke="currentColor" strokeWidth=".5" />
                </pattern>
              </defs>
              <rect width="640" height="340" fill="url(#location-grid)" opacity=".2" />
              <g className="map-streets">
                <path d="M0 90L640 230M100 0L400 340M450 0L180 340M0 280L640 70" />
              </g>
              {(
                [
                  [130, 85],
                  [510, 95],
                  [330, 285],
                ] as const
              ).map(([x, y], i) => (
                <g key={i}>
                  <circle
                    className="location-range"
                    cx={x}
                    cy={y}
                    r={Math.max(30, 240 - progress * 1.2)}
                    style={{ animationDelay: `${-i}s` }}
                  />
                  <path
                    className="location-bearing"
                    d={`M${x} ${y}L330 165`}
                    strokeDasharray={progress > (i + 1) * 25 ? undefined : "4 6"}
                  />
                  <circle className="location-tower" cx={x} cy={y} r="5" />
                  <text x={x + 12} y={y - 12}>
                    TOWER 0{i + 1}
                  </text>
                </g>
              ))}
              <circle
                className="location-lock"
                cx="330"
                cy="165"
                r={Math.max(8, 90 - progress * 0.82)}
              />
              <path className="location-crosshair" d="M315 165H345M330 150V180" />
            </svg>
            <span className="map-coordinate">GRID 37.77 N / 122.42 W — SIMULATED</span>
          </div>
          <div className="scene-metrics">
            <span>POSITION ERROR</span>
            <strong>{done ? "8" : Math.max(8, 2400 - progress * 23.92).toFixed(0)} m</strong>
            <span>{done ? "3 / 3 BEARINGS LOCKED" : "CORRELATING SIGNAL ARRIVAL"}</span>
          </div>
        </>
      )}

      {applet === "firewall" && (
        <>
          <div className="firewall-stage" aria-label="Layered firewall simulation">
            {Array.from({ length: 5 }, (_, i) => (
              <div
                key={i}
                className={progress >= (i + 1) * 20 ? "firewall-layer breached" : "firewall-layer"}
                style={{ width: `${100 - i * 15}%` }}
              >
                <span>LAYER 0{i + 1}</span>
                <div className="firewall-bricks">
                  {Array.from({ length: 14 }, (_, j) => (
                    <i key={j} />
                  ))}
                </div>
                <strong>{progress >= (i + 1) * 20 ? "OPEN" : "BLOCKED"}</strong>
              </div>
            ))}
            <div className="firewall-beam" />
          </div>
          <div className="breach-readout">
            <strong>{Math.floor(progress / 20)} / 5</strong>
            <span>DEFENSIVE LAYERS OPEN</span>
            <small>{done ? "CORRIDOR ESTABLISHED" : "SIMULATED BARRIER ANALYSIS"}</small>
          </div>
        </>
      )}

      <div className="scene-console">
        {done
          ? `> ${ending.toLowerCase()}. sequence complete.`
          : `> ${running ? "processing" : "paused"} / ${label.toLowerCase()} / ${progress.toFixed(1)}%`}
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
