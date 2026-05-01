'use client';

import EventCalendar from '@/components/atom/EventCalendar';
import StatCard from '@/components/molecules/StatCard';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { Briefcase, CalendarDays, Home, PieChart } from 'lucide-react';
import { useState } from 'react';

export default function DashboardPage() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const {
    statusToday,
    nextWfhDate,
    wfhUsed,
    wfhTotal,
    wfhProgress,
    events,
    isFetching,
  } = useDashboardStats(currentDate);

  return (
    <div className="w-full space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Dashboard WFH
        </h1>
        <p className="text-sm text-gray-500">
          Pantau jadwal kerja dan kuota WFH kamu bulan ini.
        </p>
      </div>

      <div className="flex w-full gap-6">
        <div className="flex w-[40%] flex-col gap-4">
          <StatCard
            title="Status Hari Ini"
            value={statusToday}
            icon={
              statusToday === 'WFH' ? (
                <Home size={24} />
              ) : (
                <Briefcase size={24} />
              )
            }
            iconClassName={
              statusToday === 'WFH'
                ? 'bg-green-100 text-green-600'
                : statusToday === 'WFO'
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-gray-100 text-gray-600'
            }
          />

          <StatCard
            title="WFH Selanjutnya"
            value={nextWfhDate}
            icon={<CalendarDays size={24} />}
            iconClassName="bg-amber-100 text-amber-600"
          />

          <StatCard
            title="Kuota WFH Bulan Ini"
            value={`${wfhUsed} / ${wfhTotal} Hari`}
            icon={<PieChart size={24} />}
            iconClassName="bg-purple-100 text-purple-600"
          >
            <div className="space-y-2">
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full bg-purple-500 transition-all duration-500 ease-in-out"
                  style={{ width: `${wfhProgress}%` }}
                />
              </div>
              <p className="text-right text-xs font-medium text-gray-400">
                {wfhProgress}% Terpakai
              </p>
            </div>
          </StatCard>
        </div>

        <div className="w-[60%]">
          <EventCalendar
            events={events}
            height={650}
            date={currentDate}
            onNavigate={(newDate) => setCurrentDate(newDate)}
            isLoading={isFetching}
          />
        </div>
      </div>
    </div>
  );
}
