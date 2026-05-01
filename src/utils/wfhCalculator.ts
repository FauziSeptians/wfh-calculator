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

  // MENGGUNAKAN GOOGLE CALENDAR (100% Dinamis & Anti-Mati)
  private async fetchGoogleHolidays(startYear: number, endYear: number) {
    const holidays = new Map<string, string>();

    try {
      // URL Publik Kalender Libur Indonesia dari Google
      const url =
        'https://calendar.google.com/calendar/ical/id.indonesian%23holiday%40group.v.calendar.google.com/public/basic.ics';

      const response = await axios.get(url, { timeout: 10000 });
      const icsData = response.data;

      // Parsing file .ics manual (sangat ringan dan cepat)
      const lines = icsData.split(/\r?\n/);
      let currentEvent: { date?: string; summary?: string } = {};

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (line.startsWith('BEGIN:VEVENT')) {
          currentEvent = {}; // Reset untuk event baru
        } else if (line.startsWith('DTSTART;VALUE=DATE:')) {
          // Format Google: DTSTART;VALUE=DATE:20260215
          const dateStr = line.split(':')[1];
          if (dateStr && dateStr.length === 8) {
            const y = dateStr.substring(0, 4);
            const m = dateStr.substring(4, 6);
            const d = dateStr.substring(6, 8);
            currentEvent.date = `${y}-${m}-${d}`;
          }
        } else if (line.startsWith('SUMMARY')) {
          // Format Google: SUMMARY:Cuti Bersama Idul Fitri
          const parts = line.split(':');
          if (parts.length > 1) {
            currentEvent.summary = parts.slice(1).join(':').trim();
          }
        } else if (line.startsWith('END:VEVENT')) {
          // Jika event selesai di-parsing, masukkan ke Map
          if (currentEvent.date && currentEvent.summary) {
            const eventYear = parseInt(currentEvent.date.substring(0, 4));

            // Filter hanya ambil tahun yang kita butuhkan agar memori efisien
            if (eventYear >= startYear && eventYear <= endYear) {
              holidays.set(currentEvent.date, currentEvent.summary);
            }
          }
        }
      }
    } catch (error) {
      console.error('Gagal mengambil data dari Google Calendar:', error);
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

    // Panggil fungsi Google Calendar
    const publicHolidays = await this.fetchGoogleHolidays(
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
