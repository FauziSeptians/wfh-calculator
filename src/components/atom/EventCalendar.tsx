'use client';

import { format, getDay, parse, startOfWeek } from 'date-fns';
import { id } from 'date-fns/locale/id';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Calendar, dateFnsLocalizer, Event } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = { 'id-ID': id };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export interface CalendarEventItem extends Event {
  title: string;
  start: Date;
  end: Date;
  bgColor?: string;
  textColor?: string;
}

interface EventCalendarProps {
  events: CalendarEventItem[];
  height?: string | number;
  date: Date;
  onNavigate: (newDate: Date) => void;
  isLoading?: boolean;
}

const CustomToolbar = (toolbar: any) => {
  const goToBack = () => {
    toolbar.onNavigate('PREV');
  };

  const goToNext = () => {
    toolbar.onNavigate('NEXT');
  };

  const goToCurrent = () => {
    toolbar.onNavigate('TODAY');
  };

  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-xl font-bold text-gray-800 capitalize">
        {toolbar.label}
      </h2>

      <div className="flex items-center gap-2">
        <button
          onClick={goToBack}
          className="flex h-9 w-9 items-center justify-center rounded-md border bg-white transition-colors hover:bg-gray-100"
          title="Bulan Sebelumnya"
        >
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </button>

        <button
          onClick={goToCurrent}
          className="h-9 rounded-md border bg-white px-4 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
        >
          Hari Ini
        </button>

        <button
          onClick={goToNext}
          className="flex h-9 w-9 items-center justify-center rounded-md border bg-white transition-colors hover:bg-gray-100"
          title="Bulan Selanjutnya"
        >
          <ChevronRight className="h-5 w-5 text-gray-600" />
        </button>
      </div>
    </div>
  );
};

export default function EventCalendar({
  events,
  height = 600,
  date,
  onNavigate,
  isLoading,
}: EventCalendarProps) {
  const eventStyleGetter = (event: CalendarEventItem) => {
    return {
      style: {
        backgroundColor: event.bgColor || '#3174ad',
        color: event.textColor || 'white',
        borderRadius: '6px',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2px 8px',
        fontWeight: '500',
        fontSize: '0.9rem',
        height: '85px',
        opacity: isLoading ? 0.5 : 1,
      },
    };
  };

  return (
    <div
      className="relative rounded-xl bg-white p-4 shadow-sm"
      style={{ height }}
    >
      {isLoading && (
        <div className="absolute top-4 right-4 z-10 animate-pulse text-sm font-medium text-blue-500">
          Memuat data...
        </div>
      )}

      <Calendar
        localizer={localizer}
        events={events}
        date={date}
        onNavigate={onNavigate}
        startAccessor="start"
        endAccessor="end"
        culture="id-ID"
        eventPropGetter={eventStyleGetter}
        views={['month']}
        defaultView="month"
        components={{
          toolbar: CustomToolbar,
        }}
      />
    </div>
  );
}
