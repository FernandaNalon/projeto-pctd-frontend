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

type Aluno = {
  id: string;
  idInterno?: string;
  nomeCompleto: string;
  email?: string;
  telefone?: string;
  status: string;
  turma?: {
    nome: string;
  };
};

export default function AlunosPage() {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [turmas, setTurmas] = useState<Turma[]>([]);

  const [idInterno, setIdInterno] = useState('');
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [status, setStatus] = useState('ATIVO');
  const [turmaId, setTurmaId] = useState('');

  async function carregarDados() {
    const [alunosData, turmasData] = await Promise.all([
      apiFetch('/alunos'),
      apiFetch('/turmas'),
    ]);

    setAlunos(alunosData);
    setTurmas(turmasData);

    if (!turmaId && turmasData.length > 0) {
      setTurmaId(turmasData[0].id);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  async function cadastrarAluno(event: React.FormEvent) {
    event.preventDefault();

    await apiFetch('/alunos', {
      method: 'POST',
      body: JSON.stringify({
        idInterno: idInterno || undefined,
        nomeCompleto,
        email: email || undefined,
        telefone: telefone || undefined,
        status,
        turmaId,
      }),
    });

    setIdInterno('');
    setNomeCompleto('');
    setEmail('');
    setTelefone('');
    setStatus('ATIVO');

    carregarDados();
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <main className="flex-1 px-10 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Alunos</h1>
          <p className="text-sm text-slate-500">
            Cadastre e acompanhe os alunos vinculados às turmas.
          </p>
        </div>

        <Card className="mb-8 border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Cadastrar novo aluno</CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={cadastrarAluno} className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  ID interno
                </label>
                <Input value={idInterno} onChange={(e) => setIdInterno(e.target.value)} placeholder="Ex: 001" />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Nome completo
                </label>
                <Input value={nomeCompleto} onChange={(e) => setNomeCompleto(e.target.value)} placeholder="Nome do aluno" />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  E-mail
                </label>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@exemplo.com" />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Telefone
                </label>
                <Input value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="(11) 99999-9999" />
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

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Status
                </label>
                <select className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="ATIVO">Ativo</option>
                  <option value="EVADIDO">Evadido</option>
                  <option value="TRANSFERIDO">Transferido</option>
                  <option value="CONCLUIDO">Concluído</option>
                </select>
              </div>

              <div className="flex items-end md:col-span-2">
                <Button type="submit" className="h-10 w-full md:w-64">
                  Cadastrar aluno
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {alunos.map((aluno) => (
            <Card key={aluno.id} className="border-0 shadow-sm">
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    {aluno.nomeCompleto}
                  </h2>
                  <p className="text-sm text-slate-500">
                    {aluno.email ?? 'Sem e-mail'} · {aluno.telefone ?? 'Sem telefone'}
                  </p>
                  <p className="text-sm text-slate-500">
                    Turma: {aluno.turma?.nome ?? '-'}
                  </p>
                </div>

                <div className="flex gap-3 text-sm">
                  {aluno.idInterno && (
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                      ID {aluno.idInterno}
                    </span>
                  )}

                  <span className="rounded-full bg-blue-100 px-3 py-1 text-blue-700">
                    {aluno.status}
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