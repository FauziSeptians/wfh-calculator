import { axiosInstance } from '@/lib/axios';
import { useQuery } from '@tanstack/react-query';
import {
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek,
} from 'date-fns';

export function useWfhSchedule(currentDate: Date) {
  const startDate = format(
    startOfWeek(startOfMonth(currentDate)),
    'yyyy-MM-dd'
  );
  const endDate = format(endOfWeek(endOfMonth(currentDate)), 'yyyy-MM-dd');

  return useQuery({
    queryKey: ['wfh-schedule', startDate, endDate],
    queryFn: async () => {
      // Ambil anchorDate dari localStorage
      const anchorDate = localStorage.getItem('wfhAnchorDate');

      if (!anchorDate) {
        throw new Error('Titik awal WFH belum diatur. Silakan login kembali.');
      }

      const response = await axiosInstance.post('/wfh-calculator', {
        startDate,
        endDate,
        anchorDate, // Kirim ke API
        customLeaves: [],
      });

      return response.data.schedule;
    },
    staleTime: 1000 * 60 * 5,
    placeholderData: (previousData) => previousData,
  });
}
