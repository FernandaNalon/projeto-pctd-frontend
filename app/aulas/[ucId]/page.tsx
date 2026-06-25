'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { ChevronDown, ChevronRight, Pencil } from 'lucide-react';
import { Sidebar } from '@/components/ui/sidebar';
import { apiFetch } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';

type UC = {
  id: string;
  nome: string;
  cargaHoraria: number;
  quantAulas: number;
  turma?: {
    nome: string;
  };
};

type AulaSalva = {
  id: string;
  data: string;
  numeroAula: number;
  tema: string;
  conteudoDesenvolvido: string;
  observacoes?: string;
  ucId: string;
};

type AulaFormulario = {
  id?: string;
  numeroAula: number;
  data: string;
  conteudo: string;
  descricao: string;
  observacoes: string;
  editando: boolean;
  aberta: boolean;
};

export default function PlanejamentoUcPage() {
  const params = useParams();
  const ucId = params.ucId as string;
  const searchParams = useSearchParams();
  const turmaId = searchParams.get('turmaId');

  const [uc, setUc] = useState<UC | null>(null);
  const [aulas, setAulas] = useState<AulaFormulario[]>([]);
  const [salvando, setSalvando] = useState<number | null>(null);

  async function carregarDados() {
    const [ucData, aulasData] = await Promise.all([
      apiFetch(`/unidades-curriculares/${ucId}`),
      apiFetch('/aulas'),
    ]);

    setUc(ucData);

    const aulasDaUc = aulasData.filter(
      (aula: AulaSalva) => aula.ucId === ucId,
    );

    const aulasMontadas: AulaFormulario[] = Array.from(
      { length: ucData.quantAulas },
      (_, index) => {
        const numeroAula = index + 1;

        const aulaExistente = aulasDaUc.find(
          (aula: AulaSalva) => aula.numeroAula === numeroAula,
        );

        return {
          id: aulaExistente?.id,
          numeroAula,
          data: aulaExistente?.data ? aulaExistente.data.slice(0, 10) : '',
          conteudo: aulaExistente?.tema ?? '',
          descricao: aulaExistente?.conteudoDesenvolvido ?? '',
          observacoes: aulaExistente?.observacoes ?? '',
          editando: !aulaExistente,
          aberta: false,
        };
      },
    );

    setAulas(aulasMontadas);
  }

  useEffect(() => {
    carregarDados();
  }, []);

  const totalAulas = aulas.length;
  const aulasSalvas = aulas.filter((aula) => aula.id).length;
  const progresso =
    totalAulas > 0 ? Math.round((aulasSalvas / totalAulas) * 100) : 0;

  function atualizarCampo(
    numeroAula: number,
    campo: 'data' | 'conteudo' | 'descricao' | 'observacoes',
    valor: string,
  ) {
    setAulas((aulasAtuais) =>
      aulasAtuais.map((aula) =>
        aula.numeroAula === numeroAula
          ? {
            ...aula,
            [campo]: valor,
          }
          : aula,
      ),
    );
  }

  function alternarAula(numeroAula: number) {
    setAulas((aulasAtuais) =>
      aulasAtuais.map((aula) =>
        aula.numeroAula === numeroAula
          ? {
            ...aula,
            aberta: !aula.aberta,
          }
          : aula,
      ),
    );
  }

  function habilitarEdicao(numeroAula: number) {
    setAulas((aulasAtuais) =>
      aulasAtuais.map((aula) =>
        aula.numeroAula === numeroAula
          ? {
            ...aula,
            editando: true,
            aberta: true,
          }
          : aula,
      ),
    );
  }

  async function salvarAula(aula: AulaFormulario) {
    if (!aula.data || !aula.conteudo || !aula.descricao) {
      alert('Preencha data, conteúdo e descrição antes de salvar.');
      return;
    }

    const usuarioSalvo = localStorage.getItem('pctd_user');
    const usuario = usuarioSalvo ? JSON.parse(usuarioSalvo) : null;

    if (!usuario?.id) {
      alert('Usuário não encontrado. Faça login novamente.');
      return;
    }

    setSalvando(aula.numeroAula);

    const payload = {
      data: aula.data,
      numeroAula: aula.numeroAula,
      tema: aula.conteudo,
      conteudoDesenvolvido: aula.descricao,
      observacoes: aula.observacoes || undefined,
      ucId,
      docenteId: usuario.id,
    };

    if (aula.id) {
      await apiFetch(`/aulas/${aula.id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });

      alert('Aula atualizada com sucesso.');
    } else {
      await apiFetch('/aulas', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      alert('Aula cadastrada com sucesso.');
    }

    setSalvando(null);
    carregarDados();
  }

  return (

    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />
      
      <main className="flex-1 px-10 py-8">
        <div className="mb-8">
          {turmaId && (
  <Link
    href={`/turmas/${turmaId}`}
    className="mb-6 inline-flex text-sm font-medium text-blue-700 hover:text-blue-900"
  >
    ← Voltar para turma
  </Link>
)}
          <p className="mb-2 text-sm font-medium text-blue-700">
            Planejamento da UC
          </p>

          <h1 className="text-3xl font-bold text-slate-900">
            {uc?.nome ?? 'Carregando...'}
          </h1>

          <p className="text-sm text-slate-500">
            {uc
              ? `${uc.turma?.nome ?? 'Turma não informada'} · ${uc.cargaHoraria
              }h · ${uc.quantAulas} aulas`
              : 'Carregando informações da UC...'}
          </p>
        </div>

        <Card className="mb-6 border-0 shadow-sm">
          <CardContent className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-700">
                  Progresso do planejamento
                </p>

                <p className="text-sm text-slate-500">
                  {aulasSalvas} de {totalAulas} aulas planejadas ({progresso}%)
                </p>
              </div>

              <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
                {progresso}% concluído
              </span>
            </div>

            <div className="h-3 w-full rounded-full bg-slate-200">
              <div
                className="h-3 rounded-full bg-blue-600 transition-all"
                style={{ width: `${progresso}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-2">
          {aulas.map((aula) => {
            const bloqueada = !!aula.id && !aula.editando;

            const statusTexto = aula.id
              ? aula.editando
                ? '✎ Em edição'
                : '✓ Planejada'
              : '○ Não planejada';

            const statusClasse = aula.id
              ? aula.editando
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-green-100 text-green-700'
              : 'bg-slate-100 text-slate-600';

            const bordaClasse = aula.id
              ? aula.editando
                ? 'border-l-yellow-400'
                : 'border-l-green-500'
              : 'border-l-slate-300';

            return (
              <Card
                key={aula.numeroAula}
                className={`border-0 border-l-4 ${bordaClasse} bg-white shadow-sm transition hover:shadow-md`}
              >
                <CardContent className="p-0">
                  <button
                    type="button"
                    onClick={() => alternarAula(aula.numeroAula)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <div className="flex items-center gap-3">
                      {aula.aberta ? (
                        <ChevronDown size={18} className="text-slate-500" />
                      ) : (
                        <ChevronRight size={18} className="text-slate-500" />
                      )}

                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          Aula {String(aula.numeroAula).padStart(2, '0')}
                        </p>

                        <p className="text-sm text-slate-500">
                          {aula.conteudo || 'Clique para iniciar o planejamento'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {aula.data && (
                        <span className="text-sm text-slate-500">
                          {new Date(aula.data).toLocaleDateString('pt-BR')}
                        </span>
                      )}

                      <span
                        className={`rounded-full px-3 py-1 text-sm ${statusClasse}`}
                      >
                        {statusTexto}
                      </span>

                      {bloqueada && (
                        <span
                          onClick={(event) => {
                            event.stopPropagation();
                            habilitarEdicao(aula.numeroAula);
                          }}
                          className="flex items-center gap-1 rounded-md border border-slate-200 px-3 py-1 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          <Pencil size={14} />
                          Editar
                        </span>
                      )}
                    </div>
                  </button>

                  {aula.aberta && (
                    <div className="border-t border-slate-100 px-5 py-5">
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-[180px_1fr]">
                        <div>
                          <label className="mb-1 block text-sm font-medium text-slate-700">
                            Data da aula
                          </label>

                          <Input
                            type="date"
                            value={aula.data}
                            disabled={bloqueada}
                            onChange={(e) =>
                              atualizarCampo(
                                aula.numeroAula,
                                'data',
                                e.target.value,
                              )
                            }
                          />
                        </div>

                        <div>
                          <label className="mb-1 block text-sm font-medium text-slate-700">
                            Conteúdo
                          </label>

                          <Input
                            value={aula.conteudo}
                            disabled={bloqueada}
                            onChange={(e) =>
                              atualizarCampo(
                                aula.numeroAula,
                                'conteudo',
                                e.target.value,
                              )
                            }
                            placeholder="Ex: Introdução ao NestJS"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="mb-1 block text-sm font-medium text-slate-700">
                            Descrição da aula
                          </label>

                          <Textarea
                            value={aula.descricao}
                            disabled={bloqueada}
                            onChange={(e) =>
                              atualizarCampo(
                                aula.numeroAula,
                                'descricao',
                                e.target.value,
                              )
                            }
                            placeholder="Descreva o que será desenvolvido na aula"
                            className="min-h-20"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="mb-1 block text-sm font-medium text-slate-700">
                            Observações do docente
                          </label>

                          <Textarea
                            value={aula.observacoes}
                            disabled={bloqueada}
                            onChange={(e) =>
                              atualizarCampo(
                                aula.numeroAula,
                                'observacoes',
                                e.target.value,
                              )
                            }
                            placeholder="Opcional: registre observações internas sobre essa aula"
                            className="min-h-16"
                          />
                        </div>

                        {!bloqueada && (
                          <div className="md:col-span-2 flex justify-end">
                            <Button
                              type="button"
                              onClick={() => salvarAula(aula)}
                              disabled={salvando === aula.numeroAula}
                            >
                              {salvando === aula.numeroAula
                                ? 'Salvando...'
                                : aula.id
                                  ? 'Atualizar aula'
                                  : 'Salvar aula'}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}