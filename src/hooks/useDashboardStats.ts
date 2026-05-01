import { CalendarEventItem } from '@/components/atom/EventCalendar';
import { useWfhSchedule } from '@/hooks/useWfhSchedule';
import { format } from 'date-fns';
import { id } from 'date-fns/locale/id';
import { useMemo } from 'react';

export function useDashboardStats(currentDate: Date) {
  const { data: scheduleData, isFetching } = useWfhSchedule(currentDate);

  const stats = useMemo(() => {
    const actualToday = new Date();
    actualToday.setHours(0, 0, 0, 0);
    const todayString = format(actualToday, 'yyyy-MM-dd');

    let statusToday = 'Memuat...';
    let nextWfhDate = 'Memuat...';
    let wfhUsed = 0;
    let wfhTotal = 0;
    let wfhProgress = 0;
    let events: CalendarEventItem[] = [];

    const parseDateString = (dateStr: string) => {
      const [year, month, day] = dateStr.split('-').map(Number);
      return new Date(year, month - 1, day);
    };

    if (scheduleData) {
      const todaySchedule = scheduleData.find(
        (d: any) => d.date === todayString
      );
      statusToday = todaySchedule
        ? todaySchedule.status === 'HOLIDAY/CUTI'
          ? 'Libur / Cuti'
          : todaySchedule.status
        : 'Tidak ada jadwal';

      const futureWfh = scheduleData.find((d: any) => {
        return d.status === 'WFH' && parseDateString(d.date) > actualToday;
      });
      nextWfhDate = futureWfh
        ? format(parseDateString(futureWfh.date), 'EEEE, dd MMM yyyy', {
            locale: id,
          })
        : 'Belum ada jadwal';

      const currentMonthStr = format(currentDate, 'yyyy-MM');
      const thisMonthSchedules = scheduleData.filter((d: any) =>
        d.date.startsWith(currentMonthStr)
      );

      const wfhDaysThisMonth = thisMonthSchedules.filter(
        (d: any) => d.status === 'WFH'
      );
      wfhTotal = wfhDaysThisMonth.length;

      const wfhDaysPassed = wfhDaysThisMonth.filter(
        (d: any) => parseDateString(d.date) <= actualToday
      );
      wfhUsed = wfhDaysPassed.length;

      if (wfhTotal > 0) {
        wfhProgress = Math.round((wfhUsed / wfhTotal) * 100);
      }

      events = scheduleData
        .filter((item: any) => item.status !== 'WEEKEND')
        .map((item: any) => {
          const date = parseDateString(item.date);
          let bgColor = '#3b82f6';
          let title = '🏢 WFO';

          if (item.status === 'WFH') {
            bgColor = '#22c55e';
            title = '🏠 WFH';
          } else if (item.status === 'HOLIDAY/CUTI') {
            bgColor = '#ef4444';
            title = `🏖️ ${item.notes || 'Libur'}`;
          }

          return { title, start: date, end: date, bgColor, textColor: 'white' };
        });
    }

    return { statusToday, nextWfhDate, wfhUsed, wfhTotal, wfhProgress, events };
  }, [scheduleData, currentDate]);

  return { ...stats, isFetching };
}
