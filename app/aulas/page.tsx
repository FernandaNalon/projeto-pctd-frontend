'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/ui/sidebar';
import { apiFetch } from '@/services/api';
import { Card, CardContent } from '@/components/ui/card';

type Turma = {
  id: string;
  nome: string;
};

type UC = {
  id: string;
  nome: string;
  cargaHoraria: number;
  quantAulas: number;
  turmaId: string;
  turma?: {
    nome: string;
  };
};

export default function AulasPage() {
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [ucs, setUcs] = useState<UC[]>([]);
  const [turmaId, setTurmaId] = useState('');

  async function carregarDados() {
    const [turmasData, ucsData] = await Promise.all([
      apiFetch('/turmas'),
      apiFetch('/unidades-curriculares'),
    ]);

    setTurmas(turmasData);
    setUcs(ucsData);

    if (!turmaId && turmasData.length > 0) {
      setTurmaId(turmasData[0].id);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  const ucsFiltradas = ucs.filter((uc) => uc.turmaId === turmaId);

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <main className="flex-1 px-10 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Aulas</h1>
          <p className="text-sm text-slate-500">
            Selecione uma turma e acesse a UC para cadastrar o cronograma de aulas.
          </p>
        </div>

        <div className="mb-8 max-w-md">
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Turma
          </label>

          <select
            className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm"
            value={turmaId}
            onChange={(e) => setTurmaId(e.target.value)}
          >
            {turmas.map((turma) => (
              <option key={turma.id} value={turma.id}>
                {turma.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-4">
          {ucsFiltradas.map((uc) => (
            <Link key={uc.id} href={`/aulas/${uc.id}`}>
              <Card className="border-0 shadow-sm transition hover:shadow-md">
                <CardContent className="flex items-center justify-between p-6">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      {uc.nome}
                    </h2>
                    <p className="text-sm text-slate-500">
                      {uc.cargaHoraria}h · {uc.quantAulas} aulas
                    </p>
                  </div>

                  <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
                    Acessar cronograma
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}

          {ucsFiltradas.length === 0 && (
            <p className="text-sm text-slate-500">
              Nenhuma UC cadastrada para esta turma.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}