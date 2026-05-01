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

  private async fetchIndonesianHolidays(startYear: number, endYear: number) {
    const holidays = new Map<string, string>();
    try {
      for (let year = startYear; year <= endYear; year++) {
        try {
          const response = await axios.get(
            `https://date.nager.at/api/v3/PublicHolidays/${year}/ID`,
            { timeout: 5000 }
          );
          const data = response.data;
          if (Array.isArray(data)) {
            data.forEach((holiday: any) => {
              holidays.set(holiday.date, holiday.localName);
            });
          }
        } catch (error: any) {
          console.warn(`Gagal fetch data libur tahun ${year}:`, error.message);
        }
      }
    } catch (error) {
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
