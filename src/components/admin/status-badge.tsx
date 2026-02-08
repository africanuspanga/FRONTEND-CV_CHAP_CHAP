'use client';

const STATUS_STYLES: Record<string, string> = {
  // Payment statuses
  completed: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  failed: 'bg-red-100 text-red-700',
  // CV statuses
  draft: 'bg-gray-100 text-gray-700',
  pending_payment: 'bg-yellow-100 text-yellow-700',
  paid: 'bg-green-100 text-green-700',
  downloaded: 'bg-blue-100 text-blue-700',
  // Roles
  admin: 'bg-red-100 text-red-700',
  user: 'bg-gray-100 text-gray-700',
};

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const style = STATUS_STYLES[status] || 'bg-gray-100 text-gray-700';
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${style}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
}
