'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  LayoutDashboard,
  Users,
  BookOpen,
  ClipboardList,
  MessageSquare,
  Settings,
  LogOut,
} from 'lucide-react';

const items = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/turmas', label: 'Turmas', icon: Users },
  { href: '/alunos', label: 'Alunos', icon: Users },
  {
    href: '/unidades-curriculares',
    label: 'UCs',
    icon: BookOpen,
  },
  { href: '/aulas', label: 'Aulas', icon: ClipboardList },
  {
    href: '/observacoes',
    label: 'Observações',
    icon: MessageSquare,
  },
  { href: '/acessos', label: 'Acessos', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  function logout() {
    localStorage.removeItem('pctd_token');
    localStorage.removeItem('pctd_user');

    window.location.href = '/';
  }

  return (
    <aside className="w-72 min-h-screen bg-slate-950 text-white flex flex-col">

      <div className="p-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold">
          PCTD
        </h1>

        <p className="text-sm text-slate-400">
          Planejamento Docente
        </p>
      </div>

      <nav className="flex-1 p-4 space-y-2">

        {items.map((item) => {
          const Icon = item.icon;

          const ativo =
            pathname === item.href;

          return (
            <Link
              key={item.href}

              href={item.href}

              className={`
                flex items-center
                gap-3
                rounded-lg
                px-4
                py-3
                transition

                ${
                  ativo
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800'
                }
              `}
            >
              <Icon size={18} />

              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">

        <button
          onClick={logout}

          className="
            flex
            w-full
            items-center
            gap-3

            rounded-lg

            px-4

            py-3

            text-slate-300

            hover:bg-slate-800
          "
        >
          <LogOut size={18} />

          Sair
        </button>
      </div>
    </aside>
  );
}