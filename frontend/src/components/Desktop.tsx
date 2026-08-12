import React, { useState, useEffect } from 'react';
import { Folder, ArrowLeft, Shirt, LogOut, Plus } from 'lucide-react';
import { api } from '../services/api';
import type { Camisa } from '../types/camisa';
import { ModalNovaCamisa } from './ModalNovaCamisa';
import { ModalDetalhesCamisa } from './ModalDetalhesCamisa';

interface DesktopProps {
  onLogout: () => void;
}

export const Desktop: React.FC<DesktopProps> = ({ onLogout }) => {
  const [camisas, setCamisas] = useState<Camisa[]>([]);
  const [loading, setLoading] = useState(true);

  // Controle de Modais
  const [isModalNovaOpen, setIsModalNovaOpen] = useState(false);
  const [modalIsSelecao, setModalIsSelecao] = useState(false);
  const [selectedCamisa, setSelectedCamisa] = useState<Camisa | null>(null);
  const [isModalDetalhesOpen, setIsModalDetalhesOpen] = useState(false);

  const [currentPath, setCurrentPath] = useState<string[]>([]);

  useEffect(() => {
    carregarCamisas();
  }, []);

  const carregarCamisas = async () => {
    try {
      const response = await api.get<Camisa[]>('/Camisa');
      setCamisas(response.data);
    } catch (error) {
      console.error('Erro ao buscar camisas:', error);
    } finally {
      setLoading(false);
    }
  };

  const abrirModalCadastro = (isSelecao: boolean) => {
    setModalIsSelecao(isSelecao);
    setIsModalNovaOpen(true);
  };

  const abrirModalDetalhes = (camisa: Camisa) => {
    setSelectedCamisa(camisa);
    setIsModalDetalhesOpen(true);
  };

  const obterNomeUsuario = (): string => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return 'Colecionador';

      const payloadBase64 = token.split('.')[1];
      const payloadDecodificado = JSON.parse(atob(payloadBase64));

      return (
        payloadDecodificado['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ||
        payloadDecodificado.unique_name ||
        payloadDecodificado.name ||
        payloadDecodificado.sub ||
        'Colecionador'
      );
    } catch {
      return 'Colecionador';
    }
  };

  const openFolder = (folderName: string) => {
    setCurrentPath([...currentPath, folderName]);
  };

  const goBack = () => {
    setCurrentPath(currentPath.slice(0, -1));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-900 text-white flex items-center justify-center font-sans">
        <div className="text-neutral-400 font-medium animate-pulse">Carregando sistema de arquivos...</div>
      </div>
    );
  }

  const nomeUsuario = obterNomeUsuario();

  const Header = () => (
    <div className="flex justify-between items-center mb-6 border-b border-neutral-800 pb-4">
      <div className="flex items-center gap-3">
        {currentPath.length > 0 && (
          <button onClick={goBack} className="p-1.5 hover:bg-neutral-800 rounded-full cursor-pointer transition">
            <ArrowLeft size={18} />
          </button>
        )}
        <h1 className="text-xl font-bold text-neutral-200">
          {currentPath.length === 0 ? `Olá, ${nomeUsuario}!` : `/ ${currentPath.join(' / ')}`}
        </h1>
      </div>

      <button
        onClick={onLogout}
        className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-neutral-400 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-xl transition cursor-pointer"
      >
        <LogOut size={16} />
        <span>Sair</span>
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-8 font-sans">
      <Header />

      {/* NÍVEL 0: Área de Trabalho (Times / Seleções) */}
      {currentPath.length === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
          <div className="flex items-center bg-neutral-800/40 border border-neutral-800 rounded-2xl p-4 hover:border-neutral-700 transition">
            <button
              onClick={() => openFolder('Times')}
              className="flex items-center gap-4 flex-1 cursor-pointer group text-left"
            >
              <Folder size={56} className="text-yellow-500 fill-yellow-500/20 group-hover:scale-105 transition shrink-0" />
              <div>
                <span className="text-base font-semibold block text-neutral-200">Times</span>
                <span className="text-xs text-neutral-500">Clubes e Campeonatos</span>
              </div>
            </button>
            <button
              onClick={() => abrirModalCadastro(false)}
              title="Adicionar camisa de time"
              className="p-2.5 bg-neutral-800 hover:bg-blue-600 text-neutral-300 hover:text-white rounded-xl transition cursor-pointer shrink-0 ml-2 shadow-sm"
            >
              <Plus size={20} />
            </button>
          </div>

          <div className="flex items-center bg-neutral-800/40 border border-neutral-800 rounded-2xl p-4 hover:border-neutral-700 transition">
            <button
              onClick={() => openFolder('Selecoes')}
              className="flex items-center gap-4 flex-1 cursor-pointer group text-left"
            >
              <Folder size={56} className="text-blue-500 fill-blue-500/20 group-hover:scale-105 transition shrink-0" />
              <div>
                <span className="text-base font-semibold block text-neutral-200">Seleções</span>
                <span className="text-xs text-neutral-500">Seleções Nacionais</span>
              </div>
            </button>
            <button
              onClick={() => abrirModalCadastro(true)}
              title="Adicionar camisa de seleção"
              className="p-2.5 bg-neutral-800 hover:bg-blue-600 text-neutral-300 hover:text-white rounded-xl transition cursor-pointer shrink-0 ml-2 shadow-sm"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>
      )}

      {/* NÍVEL 1: Categorias (Ligas ou Continentes) */}
      {currentPath.length === 1 && (() => {
        const isTimes = currentPath[0] === 'Times';
        const camisasFiltradas = camisas.filter((c) => (isTimes ? !c.isSelecao : c.isSelecao));
        const categoriasExistentes = Array.from(
          new Set(camisasFiltradas.map((c) => c.categoria).filter(Boolean) as string[])
        );

        const categoriasPadrao = isTimes
          ? ['Brasileirão', 'Premier League', 'La Liga', 'Outros']
          : ['América', 'Europa', 'Ásia', 'Outros'];

        const categoriasExibicao = categoriasExistentes.length > 0 ? categoriasExistentes : categoriasPadrao;

        return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categoriasExibicao.map((cat) => (
              <button
                key={cat}
                onClick={() => openFolder(cat)}
                className="flex flex-col items-center p-4 rounded-lg hover:bg-neutral-800 transition cursor-pointer group"
              >
                <Folder size={64} className="text-amber-400 fill-amber-400/20 group-hover:scale-105 transition" />
                <span className="mt-2 text-sm font-medium">{cat}</span>
              </button>
            ))}
          </div>
        );
      })()}

      {/* NÍVEL 2: Times ou Seleções da Categoria */}
      {currentPath.length === 2 && (() => {
        const categoriaAtual = currentPath[1];
        const camisasDaCategoria = camisas.filter(
          (c) => c.categoria?.toLowerCase() === categoriaAtual.toLowerCase()
        );

        const timesUnicos = Array.from(new Set(camisasDaCategoria.map((c) => c.nomeTime)));

        return timesUnicos.length === 0 ? (
          <div className="text-neutral-500 mt-10 text-center">Nenhum item cadastrado nesta pasta ainda.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {timesUnicos.map((time) => (
              <button
                key={time}
                onClick={() => openFolder(time)}
                className="flex flex-col items-center p-4 rounded-lg hover:bg-neutral-800 transition cursor-pointer group"
              >
                <div className="w-16 h-16 bg-neutral-800 border border-neutral-700 rounded-lg flex items-center justify-center group-hover:scale-105 transition mb-2">
                  <Folder size={40} className="text-neutral-400" />
                </div>
                <span className="text-sm font-medium">{time}</span>
              </button>
            ))}
          </div>
        );
      })()}

      {/* NÍVEL 3: Lista de Camisas do Time */}
      {currentPath.length >= 3 && (() => {
        const timeAtual = currentPath[2];
        const camisasDoTime = camisas.filter(
          (c) => c.nomeTime.toLowerCase() === timeAtual.toLowerCase()
        );

        return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {camisasDoTime.map((camisa) => (
              <div
                key={camisa.id}
                onClick={() => abrirModalDetalhes(camisa)}
                className="flex flex-col items-center p-4 bg-neutral-800/50 border border-neutral-700/50 rounded-xl hover:border-neutral-500 transition group cursor-pointer relative"
              >
                <div className="w-full h-36 bg-neutral-800 rounded-lg overflow-hidden flex items-center justify-center mb-3">
                  {camisa.fotoUrl ? (
                    <img
                      src={camisa.fotoUrl}
                      alt={camisa.nomeTime}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                  ) : (
                    <Shirt size={48} className="text-neutral-500" />
                  )}
                </div>
                <span className="text-sm font-semibold">{camisa.temporada}</span>
                <span className="text-xs text-neutral-400">
                  {camisa.tipo === 1 ? 'Titular' : camisa.tipo === 2 ? 'Reserva' : 'Alternativa'}
                </span>
              </div>
            ))}
          </div>
        );
      })()}

      {/* Modal de Cadastro */}
      <ModalNovaCamisa
        isOpen={isModalNovaOpen}
        onClose={() => setIsModalNovaOpen(false)}
        onSuccess={carregarCamisas}
        initialIsSelecao={modalIsSelecao}
      />

      {/* Modal de Detalhes / Edição / Exclusão */}
      <ModalDetalhesCamisa
        camisa={selectedCamisa}
        isOpen={isModalDetalhesOpen}
        onClose={() => {
          setIsModalDetalhesOpen(false);
          setSelectedCamisa(null);
        }}
        onSuccess={carregarCamisas}
      />
    </div>
  );
};