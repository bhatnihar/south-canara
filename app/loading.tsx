export default function Loading() {
  return (
    <div className="container-content py-20">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse overflow-hidden rounded-sm border border-stone-200">
            <div className="aspect-[4/3] bg-stone-200" />
            <div className="space-y-3 p-5">
              <div className="h-3 w-1/2 rounded bg-stone-200" />
              <div className="h-4 w-3/4 rounded bg-stone-200" />
              <div className="h-3 w-1/3 rounded bg-stone-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
