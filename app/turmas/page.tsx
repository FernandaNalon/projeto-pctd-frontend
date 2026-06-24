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
  periodo: string;
  curso: string;
  status: string;
};

export default function TurmasPage() {
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [nome, setNome] = useState('');
  const [curso, setCurso] = useState('');
  const [periodo, setPeriodo] = useState('NOITE');
  const [dataInicio, setDataInicio] = useState('');
  const [dataConclusao, setDataConclusao] = useState('');

  async function carregarTurmas() {
    const data = await apiFetch('/turmas');
    setTurmas(data);
  }

  useEffect(() => {
    carregarTurmas();
  }, []);

  async function cadastrarTurma(event: React.FormEvent) {
    event.preventDefault();

    await apiFetch('/turmas', {
      method: 'POST',
      body: JSON.stringify({
        nome,
        curso,
        periodo,
        dataInicio,
        dataFim: dataConclusao || dataInicio,
        status: 'ATIVA',
      }),
    });

    setNome('');
    setCurso('');
    setPeriodo('NOITE');
    setDataInicio('');
    setDataConclusao('');

    carregarTurmas();
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <main className="flex-1 px-10 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Turmas</h1>
          <p className="text-sm text-slate-500">
            Cadastre e acompanhe as turmas vinculadas ao PCTD.
          </p>
        </div>

        <Card className="mb-8 border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Cadastrar nova turma</CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={cadastrarTurma} className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Nome da turma
                </label>
                <Input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: TII 13" />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Curso
                </label>
                <Input value={curso} onChange={(e) => setCurso(e.target.value)} placeholder="Ex: Técnico em Informática para Internet" />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Período
                </label>
                <select className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm" value={periodo} onChange={(e) => setPeriodo(e.target.value)}>
                  <option value="MANHA">Manhã</option>
                  <option value="TARDE">Tarde</option>
                  <option value="NOITE">Noite</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Data de início
                </label>
                <Input type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Data de conclusão
                  <span className="ml-1 font-normal text-slate-400">(opcional)</span>
                </label>
                <Input type="date" value={dataConclusao} onChange={(e) => setDataConclusao(e.target.value)} />
              </div>

              <div className="flex items-end">
                <Button type="submit" className="h-10 w-full">
                  Cadastrar turma
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {turmas.map((turma) => (
            <Card key={turma.id} className="border-0 shadow-sm">
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">{turma.nome}</h2>
                  <p className="text-sm text-slate-500">{turma.curso}</p>
                </div>

                <div className="flex gap-3 text-sm">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                    {turma.periodo}
                  </span>
                  <span className="rounded-full bg-green-100 px-3 py-1 text-green-700">
                    {turma.status}
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