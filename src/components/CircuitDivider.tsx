export default function CircuitDivider() {
  return (
    <div className="flex items-center justify-center gap-3 w-full max-w-xs mx-auto py-6" aria-hidden="true">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/20 to-primary/10" />
      <div className="flex gap-2">
        <div className="h-2 w-2 rounded-full bg-primary/25 animate-pulse" />
        <div className="h-2 w-2 rounded-full bg-secondary/30 animate-pulse" style={{ animationDelay: '0.3s' }} />
        <div className="h-2 w-2 rounded-full bg-accent-pink/25 animate-pulse" style={{ animationDelay: '0.6s' }} />
      </div>
      <div className="flex-1 h-px bg-gradient-to-r from-primary/10 via-primary/20 to-transparent" />
    </div>
  )
}
