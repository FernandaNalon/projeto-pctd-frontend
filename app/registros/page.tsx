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

type Comentario = {
  id: string;
  comentario: string;
  createdAt: string;
  usuario?: {
    nome: string;
  };
};

type Registro = {
  id: string;
  titulo: string;
  descricao: string;
  categoria: string;
  prioridade: string;
  status: string;
  data: string;
  turma?: {
    nome: string;
  };
  aluno?: {
    nomeCompleto: string;
  };
  autor?: {
    nome: string;
  };
  comentarios: Comentario[];
};

export default function RegistrosPage() {
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [registros, setRegistros] = useState<Registro[]>([]);

  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categoria, setCategoria] = useState('PEDAGOGICA');
  const [prioridade, setPrioridade] = useState('MEDIA');
  const [status, setStatus] = useState('ABERTO');
  const [data, setData] = useState('');
  const [turmaId, setTurmaId] = useState('');
  const [alunoId, setAlunoId] = useState('');

  const [comentarios, setComentarios] = useState<Record<string, string>>({});

  async function carregarDados() {
    const [turmasData, alunosData, registrosData] = await Promise.all([
      apiFetch('/turmas'),
      apiFetch('/alunos'),
      apiFetch('/registros'),
    ]);

    setTurmas(turmasData);
    setAlunos(alunosData);
    setRegistros(registrosData);
  }

  useEffect(() => {
    carregarDados();
  }, []);

  const alunosFiltrados = turmaId
    ? alunos.filter((aluno) => aluno.turmaId === turmaId)
    : alunos;

  async function salvarRegistro(event: React.FormEvent) {
    event.preventDefault();

    const usuarioSalvo = localStorage.getItem('pctd_user');
    const usuario = usuarioSalvo ? JSON.parse(usuarioSalvo) : null;

    await apiFetch('/registros', {
      method: 'POST',
      body: JSON.stringify({
        titulo,
        descricao,
        categoria,
        prioridade,
        status,
        data,
        turmaId: turmaId || undefined,
        alunoId: alunoId || undefined,
        autorId: usuario.id,
      }),
    });

    setTitulo('');
    setDescricao('');
    setCategoria('PEDAGOGICA');
    setPrioridade('MEDIA');
    setStatus('ABERTO');
    setData('');
    setTurmaId('');
    setAlunoId('');

    carregarDados();
  }

  async function atualizarRegistro(
    id: string,
    campo: 'status' | 'prioridade' | 'categoria',
    valor: string,
  ) {
    await apiFetch(`/registros/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        [campo]: valor,
      }),
    });

    carregarDados();
  }

  async function publicarComentario(registroId: string) {
    const texto = comentarios[registroId];

    if (!texto) {
      return;
    }

    const usuarioSalvo = localStorage.getItem('pctd_user');
    const usuario = usuarioSalvo ? JSON.parse(usuarioSalvo) : null;

    await apiFetch(`/registros/${registroId}/comentarios`, {
      method: 'POST',
      body: JSON.stringify({
        comentario: texto,
        usuarioId: usuario.id,
      }),
    });

    setComentarios({
      ...comentarios,
      [registroId]: '',
    });

    carregarDados();
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <main className="flex-1 px-10 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Registros internos
          </h1>

          <p className="text-sm text-slate-500">
            Registre comunicados, acompanhamentos e observações para a equipe.
          </p>
        </div>

        <Card className="mb-8 border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Novo registro</CardTitle>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={salvarRegistro}
              className="grid grid-cols-1 gap-5 md:grid-cols-2"
            >
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Título
                </label>
                <Input
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Ex.: Acompanhamento de frequência"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Data
                </label>
                <Input
                  type="date"
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Categoria
                </label>
                <select
                  className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm"
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                >
                  <option value="PEDAGOGICA">Pedagógica</option>
                  <option value="COMUNICADO">Comunicado</option>
                  <option value="ACOMPANHAMENTO">Acompanhamento</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Prioridade
                </label>
                <select
                  className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm"
                  value={prioridade}
                  onChange={(e) => setPrioridade(e.target.value)}
                >
                  <option value="BAIXA">Baixa</option>
                  <option value="MEDIA">Média</option>
                  <option value="ALTA">Alta</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Status
                </label>
                <select
                  className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="ABERTO">Aberto</option>
                  <option value="EM_ANDAMENTO">Em andamento</option>
                  <option value="CONCLUIDO">Concluído</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Turma relacionada opcional
                </label>
                <select
                  className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm"
                  value={turmaId}
                  onChange={(e) => {
                    setTurmaId(e.target.value);
                    setAlunoId('');
                  }}
                >
                  <option value="">Nenhuma turma</option>
                  {turmas.map((turma) => (
                    <option key={turma.id} value={turma.id}>
                      {turma.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Aluno relacionado opcional
                </label>
                <select
                  className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm"
                  value={alunoId}
                  onChange={(e) => setAlunoId(e.target.value)}
                >
                  <option value="">Nenhum aluno</option>
                  {alunosFiltrados.map((aluno) => (
                    <option key={aluno.id} value={aluno.id}>
                      {aluno.nomeCompleto}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Descrição
                </label>
                <Textarea
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  className="min-h-28"
                  placeholder="Descreva o registro inicial"
                />
              </div>

              <div className="md:col-span-2 flex justify-end">
                <Button
                  type="submit"
                  disabled={!titulo || !descricao || !data}
                >
                  Salvar registro
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {registros.map((registro) => (
            <Card key={registro.id} className="border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      {registro.titulo}
                    </h2>

                    <p className="text-sm text-slate-500">
                      {registro.turma?.nome ?? 'Geral'}
                      {registro.aluno
                        ? ` · ${registro.aluno.nomeCompleto}`
                        : ''}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <select
                      className="h-9 rounded-md border border-slate-300 bg-white px-2 text-xs"
                      value={registro.categoria}
                      onChange={(e) =>
                        atualizarRegistro(
                          registro.id,
                          'categoria',
                          e.target.value,
                        )
                      }
                    >
                      <option value="PEDAGOGICA">Pedagógica</option>
                      <option value="COMUNICADO">Comunicado</option>
                      <option value="ACOMPANHAMENTO">Acompanhamento</option>
                    </select>

                    <select
                      className="h-9 rounded-md border border-slate-300 bg-white px-2 text-xs"
                      value={registro.prioridade}
                      onChange={(e) =>
                        atualizarRegistro(
                          registro.id,
                          'prioridade',
                          e.target.value,
                        )
                      }
                    >
                      <option value="BAIXA">Baixa</option>
                      <option value="MEDIA">Média</option>
                      <option value="ALTA">Alta</option>
                    </select>

                    <select
                      className="h-9 rounded-md border border-slate-300 bg-white px-2 text-xs"
                      value={registro.status}
                      onChange={(e) =>
                        atualizarRegistro(
                          registro.id,
                          'status',
                          e.target.value,
                        )
                      }
                    >
                      <option value="ABERTO">Aberto</option>
                      <option value="EM_ANDAMENTO">Em andamento</option>
                      <option value="CONCLUIDO">Concluído</option>
                    </select>
                  </div>
                </div>

                <p className="mb-4 text-sm text-slate-700">
                  {registro.descricao}
                </p>

                <p className="mb-4 text-xs text-slate-400">
                  {new Date(registro.data).toLocaleDateString('pt-BR')}
                  {registro.autor?.nome
                    ? ` · Registrado por ${registro.autor.nome}`
                    : ''}
                </p>

                <div className="border-t border-slate-100 pt-4">
                  <h3 className="mb-3 text-sm font-semibold text-slate-700">
                    Comentários
                  </h3>

                  <div className="mb-4 space-y-3">
                    {registro.comentarios?.map((comentario) => (
                      <div
                        key={comentario.id}
                        className="rounded-lg bg-slate-50 p-3"
                      >
                        <p className="text-sm text-slate-700">
                          {comentario.comentario}
                        </p>

                        <p className="mt-2 text-xs text-slate-400">
                          {comentario.usuario?.nome ?? 'Usuário'}
                          {' · '}
                          {new Date(
                            comentario.createdAt,
                          ).toLocaleString('pt-BR')}
                        </p>
                      </div>
                    ))}

                    {registro.comentarios?.length === 0 && (
                      <p className="text-sm text-slate-400">
                        Nenhum comentário ainda.
                      </p>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <Textarea
                      value={comentarios[registro.id] ?? ''}
                      onChange={(e) =>
                        setComentarios({
                          ...comentarios,
                          [registro.id]: e.target.value,
                        })
                      }
                      placeholder="Adicionar comentário"
                      className="min-h-16"
                    />

                    <Button
                      type="button"
                      onClick={() => publicarComentario(registro.id)}
                      disabled={!comentarios[registro.id]}
                    >
                      Publicar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {registros.length === 0 && (
            <p className="text-sm text-slate-500">
              Nenhum registro interno cadastrado.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}