'use client';

import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/ui/sidebar';
import { apiFetch } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type User = {
    id: string;
    nome: string;
    email: string;
};

type Docente = {
    id: string;
    nome: string;
    email: string;
    telefone?: string;
    cargo?: string;
};

export default function DocentesPage() {
    const [docentes, setDocentes] = useState<Docente[]>([]);
    const [users, setUsers] = useState<User[]>([]);

    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    const [userId, setUserId] = useState('');

    async function carregarDados() {
        const [docentesData, usersData] = await Promise.all([
            apiFetch('/docentes'),
            apiFetch('/users'),
        ]);

        setDocentes(docentesData);
        setUsers(usersData);

        if (!userId && usersData.length > 0) {
            setUserId(usersData[0].id);
        }
    }

    useEffect(() => {
        carregarDados();
    }, []);

    async function cadastrarDocente(event: React.FormEvent) {
        event.preventDefault();

        await apiFetch('/docentes', {
            method: 'POST',
            body: JSON.stringify({
                nome,
                email,
                telefone: telefone || undefined,
                userId,
            }),
        });

        setNome('');
        setEmail('');
        setTelefone('');

        carregarDados();
    }

    return (
        <div className="flex min-h-screen bg-slate-100">
            <Sidebar />

            <main className="flex-1 px-10 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">Docentes</h1>
                    <p className="text-sm text-slate-500">
                        Cadastre e acompanhe os docentes vinculados ao sistema.
                    </p>
                </div>

                <Card className="mb-8 border-0 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg">Cadastrar novo docente</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={cadastrarDocente} className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">Nome</label>
                                <Input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome do docente" />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">E-mail</label>
                                <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@exemplo.com" />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">Telefone</label>
                                <Input value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="(11) 99999-9999" />
                            </div>

                            <div className="md:col-span-2">
                                <label className="mb-1 block text-sm font-medium text-slate-700">Usuário vinculado</label>
                                <select className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm" value={userId} onChange={(e) => setUserId(e.target.value)}>
                                    {users.map((user) => (
                                        <option key={user.id} value={user.id}>
                                            {user.nome} - {user.email}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-end md:col-span-2">
                                <Button type="submit" className="h-10 w-full md:w-64">
                                    Cadastrar docente
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <div className="space-y-4">
                    {docentes.map((docente) => (
                        <Card key={docente.id} className="border-0 shadow-sm">
                            <CardContent className="flex items-center justify-between p-6">
                                <div>
                                    <h2 className="text-lg font-semibold text-slate-900">{docente.nome}</h2>
                                    <p className="text-sm text-slate-500">{docente.email}</p>
                                    <p className="text-sm text-slate-500">{docente.telefone ?? 'Sem telefone'}</p>
                                </div>

                                <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
                                    {docente.cargo ?? 'Docente'}
                                </span>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </main>
        </div>
    );
}