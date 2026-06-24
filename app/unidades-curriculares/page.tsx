'use client';

import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/ui/sidebar';
import { apiFetch } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Turma = {
  id: string;
  nome: string;
};

type Docente = {
  id: string;
  nome: string;
  email: string;
};

type UC = {
  id: string;
  nome: string;
  cargaHoraria: number;
  quantAulas: number;
  turma?: { nome: string };
  docente?: { nome: string };
};

export default function UnidadesCurricularesPage() {
  const [ucs, setUcs] = useState<UC[]>([]);
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [docentes, setDocentes] = useState<Docente[]>([]);

  const [nome, setNome] = useState('');
  const [cargaHoraria, setCargaHoraria] = useState('');
  const [quantAulas, setQuantAulas] = useState('');
  const [turmaId, setTurmaId] = useState('');
  const [docenteId, setDocenteId] = useState('');

  async function carregarDados() {
    const [ucsData, turmasData, docentesData] = await Promise.all([
      apiFetch('/unidades-curriculares'),
      apiFetch('/turmas'),
      apiFetch('/docentes'),
    ]);



    setUcs(ucsData);
    setTurmas(turmasData);
    setDocentes(docentesData);

    if (!turmaId && turmasData.length > 0) {
      setTurmaId(turmasData[0].id);
    }

    if (!docenteId && docentesData.length > 0) {
      setDocenteId(docentesData[0].id);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  async function cadastrarUC(event: React.FormEvent) {
    event.preventDefault();

    await apiFetch('/unidades-curriculares', {
      method: 'POST',
      body: JSON.stringify({
        nome,
        cargaHoraria: Number(cargaHoraria),
        quantAulas: Number(quantAulas),
        turmaId,
        docenteId,
      }),
    });

    setNome('');
    setCargaHoraria('');
    setQuantAulas('');

    carregarDados();
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <main className="flex-1 px-10 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Unidades Curriculares</h1>
          <p className="text-sm text-slate-500">
            Cadastre as UCs vinculadas às turmas e aos docentes responsáveis.
          </p>
        </div>

        <Card className="mb-8 border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Cadastrar nova UC</CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={cadastrarUC} className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Nome da UC
                </label>
                <Input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: Programação Back-End" />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Carga horária
                </label>
                <Input type="number" value={cargaHoraria} onChange={(e) => setCargaHoraria(e.target.value)} placeholder="Ex: 120" />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Quantidade de aulas
                </label>
                <Input type="number" value={quantAulas} onChange={(e) => setQuantAulas(e.target.value)} placeholder="Ex: 30" />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Turma
                </label>
                <select className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm" value={turmaId} onChange={(e) => setTurmaId(e.target.value)}>
                  {turmas.map((turma) => (
                    <option key={turma.id} value={turma.id}>
                      {turma.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Docente responsável
                </label>
                <select className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm" value={docenteId} onChange={(e) => setDocenteId(e.target.value)}>
                  {docentes.map((docente) => (
                    <option key={docente.id} value={docente.id}>
                      {docente.nome} - {docente.email}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end md:col-span-2">
                <Button type="submit" className="h-10 w-full md:w-64">
                  Cadastrar UC
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {ucs.map((uc) => (
            <Card key={uc.id} className="border-0 shadow-sm">
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">{uc.nome}</h2>
                  <p className="text-sm text-slate-500">
                    Turma: {uc.turma?.nome ?? '-'}
                  </p>
                  <p className="text-sm text-slate-500">
                    Docente: {uc.docente?.nome ?? '-'}
                  </p>
                </div>

                <div className="flex gap-3 text-sm">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                    {uc.cargaHoraria}h
                  </span>
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-blue-700">
                    {uc.quantAulas} aulas
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}