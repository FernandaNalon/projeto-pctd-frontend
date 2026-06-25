'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
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
  dataInicio: string;
  dataFim: string;
  status: string;
};

type Aluno = {
  id: string;
  idInterno?: string;
  nomeCompleto: string;
  email?: string;
  telefone?: string;
  status: string;
  turmaId: string;
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
  turmaId: string;
  docente?: {
    nome: string;
  };
};

export default function TurmaDetalhesPage() {
  const params = useParams();
  const turmaId = params.turmaId as string;

  const [aba, setAba] = useState<'alunos' | 'ucs'>('alunos');
  const [editandoTurma, setEditandoTurma] = useState(false);

  const [turma, setTurma] = useState<Turma | null>(null);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [ucs, setUcs] = useState<UC[]>([]);
  const [docentes, setDocentes] = useState<Docente[]>([]);

  const [nomeTurma, setNomeTurma] = useState('');
  const [cursoTurma, setCursoTurma] = useState('');
  const [periodoTurma, setPeriodoTurma] = useState('NOITE');
  const [dataInicioTurma, setDataInicioTurma] = useState('');
  const [dataFimTurma, setDataFimTurma] = useState('');
  const [statusTurma, setStatusTurma] = useState('ATIVA');

  const [idInterno, setIdInterno] = useState('');
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [emailAluno, setEmailAluno] = useState('');
  const [telefone, setTelefone] = useState('');
  const [statusAluno, setStatusAluno] = useState('ATIVO');

  const [nomeUc, setNomeUc] = useState('');
  const [cargaHoraria, setCargaHoraria] = useState('');
  const [quantAulas, setQuantAulas] = useState('');
  const [docenteId, setDocenteId] = useState('');

  async function carregarDados() {
    const [turmaData, alunosData, ucsData, docentesData] = await Promise.all([
      apiFetch(`/turmas/${turmaId}`),
      apiFetch('/alunos'),
      apiFetch('/unidades-curriculares'),
      apiFetch('/docentes'),
    ]);

    setTurma(turmaData);
    setDocentes(docentesData);

    setNomeTurma(turmaData.nome);
    setCursoTurma(turmaData.curso);
    setPeriodoTurma(turmaData.periodo);
    setDataInicioTurma(turmaData.dataInicio?.slice(0, 10) ?? '');
    setDataFimTurma(turmaData.dataFim?.slice(0, 10) ?? '');
    setStatusTurma(turmaData.status);

    setAlunos(alunosData.filter((aluno: Aluno) => aluno.turmaId === turmaId));
    setUcs(ucsData.filter((uc: UC) => uc.turmaId === turmaId));

    if (!docenteId && docentesData.length > 0) {
      setDocenteId(docentesData[0].id);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  async function atualizarTurma(event: React.FormEvent) {
    event.preventDefault();

    await apiFetch(`/turmas/${turmaId}`, {
      method: 'PUT',
      body: JSON.stringify({
        nome: nomeTurma,
        curso: cursoTurma,
        periodo: periodoTurma,
        dataInicio: dataInicioTurma,
        dataFim: dataFimTurma,
        status: statusTurma,
      }),
    });

    setEditandoTurma(false);
    await carregarDados();
  }

  async function cadastrarAluno(event: React.FormEvent) {
    event.preventDefault();

    await apiFetch('/alunos', {
      method: 'POST',
      body: JSON.stringify({
        idInterno: idInterno || undefined,
        nomeCompleto,
        email: emailAluno || undefined,
        telefone: telefone || undefined,
        status: statusAluno,
        turmaId,
      }),
    });

    setIdInterno('');
    setNomeCompleto('');
    setEmailAluno('');
    setTelefone('');
    setStatusAluno('ATIVO');

    carregarDados();
  }

  async function cadastrarUc(event: React.FormEvent) {
    event.preventDefault();

    await apiFetch('/unidades-curriculares', {
      method: 'POST',
      body: JSON.stringify({
        nome: nomeUc,
        cargaHoraria: Number(cargaHoraria),
        quantAulas: Number(quantAulas),
        turmaId,
        docenteId,
      }),
    });

    setNomeUc('');
    setCargaHoraria('');
    setQuantAulas('');

    carregarDados();
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <main className="flex-1 px-10 py-8">
        <Link
          href="/turmas"
          className="mb-6 inline-flex text-sm font-medium text-blue-700 hover:text-blue-900"
        >
          ← Voltar para turmas
        </Link>

        <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                {turma?.nome ?? 'Carregando...'}
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                {turma?.curso ?? 'Carregando informações da turma...'}
              </p>

              {turma && (
                <div className="mt-5 flex flex-wrap gap-3">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                    {turma.periodo}
                  </span>

                  <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
                    {turma.status}
                  </span>

                  <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
                    {alunos.length} alunos
                  </span>

                  <span className="rounded-full bg-purple-100 px-3 py-1 text-sm text-purple-700">
                    {ucs.length} UCs
                  </span>
                </div>
              )}
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => setEditandoTurma(!editandoTurma)}
            >
              {editandoTurma ? 'Cancelar edição' : 'Editar turma'}
            </Button>
          </div>

          {editandoTurma && (
            <form
              onSubmit={atualizarTurma}
              className="mt-6 grid grid-cols-1 gap-5 border-t border-slate-100 pt-6 md:grid-cols-2"
            >
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Nome da turma
                </label>
                <Input
                  value={nomeTurma}
                  onChange={(e) => setNomeTurma(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Curso
                </label>
                <Input
                  value={cursoTurma}
                  onChange={(e) => setCursoTurma(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Período
                </label>
                <select
                  className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm"
                  value={periodoTurma}
                  onChange={(e) => setPeriodoTurma(e.target.value)}
                >
                  <option value="MANHA">Manhã</option>
                  <option value="TARDE">Tarde</option>
                  <option value="NOITE">Noite</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Status
                </label>
                <select
                  className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm"
                  value={statusTurma}
                  onChange={(e) => setStatusTurma(e.target.value)}
                >
                  <option value="ATIVA">Ativa</option>
                  <option value="ENCERRADA">Encerrada</option>
                  <option value="CANCELADA">Cancelada</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Data de início
                </label>
                <Input
                  type="date"
                  value={dataInicioTurma}
                  onChange={(e) => setDataInicioTurma(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Data prevista de conclusão
                </label>
                <Input
                  type="date"
                  value={dataFimTurma}
                  onChange={(e) => setDataFimTurma(e.target.value)}
                />
              </div>

              <div className="md:col-span-2 flex justify-end">
                <Button type="submit">Salvar alterações</Button>
              </div>
            </form>
          )}
        </div>

        <div className="mb-8 flex gap-2 border-b border-slate-200">
          <button
            onClick={() => setAba('alunos')}
            className={`px-4 py-3 text-sm font-medium ${
              aba === 'alunos'
                ? 'border-b-2 border-blue-600 text-blue-700'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Alunos ({alunos.length})
          </button>

          <button
            onClick={() => setAba('ucs')}
            className={`px-4 py-3 text-sm font-medium ${
              aba === 'ucs'
                ? 'border-b-2 border-blue-600 text-blue-700'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            UCs ({ucs.length})
          </button>
        </div>

        {aba === 'alunos' && (
          <>
            <Card className="mb-8 border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Adicionar aluno</CardTitle>
              </CardHeader>

              <CardContent>
                <form
                  onSubmit={cadastrarAluno}
                  className="grid grid-cols-1 gap-5 md:grid-cols-2"
                >
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      ID interno
                    </label>
                    <Input
                      value={idInterno}
                      onChange={(e) => setIdInterno(e.target.value)}
                      placeholder="Ex.: 001"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Nome completo
                    </label>
                    <Input
                      value={nomeCompleto}
                      onChange={(e) => setNomeCompleto(e.target.value)}
                      placeholder="Ex.: Ana Souza"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      E-mail
                    </label>
                    <Input
                      value={emailAluno}
                      onChange={(e) => setEmailAluno(e.target.value)}
                      placeholder="Ex.: aluno@email.com"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Telefone
                    </label>
                    <Input
                      value={telefone}
                      onChange={(e) => setTelefone(e.target.value)}
                      placeholder="Ex.: (11) 99999-9999"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Status
                    </label>
                    <select
                      className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm"
                      value={statusAluno}
                      onChange={(e) => setStatusAluno(e.target.value)}
                    >
                      <option value="ATIVO">Ativo</option>
                      <option value="EVADIDO">Evadido</option>
                      <option value="TRANSFERIDO">Transferido</option>
                      <option value="CONCLUIDO">Concluído</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <Button type="submit" className="h-10 w-full">
                      Salvar aluno
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-3">
              {alunos.map((aluno) => (
                <Card key={aluno.id} className="border-0 shadow-sm">
                  <CardContent className="flex items-center justify-between p-5">
                    <div>
                      <h2 className="font-semibold text-slate-900">
                        {aluno.nomeCompleto}
                      </h2>

                      <p className="text-sm text-slate-500">
                        {aluno.email ?? 'Sem e-mail'} ·{' '}
                        {aluno.telefone ?? 'Sem telefone'}
                      </p>
                    </div>

                    <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
                      {aluno.status}
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {aba === 'ucs' && (
          <>
            <Card className="mb-8 border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Adicionar unidade curricular</CardTitle>
              </CardHeader>

              <CardContent>
                <form
                  onSubmit={cadastrarUc}
                  className="grid grid-cols-1 gap-5 md:grid-cols-2"
                >
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Nome da UC
                    </label>
                    <Input
                      value={nomeUc}
                      onChange={(e) => setNomeUc(e.target.value)}
                      placeholder="Ex.: Programação Back-End"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Carga horária
                    </label>
                    <Input
                      type="number"
                      value={cargaHoraria}
                      onChange={(e) => setCargaHoraria(e.target.value)}
                      placeholder="Ex.: 120"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Quantidade de aulas
                    </label>
                    <Input
                      type="number"
                      value={quantAulas}
                      onChange={(e) => setQuantAulas(e.target.value)}
                      placeholder="Ex.: 30"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Docente responsável
                    </label>
                    <select
                      className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm"
                      value={docenteId}
                      onChange={(e) => setDocenteId(e.target.value)}
                    >
                      {docentes.map((docente) => (
                        <option key={docente.id} value={docente.id}>
                          {docente.nome} - {docente.email}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-end md:col-span-2">
                    <Button type="submit" className="h-10 w-full md:w-64">
                      Salvar UC
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-3">
              {ucs.map((uc) => (
                <Card key={uc.id} className="border-0 shadow-sm">
                  <CardContent className="flex items-center justify-between p-5">
                    <div>
                      <h2 className="font-semibold text-slate-900">
                        {uc.nome}
                      </h2>

                      <p className="text-sm text-slate-500">
                        {uc.cargaHoraria}h · {uc.quantAulas} aulas · Docente:{' '}
                        {uc.docente?.nome ?? '-'}
                      </p>
                    </div>

                    <Link
                      href={`/aulas/${uc.id}?turmaId=${turmaId}`}
                      className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                      Cronograma de aulas
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}