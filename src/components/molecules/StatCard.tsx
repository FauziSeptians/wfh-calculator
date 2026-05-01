import { classNames } from '@/utils/classNames';
import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | ReactNode;
  icon: ReactNode;
  iconClassName?: string;
  children?: ReactNode;
}

export default function StatCard({
  title,
  value,
  icon,
  iconClassName,
  children,
}: StatCardProps) {
  return (
    <div className="flex flex-col justify-between rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center gap-4">
        <div
          className={classNames(
            'flex h-12 w-12 shrink-0 items-center justify-center rounded-full',
            iconClassName
          )}
        >
          {icon}
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <div className="text-xl font-bold tracking-tight text-gray-900">
            {value}
          </div>
        </div>
      </div>
      {children && <div className="mt-5">{children}</div>}
    </div>
  );
}
