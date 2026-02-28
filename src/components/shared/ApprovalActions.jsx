import { Check, Pencil, X } from 'lucide-react';

const sizeMap = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
};

export default function ApprovalActions({ onApprove, onEdit, onReject, size = 'sm' }) {
  const s = sizeMap[size];

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onApprove}
        className={`inline-flex items-center gap-1.5 rounded-md font-medium bg-green-600 text-white hover:bg-green-700 transition-colors ${s}`}
      >
        <Check size={14} />
        Approve
      </button>
      <button
        onClick={onEdit}
        className={`inline-flex items-center gap-1.5 rounded-md font-medium border border-blue-300 text-blue-600 hover:bg-blue-50 transition-colors ${s}`}
      >
        <Pencil size={14} />
        Edit
      </button>
      <button
        onClick={onReject}
        className={`inline-flex items-center gap-1.5 rounded-md font-medium border border-red-300 text-red-600 hover:bg-red-50 transition-colors ${s}`}
      >
        <X size={14} />
        Reject
      </button>
    </div>
  );
}
