'use client';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { classNames } from '@/utils/classNames';
import { addDays, format, startOfWeek } from 'date-fns';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const WORK_DAYS = [
  { label: 'Senin', value: '1' },
  { label: 'Selasa', value: '2' },
  { label: 'Rabu', value: '3' },
  { label: 'Kamis', value: '4' },
  { label: 'Jumat', value: '5' },
];

export interface TaglineProps {
  className?: string;
  title?: string;
  description?: string;
}

export interface LoginCardProps {
  className?: string;
}

function Tagline({ className, title, description }: TaglineProps) {
  return (
    <div className={classNames(className, 'flex flex-col gap-3 px-3')}>
      <h1 className="text-4xl font-bold tracking-tight text-gray-900">
        {title}
      </h1>
      <p className="text-lg text-gray-500">{description}</p>
    </div>
  );
}

function LoginCard({ className }: LoginCardProps) {
  const router = useRouter();
  const [selectedDay, setSelectedDay] = useState<string>('');

  const handleLogin = () => {
    if (!selectedDay) return alert('Pilih hari terlebih dahulu!');

    const startOfCurrentWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
    const targetDate = addDays(startOfCurrentWeek, parseInt(selectedDay) - 1);
    const formattedAnchorDate = format(targetDate, 'yyyy-MM-dd');

    localStorage.setItem('wfhAnchorDate', formattedAnchorDate);

    router.push('/dashboard');
  };

  return (
    <div
      className={classNames(
        className,
        'mx-6 flex w-full flex-col gap-8 rounded-md px-3 md:mx-14'
      )}
    >
      <div id="login-card-title" className="space-y-2">
        <h3 className="text-2xl font-bold tracking-tight text-gray-900">
          Mulai Perhitungan
        </h3>
        <p className="text-sm text-gray-500">
          Pilih hari apa jadwal WFH kamu dimulai pada minggu ini.
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Hari Mulai WFH
        </label>
        <Select onValueChange={setSelectedDay}>
          <SelectTrigger className="h-12 w-full">
            <SelectValue placeholder="Pilih hari..." />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Hari Kerja</SelectLabel>
              {WORK_DAYS.map((day) => (
                <SelectItem key={day.value} value={day.value}>
                  {day.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <Button
        className="h-12 w-full text-base font-semibold text-white"
        onClick={handleLogin}
        disabled={!selectedDay}
      >
        Masuk Dashboard <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
    </div>
  );
}

export default function Login() {
  return (
    <section className="container mx-auto flex min-h-screen items-center justify-center overflow-hidden bg-neutral-50">
      <div className="mx-4 flex h-full w-full items-center lg:mx-20 2xl:mx-0">
        <Tagline
          className="hidden w-1/2 pr-12 lg:flex"
          title="Sinkronisasi jadwal WFH kamu dengan presisi."
          description="Tentukan titik awal jadwal WFH kamu minggu ini, dan biarkan sistem menghitung otomatis siklus kerja kamu ke depannya tanpa terganggu tanggal merah."
        />
        <div className="flex h-[450px] w-full items-center justify-center rounded-2xl bg-white shadow-xl lg:w-1/2">
          <LoginCard />
        </div>
      </div>
    </section>
  );
}
