export default function Loader() {
  return (
    <div className="flex items-center justify-center py-10">
      <svg className="h-6 w-6 animate-spin text-brand" viewBox="0 0 50 50">
        <circle className="opacity-30" cx="25" cy="25" r="20" stroke="currentColor" strokeWidth="5" fill="none" />
        <circle className="text-brand" cx="25" cy="25" r="20" stroke="currentColor" strokeWidth="5" fill="none" strokeDasharray="100" strokeDashoffset="75" />
      </svg>
    </div>
  );
}
