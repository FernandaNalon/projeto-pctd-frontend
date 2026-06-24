'use client';

import { useEffect, useState } from 'react';

import { Sidebar } from '@/components/ui/sidebar';

import { apiFetch } from '@/services/api';

import { Button } from '@/components/ui/button';

import { Input } from '@/components/ui/input';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type Usuario = {
  id: string;
  nome: string;
  email: string;
  role: string;
  ativo: boolean;
};

export default function AcessosPage() {
  const [usuarios, setUsuarios] =
    useState<Usuario[]>([]);

  const [nome, setNome] = useState('');

  const [email, setEmail] =
    useState('');

  const [senha, setSenha] =
    useState('');

  const [role, setRole] =
    useState('DOCENTE');

  async function carregarUsuarios() {
    const data =
      await apiFetch('/users');

    setUsuarios(data);
  }

  useEffect(() => {
    carregarUsuarios();
  }, []);

  async function cadastrarUsuario(
    event: React.FormEvent,
  ) {
    event.preventDefault();

    await apiFetch('/users', {
      method: 'POST',

      body: JSON.stringify({
        nome,

        email,

        senhaHash: senha,

        role,

        ativo: true,
      }),
    });

    setNome('');

    setEmail('');

    setSenha('');

    setRole('DOCENTE');

    carregarUsuarios();
  }

  return (
    <div className="flex min-h-screen bg-slate-100">

      <Sidebar />

      <main className="flex-1 px-10 py-8">

        <div className="mb-8">

          <h1 className="text-3xl font-bold">

            Acessos

          </h1>

          <p className="text-sm text-slate-500">

            Gerencie quem pode utilizar o sistema.

          </p>

        </div>

        <Card className="mb-8 border-0 shadow-sm">

          <CardHeader>

            <CardTitle>

              Novo acesso

            </CardTitle>

          </CardHeader>

          <CardContent>

            <form
              onSubmit={cadastrarUsuario}

              className="
                grid
                grid-cols-1
                md:grid-cols-2
                gap-5
              "
            >

              <Input
                placeholder="Nome"

                value={nome}

                onChange={(e) =>
                  setNome(e.target.value)
                }
              />

              <Input
                placeholder="E-mail"

                value={email}

                onChange={(e) =>
                  setEmail(e.target.value)
                }
              />

              <Input
                type="password"

                placeholder="Senha"

                value={senha}

                onChange={(e) =>
                  setSenha(e.target.value)
                }
              />

              <select
                className="
                  h-10
                  rounded-md
                  border
                  border-slate-300
                  px-3
                "

                value={role}

                onChange={(e) =>
                  setRole(e.target.value)
                }
              >

                <option value="DOCENTE">
                  Docente
                </option>

                <option value="COORDENACAO">
                  Coordenação
                </option>

                <option value="ADMIN">
                  Administrador
                </option>

              </select>

              <Button
                type="submit"

                className="
                  md:col-span-2
                  md:w-64
                "
              >

                Cadastrar usuário

              </Button>

            </form>

          </CardContent>

        </Card>

        <div className="space-y-4">

          {usuarios.map((usuario) => (
            <Card
              key={usuario.id}

              className="
                border-0
                shadow-sm
              "
            >

              <CardContent
                className="
                  flex
                  items-center
                  justify-between
                  p-6
                "
              >

                <div>

                  <h2
                    className="
                      text-lg
                      font-semibold
                    "
                  >

                    {usuario.nome}

                  </h2>

                  <p
                    className="
                      text-sm
                      text-slate-500
                    "
                  >

                    {usuario.email}

                  </p>

                </div>

                <span
                  className="
                    rounded-full
                    bg-blue-100
                    px-3
                    py-1
                    text-sm
                    text-blue-700
                  "
                >

                  {usuario.role}

                </span>

              </CardContent>

            </Card>
          ))}
        </div>

      </main>

    </div>
  );
}