import axios from 'axios';

export type ScheduleStatus = 'WFH' | 'WFO' | 'WEEKEND' | 'HOLIDAY/CUTI';

export interface ScheduleItem {
  date: string;
  day: string;
  status: ScheduleStatus;
  notes?: string;
}

export class WfhCalculator {
  private parseDate(dateStr: string): Date {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  private formatDate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  private getDayName(date: Date): string {
    const days = [
      'Minggu',
      'Senin',
      'Selasa',
      'Rabu',
      'Kamis',
      'Jumat',
      'Sabtu',
    ];
    return days[date.getDay()];
  }

  // UPDATE: Menggunakan API lokal untuk Cuti Bersama + Fallback Nager API
  private async fetchIndonesianHolidays(startYear: number, endYear: number) {
    const holidays = new Map<string, string>();

    try {
      for (let year = startYear; year <= endYear; year++) {
        try {
          // 1. Coba API Khusus Indonesia (Mendukung Cuti Bersama SKB 3 Menteri)
          const response = await axios.get(
            `https://dayoffapi.vercel.app/api?year=${year}`,
            { timeout: 5000 }
          );

          const data = response.data;
          if (Array.isArray(data)) {
            data.forEach((holiday: any) => {
              // API ini me-return: { tanggal: 'YYYY-MM-DD', keterangan: '...', is_cuti: boolean }
              holidays.set(holiday.tanggal, holiday.keterangan);
            });
          }
        } catch (error: any) {
          console.warn(
            `API Lokal gagal untuk tahun ${year}, mencoba Fallback Nager API...`
          );

          // 2. FALLBACK: Jika API lokal down, pakai Nager API (Hanya Libur Nasional)
          try {
            const fallbackResponse = await axios.get(
              `https://date.nager.at/api/v3/PublicHolidays/${year}/ID`,
              { timeout: 5000 }
            );
            const fallbackData = fallbackResponse.data;
            if (Array.isArray(fallbackData)) {
              fallbackData.forEach((holiday: any) => {
                holidays.set(holiday.date, holiday.localName);
              });
            }
          } catch (fallbackError: any) {
            console.warn(
              `Fallback Nager API juga gagal tahun ${year}:`,
              fallbackError.message
            );
          }
        }
      }
    } catch (error) {
      console.error('Fatal error saat mengambil data libur:', error);
      return new Map<string, string>();
    }

    return holidays;
  }

  public async generateSchedule(
    startDate: string,
    endDate: string,
    anchorDate: string,
    customLeaves: string[] = []
  ): Promise<ScheduleItem[]> {
    const actualStart = this.parseDate(startDate);
    const end = this.parseDate(endDate);

    const currentDate = this.parseDate(anchorDate);

    // Fetch data libur & cuti bersama
    const publicHolidays = await this.fetchIndonesianHolidays(
      currentDate.getFullYear(),
      end.getFullYear()
    );

    const schedule: ScheduleItem[] = [];
    let workDayCounter = 0;

    while (currentDate <= end) {
      const dateString = this.formatDate(currentDate);
      const dayOfWeek = currentDate.getDay();
      const dayName = this.getDayName(currentDate);

      const isPublicHoliday = publicHolidays.has(dateString);
      const isCustomLeave = customLeaves.includes(dateString);

      let currentStatus: ScheduleStatus = 'WFO';
      let currentNotes = '';

      if (dayOfWeek === 0 || dayOfWeek === 6) {
        currentStatus = 'WEEKEND';
      } else if (isPublicHoliday || isCustomLeave) {
        currentStatus = 'HOLIDAY/CUTI';
        // Jika libur dari API, ambil keterangannya (misal: "Cuti Bersama Idul Fitri")
        currentNotes = isPublicHoliday
          ? publicHolidays.get(dateString)!
          : 'Cuti Pribadi';
      } else {
        const isWfh = workDayCounter % 4 === 0;
        currentStatus = isWfh ? 'WFH' : 'WFO';
        workDayCounter++;
      }

      if (currentDate >= actualStart) {
        schedule.push({
          date: dateString,
          day: dayName,
          status: currentStatus,
          ...(currentNotes && { notes: currentNotes }),
        });
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return schedule;
  }
}
