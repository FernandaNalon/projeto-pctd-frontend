'use client';

import { useEffect, useState } from 'react';

import { Sidebar } from '@/components/ui/sidebar';
import { apiFetch } from '@/services/api';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

type Turma = {
  id: string;
  nome: string;
};

type Aluno = {
  id: string;
  nomeCompleto: string;
  turmaId: string;
};

type Observacao = {
  id: string;
  descricao: string;
  data: string;
  aluno?: {
    nomeCompleto: string;
  };
};

export default function ObservacoesPage() {
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [observacoes, setObservacoes] = useState<Observacao[]>([]);

  const [turmaId, setTurmaId] = useState('');
  const [alunoId, setAlunoId] = useState('');
  const [data, setData] = useState('');
  const [descricao, setDescricao] = useState('');

  async function carregarDados() {
    const [turmasData, alunosData, observacoesData] = await Promise.all([
      apiFetch('/turmas'),
      apiFetch('/alunos'),
      apiFetch('/observacoes'),
    ]);

    setTurmas(turmasData);
    setAlunos(alunosData);
    setObservacoes(observacoesData);

    if (!turmaId && turmasData.length > 0) {
      setTurmaId(turmasData[0].id);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  const alunosDaTurma = alunos.filter((aluno) => aluno.turmaId === turmaId);

  async function cadastrarObservacao(event: React.FormEvent) {
    event.preventDefault();

    const usuarioSalvo = localStorage.getItem('pctd_user');
    const usuario = usuarioSalvo ? JSON.parse(usuarioSalvo) : null;

    await apiFetch('/observacoes', {
      method: 'POST',
      body: JSON.stringify({
        descricao,
        data,
        alunoId,
        docenteId: usuario.id,
      }),
    });

    setDescricao('');
    setData('');

    carregarDados();
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <main className="flex-1 px-10 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Observações Pedagógicas
          </h1>

          <p className="text-sm text-slate-500">
            Registre acompanhamentos importantes sobre os alunos.
          </p>
        </div>

        <Card className="mb-8 border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Nova observação</CardTitle>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={cadastrarObservacao}
              className="grid grid-cols-1 gap-5 md:grid-cols-2"
            >
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Turma
                </label>

                <select
                  className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm"
                  value={turmaId}
                  onChange={(e) => {
                    setTurmaId(e.target.value);
                    setAlunoId('');
                  }}
                >
                  {turmas.map((turma) => (
                    <option key={turma.id} value={turma.id}>
                      {turma.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Aluno
                </label>

                <select
                  className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm"
                  value={alunoId}
                  onChange={(e) => setAlunoId(e.target.value)}
                >
                  <option value="">Selecione um aluno</option>

                  {alunosDaTurma.map((aluno) => (
                    <option key={aluno.id} value={aluno.id}>
                      {aluno.nomeCompleto}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Data
                </label>

                <Input
                  type="date"
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Observação
                </label>

                <Textarea
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Descreva a observação pedagógica"
                  className="min-h-24"
                />
              </div>

              <div className="md:col-span-2 flex justify-end">
                <Button type="submit" disabled={!alunoId || !data || !descricao}>
                  Registrar observação
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-3">
          {observacoes.map((observacao) => (
            <Card key={observacao.id} className="border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="mb-2 flex items-center justify-between">
                  <h2 className="font-semibold text-slate-900">
                    {observacao.aluno?.nomeCompleto ?? 'Aluno não informado'}
                  </h2>

                  <span className="text-sm text-slate-500">
                    {new Date(observacao.data).toLocaleDateString('pt-BR')}
                  </span>
                </div>

                <p className="text-sm text-slate-600">
                  {observacao.descricao}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}