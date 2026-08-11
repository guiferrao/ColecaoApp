import React, { useState } from 'react';
import { X, Plus, Shirt, Upload } from 'lucide-react';
import { api } from '../services/api';

interface ModalNovaCamisaProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialIsSelecao?: boolean;
}

export const ModalNovaCamisa: React.FC<ModalNovaCamisaProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialIsSelecao = false,
}) => {
  const [isSelecao, setIsSelecao] = useState(initialIsSelecao);
  const [categoria, setCategoria] = useState('');
  const [nomeTime, setNomeTime] = useState('');
  const [marca, setMarca] = useState('');
  const [temporada, setTemporada] = useState('');
  const [tamanho, setTamanho] = useState(2); // 1=P, 2=M, 3=G, 4=GG
  const [tipo, setTipo] = useState(1); // 1=Titular, 2=Reserva, 3=Alternativa
  const [versao, setVersao] = useState(1); // 1=Torcedor, 2=Jogador
  const [isAutografada, setIsAutografada] = useState(false);

  // Controle de Personalização (Sim / Não)
  const [hasPersonalizacao, setHasPersonalizacao] = useState(false);
  const [numero, setNumero] = useState<number | ''>('');
  const [nomeJogador, setNomeJogador] = useState('');

  // Controle de Upload de Arquivo
  const [fotoUrl, setFotoUrl] = useState<string>('');
  const [nomeArquivo, setNomeArquivo] = useState<string>('');

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  if (!isOpen) return null;

  // Processa o arquivo selecionado e converte em Base64/DataURL
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setLoading(true);

    try {
      await api.post('/Camisa', {
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

      onSuccess();
      onClose();
    } catch (err: unknown) {
      console.error('Erro ao cadastrar camisa:', err);
      setErro('Falha ao cadastrar a camisa. Verifique os campos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Barra de Título */}
        <div className="px-6 py-4 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-neutral-200 font-semibold">
            <Shirt size={18} className="text-blue-500" />
            <span>Cadastrar Nova Camisa</span>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800 transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-sm">
          {erro && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs">
              {erro}
            </div>
          )}

          {/* 1. É Seleção? (Sim / Não) */}
          <div>
            <label className="block text-xs font-semibold text-neutral-400 mb-2">É Seleção Nacional?</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsSelecao(true)}
                className={`flex-1 py-2 rounded-xl font-medium border transition cursor-pointer ${
                  isSelecao
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-neutral-800/60 border-neutral-700/80 text-neutral-400 hover:text-white'
                }`}
              >
                Sim
              </button>
              <button
                type="button"
                onClick={() => setIsSelecao(false)}
                className={`flex-1 py-2 rounded-xl font-medium border transition cursor-pointer ${
                  !isSelecao
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-neutral-800/60 border-neutral-700/80 text-neutral-400 hover:text-white'
                }`}
              >
                Não (Time / Clube)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1">
                {isSelecao ? 'Continente' : 'Liga / Categoria'}
              </label>
              <input
                type="text"
                required
                placeholder={isSelecao ? 'Ex: América' : 'Ex: Brasileirão'}
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="w-full bg-neutral-800/60 border border-neutral-700/80 rounded-xl p-2.5 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1">
                {isSelecao ? 'Seleção' : 'Time'}
              </label>
              <input
                type="text"
                required
                placeholder={isSelecao ? 'Ex: Brasil' : 'Ex: Vasco'}
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
                placeholder="Ex: Nike, Kappa"
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
                placeholder="Ex: 2024"
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

          {/* 2. É Autografada? (Sim / Não) */}
          <div>
            <label className="block text-xs font-semibold text-neutral-400 mb-2">É Autografada?</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsAutografada(true)}
                className={`flex-1 py-2 rounded-xl font-medium border transition cursor-pointer ${
                  isAutografada
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-neutral-800/60 border-neutral-700/80 text-neutral-400 hover:text-white'
                }`}
              >
                Sim
              </button>
              <button
                type="button"
                onClick={() => setIsAutografada(false)}
                className={`flex-1 py-2 rounded-xl font-medium border transition cursor-pointer ${
                  !isAutografada
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-neutral-800/60 border-neutral-700/80 text-neutral-400 hover:text-white'
                }`}
              >
                Não
              </button>
            </div>
          </div>

          {/* 3. Possui Personalização? (Sim / Não) */}
          <div>
            <label className="block text-xs font-semibold text-neutral-400 mb-2">Possui Personalização?</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setHasPersonalizacao(true)}
                className={`flex-1 py-2 rounded-xl font-medium border transition cursor-pointer ${
                  hasPersonalizacao
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-neutral-800/60 border-neutral-700/80 text-neutral-400 hover:text-white'
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
                className={`flex-1 py-2 rounded-xl font-medium border transition cursor-pointer ${
                  !hasPersonalizacao
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-neutral-800/60 border-neutral-700/80 text-neutral-400 hover:text-white'
                }`}
              >
                Não
              </button>
            </div>
          </div>

          {/* Campos condicionais de Personalização */}
          {hasPersonalizacao && (
            <div className="grid grid-cols-2 gap-4 p-3 bg-neutral-950 border border-neutral-800 rounded-xl animate-fade-in">
              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">Número</label>
                <input
                  type="number"
                  placeholder="Ex: 10"
                  value={numero}
                  onChange={(e) => setNumero(e.target.value !== '' ? Number(e.target.value) : '')}
                  className="w-full bg-neutral-800/60 border border-neutral-700/80 rounded-xl p-2.5 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">Nome do Jogador</label>
                <input
                  type="text"
                  placeholder="Ex: Romário"
                  value={nomeJogador}
                  onChange={(e) => setNomeJogador(e.target.value)}
                  className="w-full bg-neutral-800/60 border border-neutral-700/80 rounded-xl p-2.5 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {/* 4. Upload de Foto da Camisa */}
          <div>
            <label className="block text-xs font-semibold text-neutral-400 mb-2">Foto da Camisa</label>
            <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-neutral-700 hover:border-blue-500 bg-neutral-800/40 rounded-xl cursor-pointer transition p-4">
              {fotoUrl ? (
                <div className="flex items-center gap-3">
                  <img src={fotoUrl} alt="Preview" className="w-16 h-16 object-cover rounded-lg" />
                  <span className="text-xs text-neutral-300 font-medium truncate max-w-[200px]">{nomeArquivo}</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-neutral-400">
                  <Upload size={24} className="text-blue-400" />
                  <span className="text-xs">Clique para selecionar uma imagem</span>
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-neutral-400 hover:text-white bg-neutral-800 hover:bg-neutral-700 transition cursor-pointer font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Plus size={16} />
              <span>{loading ? 'Salvando...' : 'Cadastrar'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};