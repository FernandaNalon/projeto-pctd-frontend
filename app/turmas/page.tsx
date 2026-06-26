'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

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
  const [aba, setAba] = useState<'ativas' | 'arquivadas'>('ativas');

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
        ...(dataConclusao ? { dataFim: dataConclusao } : {}),
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

  async function arquivarTurma(id: string) {
    const confirmar = confirm('Deseja arquivar esta turma?');

    if (!confirmar) return;

    await apiFetch(`/turmas/${id}`, {
      method: 'DELETE',
    });

    carregarTurmas();
  }

  const turmasAtivas = turmas.filter((turma) => turma.status !== 'ARQUIVADA');
  const turmasArquivadas = turmas.filter((turma) => turma.status === 'ARQUIVADA');
  const turmasExibidas = aba === 'ativas' ? turmasAtivas : turmasArquivadas;

  async function desarquivarTurma(id: string) {
    const confirmar = confirm('Deseja restaurar esta turma?');

    if (!confirmar) {
      return;
    }

    await apiFetch(`/turmas/${id}/desarquivar`, {
      method: 'PATCH',
    });

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

        <Card className="mb-10 border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Cadastrar nova turma</CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={cadastrarTurma} className="space-y-6">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Nome da turma
                  </label>
                  <Input
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Ex.: TII12"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Curso
                  </label>
                  <select
                    value={curso}
                    onChange={(e) => setCurso(e.target.value)}
                    className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm"
                  >
                    <option value="">Selecione...</option>
                    <option value="Técnico em Informática para Internet">
                      Técnico em Informática para Internet
                    </option>
                    <option value="Técnico em Desenvolvimento de Sistemas">
                      Técnico em Desenvolvimento de Sistemas
                    </option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Período
                  </label>
                  <select
                    className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm"
                    value={periodo}
                    onChange={(e) => setPeriodo(e.target.value)}
                  >
                    <option value="MANHA">Manhã</option>
                    <option value="TARDE">Tarde</option>
                    <option value="NOITE">Noite</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Data de início
                  </label>
                  <Input
                    type="date"
                    value={dataInicio}
                    onChange={(e) => setDataInicio(e.target.value)}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Data de conclusão
                    <span className="ml-1 font-normal text-slate-400">
                      (opcional)
                    </span>
                  </label>
                  <Input
                    type="date"
                    value={dataConclusao}
                    onChange={(e) => setDataConclusao(e.target.value)}
                  />
                </div>
              </div>

              <Button type="submit" className="h-11 w-full">
                Cadastrar turma
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mb-6 flex gap-2 border-b border-slate-200">
          <button
            onClick={() => setAba('ativas')}
            className={`px-4 py-3 text-sm font-medium ${aba === 'ativas'
                ? 'border-b-2 border-blue-600 text-blue-700'
                : 'text-slate-500 hover:text-slate-900'
              }`}
          >
            Turmas ativas ({turmasAtivas.length})
          </button>

          <button
            onClick={() => setAba('arquivadas')}
            className={`px-4 py-3 text-sm font-medium ${aba === 'arquivadas'
                ? 'border-b-2 border-blue-600 text-blue-700'
                : 'text-slate-500 hover:text-slate-900'
              }`}
          >
            Arquivadas ({turmasArquivadas.length})
          </button>
        </div>

        <div className="space-y-4">
          {turmasExibidas.map((turma) => (
            <Card key={turma.id} className="border-0 shadow-sm">
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    {turma.nome}
                  </h2>
                  <p className="text-sm text-slate-500">{turma.curso}</p>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                    {turma.periodo}
                  </span>

                  <span className="rounded-full bg-green-100 px-3 py-1 text-green-700">
                    {turma.status}
                  </span>

                  <Link
                    href={`/turmas/${turma.id}`}
                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    Abrir turma
                  </Link>

                  {aba === 'ativas' ? (
                    <button
                      type="button"
                      onClick={() => arquivarTurma(turma.id)}
                      className="rounded-md border border-amber-200 px-4 py-2 text-sm font-medium text-amber-700 hover:bg-amber-50"
                    >
                      Arquivar
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => desarquivarTurma(turma.id)}
                      className="rounded-md border border-green-200 px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-50"
                    >
                      Restaurar
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {turmasExibidas.length === 0 && (
            <p className="text-sm text-slate-500">
              Nenhuma turma encontrada nesta seção.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}