export default function SearchBar() {
  return (
    <div className="mt-2">
      <input
        placeholder="Search chats..."
        className="w-full px-3 py-2 rounded-lg bg-transparent border border-white/5 text-sm text-muted"
        disabled
      />
    </div>
  );
}
