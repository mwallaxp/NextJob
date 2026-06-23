import { MoreHorizontal } from "lucide-react";

const ActionMenu = ({ label = "Open actions", isOpen, onToggle, children }) => (
  <div className="relative inline-flex">
    <button
      type="button"
      onClick={onToggle}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-950"
      title={label}
      aria-label={label}
    >
      <MoreHorizontal size={18} />
    </button>
    {isOpen && (
      <div className="absolute right-0 top-11 z-10 w-48 rounded-xl border border-zinc-200 bg-white py-2 text-sm shadow-xl">
        {children}
      </div>
    )}
  </div>
);

export default ActionMenu;
