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
import TEAM_LIST from '@/data/team-list.json';
import { classNames } from '@/utils/classNames';
import { ArrowRight } from 'lucide-react';

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
      <h1 className="text-3xl font-semibold">{title}</h1>
      <p className="opacity-60">{description}</p>
    </div>
  );
}

function LoginCard({ className }: LoginCardProps) {
  return (
    <div
      className={classNames(
        className,
        'mx-14 flex w-full flex-col gap-6 rounded-md px-3'
      )}
    >
      <div id="login-card-title">
        <h3 className="text-2xl font-semibold">Login</h3>
        <p className="opacity-60">
          Choose your department to enter the dashboard.
        </p>
      </div>
      <div>
        <Select>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a fruit" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Team List</SelectLabel>
              {TEAM_LIST.map((team) => (
                <SelectItem
                  key={team.key}
                  value={team.value}
                  defaultValue={'A'}
                >
                  {team.value}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <Button className="h-12 cursor-pointer font-semibold tracking-wide text-neutral-100">
        Masuk Dashboard <ArrowRight />
      </Button>
    </div>
  );
}

export default function Login() {
  return (
    <section className="container mx-auto flex min-h-screen items-center justify-center overflow-hidden bg-neutral-100">
      <div className="mx-20 flex h-full w-full items-center 2xl:mx-0">
        <Tagline
          className="hidden w-3/6 xl:flex"
          title="Coordinate your team's remote schedule with precision"
          description="Select your department's team below to view current availability, office density, and remote work cycles. No login or password required."
        />
        <div className="flex h-96 w-full items-center justify-center rounded-xl bg-white xl:w-3/6">
          <LoginCard />
        </div>
      </div>
    </section>
  );
}
