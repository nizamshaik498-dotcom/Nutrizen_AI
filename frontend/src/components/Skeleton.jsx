export function SkeletonCard({ count = 1 }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass-card rounded-2xl p-5 space-y-3">
          <div className="skeleton skeleton-title w-3/4" />
          <div className="skeleton skeleton-text w-full" />
          <div className="skeleton skeleton-text w-2/3" />
        </div>
      ))}
    </div>
  )
}

export function SkeletonPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="skeleton skeleton-title w-64 h-8 mb-6 rounded-xl" />
      <div className="skeleton skeleton-card h-32 mb-6" />
      <SkeletonCard count={3} />
    </div>
  )
}

export function SkeletonScan() {
  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <div className="skeleton skeleton-card h-[300px] rounded-2xl mb-6" />
      <div className="flex gap-3">
        <div className="skeleton skeleton-card flex-1 h-12 rounded-xl" />
        <div className="skeleton skeleton-card w-24 h-12 rounded-xl" />
      </div>
    </div>
  )
}

export function SkeletonHistory() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="skeleton skeleton-card h-24 rounded-2xl mb-6" />
      <div className="grid md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="glass-card rounded-2xl p-4 flex items-center gap-4">
            <div className="skeleton skeleton-avatar w-12 h-12 rounded-xl shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="skeleton skeleton-title w-3/4" />
              <div className="skeleton skeleton-text w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function SkeletonRecipes() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex gap-3 mb-8">
        <div className="skeleton skeleton-card h-10 flex-1 rounded-xl" />
        <div className="skeleton skeleton-card w-10 h-10 rounded-xl" />
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="glass-card rounded-2xl overflow-hidden">
            <div className="skeleton skeleton-card h-40 rounded-none" />
            <div className="p-4 space-y-2">
              <div className="skeleton skeleton-title w-3/4" />
              <div className="skeleton skeleton-text w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}