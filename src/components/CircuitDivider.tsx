export default function CircuitDivider() {
  return (
    <div className="circuit-divider" aria-hidden="true">
      <div className="circuit-divider-line">
        <div className="circuit-divider-glow" />
      </div>
      <div className="circuit-divider-node">
        <div className="circuit-divider-node-inner" />
      </div>
      <div className="circuit-divider-line">
        <div className="circuit-divider-glow" />
      </div>
      <div className="circuit-divider-node">
        <div className="circuit-divider-node-inner" />
      </div>
      <div className="circuit-divider-line">
        <div className="circuit-divider-glow" />
      </div>
    </div>
  )
}
