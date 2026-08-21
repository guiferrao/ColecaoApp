import React, { useState } from 'react';
import { Lock, Mail, User, LogIn, UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';
import type { AuthResponse } from '../types/camisa';

interface LoginProps {
  onLoginSuccess: (token: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [modoCadastro, setModoCadastro] = useState(false);

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const alternarModo = () => {
    setModoCadastro(!modoCadastro);
    setErro(null);
    setSucesso(null);
    setSenha('');
    setConfirmarSenha('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setSucesso(null);

    if (modoCadastro && senha !== confirmarSenha) {
      setErro('As senhas não coincidem.');
      return;
    }

    setLoading(true);

    try {
      if (modoCadastro) {
        await api.post('/Auth/registrar', {
          nome,
          email,
          senha,
        });

        setSucesso('Conta criada com sucesso! Faça login para acessar o sistema.');
        setModoCadastro(false);
        setSenha('');
        setConfirmarSenha('');
      } else {
        const response = await api.post<AuthResponse>('/Auth/login', {
          email,
          senha,
        });

        const { token } = response.data;
        localStorage.setItem('token', token);
        onLoginSuccess(token);
      }
    } catch (err: unknown) {
      console.error('Erro na autenticação/cadastro:', err);
      if (
        typeof err === 'object' &&
        err !== null &&
        'response' in err &&
        (err as { response?: { status?: number; data?: { message?: string } } }).response
      ) {
        const response = (err as { response: { status?: number; data?: { message?: string } } }).response;
        if (response.data?.message) {
          setErro(response.data.message);
        } else if (response.status === 400) {
          setErro(modoCadastro ? 'E-mail já cadastrado ou dados inválidos.' : 'E-mail ou senha incorretos.');
        } else {
          setErro('Erro na requisição. Tente novamente.');
        }
      } else {
        setErro('Falha ao conectar com a API Backend.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-4 font-sans selection:bg-blue-500 selection:text-white">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden p-8">
        <div className="flex bg-neutral-950 p-1 rounded-xl border border-neutral-800 mb-8">
          <button
            type="button"
            onClick={() => modoCadastro && alternarModo()}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition cursor-pointer ${
              !modoCadastro ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={() => !modoCadastro && alternarModo()}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition cursor-pointer ${
              modoCadastro ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Criar Conta
          </button>
        </div>

        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-neutral-800 border border-neutral-700 rounded-2xl flex items-center justify-center mx-auto mb-3 text-blue-400 shadow-inner">
            {modoCadastro ? <UserPlus size={28} /> : <Lock size={28} />}
          </div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-100">
            {modoCadastro ? 'Nova Conta' : 'Coleção de Camisas'}
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            {modoCadastro
              ? 'Preencha seus dados para criar sua coleção'
              : 'Insira suas credenciais para acessar o sistema'}
          </p>
        </div>

        {erro && (
          <div className="mb-5 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-xs">
            <AlertCircle size={16} className="shrink-0" />
            <span>{erro}</span>
          </div>
        )}

        {sucesso && (
          <div className="mb-5 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3 text-emerald-400 text-xs">
            <CheckCircle2 size={16} className="shrink-0" />
            <span>{sucesso}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {modoCadastro && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                Nome Completo
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Seu Nome"
                  className="w-full bg-neutral-800/60 border border-neutral-700/80 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
              E-mail
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
                <Mail size={18} />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full bg-neutral-800/60 border border-neutral-700/80 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
              Senha
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
                <Lock size={18} />
              </div>
              <input
                type="password"
                required
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-neutral-800/60 border border-neutral-700/80 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              />
            </div>
          </div>

          {modoCadastro && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                Confirmar Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  required
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-neutral-800/60 border border-neutral-700/80 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 px-4 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20"
          >
            {loading ? (
              <span className="animate-pulse">Aguarde...</span>
            ) : modoCadastro ? (
              <>
                <UserPlus size={18} />
                <span>Cadastrar Conta</span>
              </>
            ) : (
              <>
                <LogIn size={18} />
                <span>Entrar no Sistema</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};