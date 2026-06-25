'use client';

import { useEffect, useState } from 'react';

import { Sidebar } from '@/components/ui/sidebar';
import { apiFetch } from '@/services/api';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import {
  Users,
  GraduationCap,
  BookOpen,
  ClipboardList,
  MessageSquare,
  School,
} from 'lucide-react';

type DashboardData = {
  turmas: number;
  alunos: number;
  docentes: number;
  usuarios: number;
  unidadesCurriculares: number;
  aulas: number;
  observacoes: number;
};

const cards = [
  {
    title: 'Turmas',
    key: 'turmas',
    description: 'Turmas cadastradas',
    icon: School,
  },
  {
    title: 'Alunos',
    key: 'alunos',
    description: 'Alunos registrados',
    icon: Users,
  },
  {
    title: 'UCs',
    key: 'unidadesCurriculares',
    description: 'Unidades curriculares',
    icon: BookOpen,
  },
  {
    title: 'Aulas',
    key: 'aulas',
    description: 'Aulas planejadas',
    icon: ClipboardList,
  },
  {
    title: 'Observações',
    key: 'observacoes',
    description: 'Registros pedagógicos',
    icon: MessageSquare,
  },
  {
    title: 'Acessos',
    key: 'usuarios',
    description: 'Usuários do sistema',
    icon: GraduationCap,
  },
] as const;

export default function DashboardPage() {
  const [dados, setDados] = useState<DashboardData | null>(null);

  useEffect(() => {
    apiFetch('/dashboard').then(setDados);
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <main className="flex-1 px-10 py-8">
        <div className="mb-8 rounded-2xl bg-slate-950 p-8 text-white shadow-sm">
          <p className="mb-2 text-sm font-medium text-blue-300">
            Visão geral
          </p>

          <h1 className="text-3xl font-bold">
            Dashboard PCTD
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-slate-300">
            Acompanhe os principais dados do planejamento docente,
            turmas, unidades curriculares, aulas e observações pedagógicas.
          </p>
        </div>

        {!dados ? (
          <p className="text-sm text-slate-500">Carregando indicadores...</p>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {cards.map((card) => {
              const Icon = card.icon;

              return (
                <Card key={card.key} className="border-0 shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <div>
                      <CardTitle className="text-base font-semibold text-slate-800">
                        {card.title}
                      </CardTitle>

                      <p className="text-sm text-slate-500">
                        {card.description}
                      </p>
                    </div>

                    <div className="rounded-xl bg-blue-100 p-3 text-blue-700">
                      <Icon size={22} />
                    </div>
                  </CardHeader>

                  <CardContent>
                    <p className="text-4xl font-bold text-slate-900">
                      {dados[card.key]}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}