export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14 animate-pulse">
      <div className="h-5 w-32 bg-teal-100 rounded-full mb-6" />
      <div className="h-9 w-3/4 bg-gray-200 rounded-lg mb-4" />
      <div className="h-5 w-full bg-gray-100 rounded mb-2" />
      <div className="h-5 w-5/6 bg-gray-100 rounded mb-8" />
      <div className="h-px w-full bg-gray-100 mb-8" />
      <div className="space-y-5">
        <div className="h-4 w-full bg-gray-100 rounded" />
        <div className="h-4 w-11/12 bg-gray-100 rounded" />
        <div className="h-4 w-full bg-gray-100 rounded" />
        <div className="h-4 w-3/4 bg-gray-100 rounded" />
        <div className="h-32 w-full bg-gray-50 rounded-2xl" />
        <div className="h-4 w-full bg-gray-100 rounded" />
        <div className="h-4 w-5/6 bg-gray-100 rounded" />
      </div>
    </div>
  );
}
