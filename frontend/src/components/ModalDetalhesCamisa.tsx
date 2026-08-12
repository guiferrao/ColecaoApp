import React, { useState, useEffect } from 'react';
import {
  X,
  Shirt,
  Trash2,
  Pencil,
  Star,
  User,
  Hash,
  Upload,
  AlertTriangle,
  Check,
} from 'lucide-react';
import { api } from '../services/api';
import type { Camisa } from '../types/camisa';

interface ModalDetalhesCamisaProps {
  camisa: Camisa | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ModalDetalhesCamisa: React.FC<ModalDetalhesCamisaProps> = ({
  camisa,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // Estados do formulário de edição
  const [isSelecao, setIsSelecao] = useState(false);
  const [categoria, setCategoria] = useState('');
  const [nomeTime, setNomeTime] = useState('');
  const [marca, setMarca] = useState('');
  const [temporada, setTemporada] = useState('');
  const [tamanho, setTamanho] = useState(2);
  const [tipo, setTipo] = useState(1);
  const [versao, setVersao] = useState(1);
  const [isAutografada, setIsAutografada] = useState(false);
  const [hasPersonalizacao, setHasPersonalizacao] = useState(false);
  const [numero, setNumero] = useState<number | ''>('');
  const [nomeJogador, setNomeJogador] = useState('');
  const [fotoUrl, setFotoUrl] = useState('');
  const [nomeArquivo, setNomeArquivo] = useState('');

  // Sincroniza os estados quando uma camisa é selecionada
  useEffect(() => {
    if (camisa) {
      setIsSelecao(Boolean(camisa.isSelecao));
      setCategoria(camisa.categoria || '');
      setNomeTime(camisa.nomeTime);
      setMarca(camisa.marca);
      setTemporada(camisa.temporada);
      setTamanho(camisa.tamanho);
      setTipo(camisa.tipo);
      setVersao(camisa.versao);
      setIsAutografada(camisa.isAutografada);

      const possuiPersonalizacao = Boolean(camisa.nomeJogador || camisa.numero);
      setHasPersonalizacao(possuiPersonalizacao);
      setNumero(camisa.numero ?? '');
      setNomeJogador(camisa.nomeJogador || '');
      setFotoUrl(camisa.fotoUrl || '');
      setIsEditing(false);
      setConfirmDelete(false);
      setErro(null);
    }
  }, [camisa]);

  if (!isOpen || !camisa) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNomeArquivo(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setLoading(true);

    try {
      await api.put(`/Camisa/${camisa.id}`, {
        id: camisa.id,
        nomeTime,
        marca,
        temporada,
        tamanho: Number(tamanho),
        tipo: Number(tipo),
        versao: Number(versao),
        numero: hasPersonalizacao && numero !== '' ? Number(numero) : null,
        nomeJogador: hasPersonalizacao && nomeJogador ? nomeJogador : null,
        isAutografada,
        fotoUrl: fotoUrl || null,
        categoria,
        isSelecao,
      });

      setIsEditing(false);
      onSuccess();
    } catch (err: unknown) {
      console.error('Erro ao atualizar camisa:', err);
      setErro('Falha ao atualizar a camisa. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setErro(null);
    setLoading(true);

    try {
      await api.delete(`/Camisa/${camisa.id}`);
      onSuccess();
      onClose();
    } catch (err: unknown) {
      console.error('Erro ao excluir camisa:', err);
      setErro('Falha ao excluir a camisa.');
    } finally {
      setLoading(false);
    }
  };

  const getTamanhoTexto = (val: number) => {
    const mapa: Record<number, string> = { 1: 'P', 2: 'M', 3: 'G', 4: 'GG' };
    return mapa[val] || 'M';
  };

  const getTipoTexto = (val: number) => {
    const mapa: Record<number, string> = { 1: 'Titular', 2: 'Reserva', 3: 'Alternativa' };
    return mapa[val] || 'Titular';
  };

  const getVersaoTexto = (val: number) => {
    const mapa: Record<number, string> = { 1: 'Torcedor', 2: 'Jogador' };
    return mapa[val] || 'Torcedor';
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Barra de Título */}
        <div className="px-6 py-4 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-neutral-200 font-semibold">
            <Shirt size={18} className="text-blue-500" />
            <span>{isEditing ? 'Editar Camisa' : `${camisa.nomeTime} (${camisa.temporada})`}</span>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800 transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Mensagem de Erro */}
        {erro && (
          <div className="m-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs">
            {erro}
          </div>
        )}

        {/* MODO VISUALIZAÇÃO */}
        {!isEditing ? (
          <div className="p-6 overflow-y-auto space-y-6 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Foto da Camisa */}
              <div className="w-full h-64 bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden flex items-center justify-center relative">
                {camisa.fotoUrl ? (
                  <img
                    src={camisa.fotoUrl}
                    alt={camisa.nomeTime}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Shirt size={72} className="text-neutral-700" />
                )}

                {/* Badge Autógrafo */}
                {camisa.isAutografada && (
                  <div className="absolute top-3 right-3 bg-amber-500/20 border border-amber-500/40 text-amber-400 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 backdrop-blur-md">
                    <Star size={14} className="fill-amber-400" />
                    <span>Autografada</span>
                  </div>
                )}
              </div>

              {/* Informações Principais */}
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                    {camisa.isSelecao ? 'Seleção Nacional' : 'Clube'} • {camisa.categoria || 'Geral'}
                  </span>
                  <h2 className="text-2xl font-bold text-white mt-1">{camisa.nomeTime}</h2>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800/80">
                    <span className="text-xs text-neutral-500 block">Marca</span>
                    <span className="font-semibold text-neutral-200">{camisa.marca}</span>
                  </div>
                  <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800/80">
                    <span className="text-xs text-neutral-500 block">Temporada</span>
                    <span className="font-semibold text-neutral-200">{camisa.temporada}</span>
                  </div>
                  <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800/80">
                    <span className="text-xs text-neutral-500 block">Modelo / Tipo</span>
                    <span className="font-semibold text-neutral-200">{getTipoTexto(camisa.tipo)}</span>
                  </div>
                  <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800/80">
                    <span className="text-xs text-neutral-500 block">Tamanho / Versão</span>
                    <span className="font-semibold text-neutral-200">
                      Tam. {getTamanhoTexto(camisa.tamanho)} ({getVersaoTexto(camisa.versao)})
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bloco de Personalização (se houver) */}
            {(camisa.nomeJogador || camisa.numero) && (
              <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-2xl">
                <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block mb-2">
                  Personalização
                </span>
                <div className="flex items-center gap-6">
                  {camisa.numero && (
                    <div className="flex items-center gap-2 text-neutral-200">
                      <Hash size={18} className="text-blue-500" />
                      <span className="text-lg font-bold">{camisa.numero}</span>
                    </div>
                  )}
                  {camisa.nomeJogador && (
                    <div className="flex items-center gap-2 text-neutral-200">
                      <User size={18} className="text-blue-500" />
                      <span className="text-base font-semibold uppercase">{camisa.nomeJogador}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Confirmação de Exclusão */}
            {confirmDelete && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 animate-fade-in">
                <div className="flex items-center gap-3 text-red-400 text-sm">
                  <AlertTriangle size={20} className="shrink-0" />
                  <span>Tem certeza que deseja excluir esta camisa da coleção?</span>
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="flex-1 md:flex-initial px-3 py-1.5 rounded-xl text-neutral-400 hover:text-white bg-neutral-800 text-xs font-medium cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={loading}
                    className="flex-1 md:flex-initial px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-medium transition cursor-pointer disabled:opacity-50"
                  >
                    {loading ? 'Excluindo...' : 'Sim, Excluir'}
                  </button>
                </div>
              </div>
            )}

            {/* Ações Inferiores */}
            {!confirmDelete && (
              <div className="pt-4 flex justify-between items-center border-t border-neutral-800">
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="px-4 py-2 rounded-xl text-red-400 hover:bg-red-500/10 border border-red-500/20 transition cursor-pointer flex items-center gap-2 font-medium"
                >
                  <Trash2 size={16} />
                  <span>Excluir</span>
                </button>

                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition cursor-pointer flex items-center gap-2 font-medium shadow-lg shadow-blue-600/20"
                >
                  <Pencil size={16} />
                  <span>Editar Camisa</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          /* MODO EDIÇÃO */
          <form onSubmit={handleSaveEdit} className="p-6 overflow-y-auto space-y-4 text-sm">
            <div className="flex gap-3 mb-2">
              <button
                type="button"
                onClick={() => setIsSelecao(true)}
                className={`flex-1 py-1.5 rounded-xl font-medium border text-xs transition cursor-pointer ${
                  isSelecao
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-neutral-800/60 border-neutral-700/80 text-neutral-400'
                }`}
              >
                Seleção Nacional
              </button>
              <button
                type="button"
                onClick={() => setIsSelecao(false)}
                className={`flex-1 py-1.5 rounded-xl font-medium border text-xs transition cursor-pointer ${
                  !isSelecao
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-neutral-800/60 border-neutral-700/80 text-neutral-400'
                }`}
              >
                Time / Clube
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">Categoria</label>
                <input
                  type="text"
                  required
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className="w-full bg-neutral-800/60 border border-neutral-700/80 rounded-xl p-2.5 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">Nome</label>
                <input
                  type="text"
                  required
                  value={nomeTime}
                  onChange={(e) => setNomeTime(e.target.value)}
                  className="w-full bg-neutral-800/60 border border-neutral-700/80 rounded-xl p-2.5 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">Marca</label>
                <input
                  type="text"
                  required
                  value={marca}
                  onChange={(e) => setMarca(e.target.value)}
                  className="w-full bg-neutral-800/60 border border-neutral-700/80 rounded-xl p-2.5 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">Temporada</label>
                <input
                  type="text"
                  required
                  value={temporada}
                  onChange={(e) => setTemporada(e.target.value)}
                  className="w-full bg-neutral-800/60 border border-neutral-700/80 rounded-xl p-2.5 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">Tamanho</label>
                <select
                  value={tamanho}
                  onChange={(e) => setTamanho(Number(e.target.value))}
                  className="w-full bg-neutral-800/60 border border-neutral-700/80 rounded-xl p-2.5 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value={1}>P</option>
                  <option value={2}>M</option>
                  <option value={3}>G</option>
                  <option value={4}>GG</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">Tipo</label>
                <select
                  value={tipo}
                  onChange={(e) => setTipo(Number(e.target.value))}
                  className="w-full bg-neutral-800/60 border border-neutral-700/80 rounded-xl p-2.5 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value={1}>Titular</option>
                  <option value={2}>Reserva</option>
                  <option value={3}>Alternativa</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">Versão</label>
                <select
                  value={versao}
                  onChange={(e) => setVersao(Number(e.target.value))}
                  className="w-full bg-neutral-800/60 border border-neutral-700/80 rounded-xl p-2.5 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value={1}>Torcedor</option>
                  <option value={2}>Jogador</option>
                </select>
              </div>
            </div>

            {/* Alternadores */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">Autografada?</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAutografada(true)}
                    className={`flex-1 py-1.5 rounded-lg font-medium text-xs border transition cursor-pointer ${
                      isAutografada ? 'bg-blue-600 border-blue-500 text-white' : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    Sim
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAutografada(false)}
                    className={`flex-1 py-1.5 rounded-lg font-medium text-xs border transition cursor-pointer ${
                      !isAutografada ? 'bg-blue-600 border-blue-500 text-white' : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    Não
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">Personalização?</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setHasPersonalizacao(true)}
                    className={`flex-1 py-1.5 rounded-lg font-medium text-xs border transition cursor-pointer ${
                      hasPersonalizacao ? 'bg-blue-600 border-blue-500 text-white' : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    Sim
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setHasPersonalizacao(false);
                      setNomeJogador('');
                      setNumero('');
                    }}
                    className={`flex-1 py-1.5 rounded-lg font-medium text-xs border transition cursor-pointer ${
                      !hasPersonalizacao ? 'bg-blue-600 border-blue-500 text-white' : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    Não
                  </button>
                </div>
              </div>
            </div>

            {hasPersonalizacao && (
              <div className="grid grid-cols-2 gap-4 p-3 bg-neutral-950 border border-neutral-800 rounded-xl">
                <div>
                  <label className="block text-xs font-semibold text-neutral-400 mb-1">Número</label>
                  <input
                    type="number"
                    value={numero}
                    onChange={(e) => setNumero(e.target.value !== '' ? Number(e.target.value) : '')}
                    className="w-full bg-neutral-800/60 border border-neutral-700/80 rounded-xl p-2.5 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-400 mb-1">Jogador</label>
                  <input
                    type="text"
                    value={nomeJogador}
                    onChange={(e) => setNomeJogador(e.target.value)}
                    className="w-full bg-neutral-800/60 border border-neutral-700/80 rounded-xl p-2.5 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1">Foto da Camisa</label>
              <label className="flex items-center justify-center gap-3 w-full p-3 border border-dashed border-neutral-700 bg-neutral-800/40 rounded-xl cursor-pointer hover:border-blue-500 transition">
                <Upload size={18} className="text-blue-400" />
                <span className="text-xs text-neutral-300">
                  {nomeArquivo || (fotoUrl ? 'Alterar foto atual' : 'Selecionar nova imagem')}
                </span>
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-xl text-neutral-400 hover:text-white bg-neutral-800 transition cursor-pointer font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Check size={16} />
                <span>{loading ? 'Salvando...' : 'Salvar Alterações'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};