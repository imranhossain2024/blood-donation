export default function Loading() {
  return (
    <div className="flex min-h-[50vh] w-full items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-100 border-t-brand-600"></div>
        <p className="animate-pulse text-sm font-medium text-brand-800">Loading...</p>
      </div>
    </div>
  );
}
