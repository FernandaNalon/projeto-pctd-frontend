'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/services/api';
import { Sidebar } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type DashboardData = {
  turmas: number;
  alunos: number;
  docentes: number;
  usuarios: number;
  unidadesCurriculares: number;
  aulas: number;
  observacoes: number;
};

export default function DashboardPage() {
  const [dados, setDados] = useState<DashboardData | null>(null);

  useEffect(() => {
    apiFetch('/dashboard').then(setDados);
  }, []);

  if (!dados) {
    return <main className="p-8">Carregando...</main>;
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">Dashboard PCTD</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card><CardHeader><CardTitle>Turmas</CardTitle></CardHeader><CardContent className="text-3xl font-bold">{dados.turmas}</CardContent></Card>
          <Card><CardHeader><CardTitle>Alunos</CardTitle></CardHeader><CardContent className="text-3xl font-bold">{dados.alunos}</CardContent></Card>
          <Card><CardHeader><CardTitle>Docentes</CardTitle></CardHeader><CardContent className="text-3xl font-bold">{dados.docentes}</CardContent></Card>
          <Card><CardHeader><CardTitle>Usuários</CardTitle></CardHeader><CardContent className="text-3xl font-bold">{dados.usuarios}</CardContent></Card>
          <Card><CardHeader><CardTitle>UCs</CardTitle></CardHeader><CardContent className="text-3xl font-bold">{dados.unidadesCurriculares}</CardContent></Card>
          <Card><CardHeader><CardTitle>Aulas</CardTitle></CardHeader><CardContent className="text-3xl font-bold">{dados.aulas}</CardContent></Card>
          <Card><CardHeader><CardTitle>Observações</CardTitle></CardHeader><CardContent className="text-3xl font-bold">{dados.observacoes}</CardContent></Card>
        </div>
      </main>
    </div>
  );
}