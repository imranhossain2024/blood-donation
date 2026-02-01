
export function SkeletonStats() {
  return (
    <div className="mb-8 grid gap-4 md:grid-cols-3 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="card h-24 bg-gray-100/50" />
      ))}
    </div>
  );
}

export function SkeletonGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-pulse">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="card h-48 bg-gray-100/50" />
      ))}
    </div>
  );
}
