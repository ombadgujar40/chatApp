// src/components/Composer.jsx
import React from "react";

export default function Composer({ text, onChange, onSend }) {
  return (
    <div className="p-3 border-t border-white/5 flex gap-3 items-center">
      <input
        value={text}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => e.key === "Enter" ? onSend() : null}
        placeholder="Type a message"
        className="flex-1 px-3 py-2 rounded-lg bg-transparent border border-white/5 text-sm text-muted"
      />
      <button onClick={onSend} className="px-4 py-2 bg-accent text-slate-900 rounded-lg font-semibold">Send</button>
    </div>
  );
}
