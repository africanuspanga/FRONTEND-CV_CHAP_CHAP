'use client';

import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  delta?: number;
  deltaLabel?: string;
  iconColor?: string;
  valueColor?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  delta,
  deltaLabel = 'this week',
  iconColor = 'text-gray-400',
  valueColor,
}: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-500">{title}</span>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <p className={`text-3xl font-bold ${valueColor || ''}`}>{value}</p>
        {delta !== undefined && (
          <p className="text-xs text-gray-500 mt-1">
            <span className={delta >= 0 ? 'text-green-600' : 'text-red-600'}>
              {delta >= 0 ? '+' : ''}{delta}
            </span>{' '}
            {deltaLabel}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
