import React, { useState, useEffect } from 'react';
import { Folder, ArrowLeft, Shirt, LogOut } from 'lucide-react';
import { api } from '../services/api';
import type { Camisa } from '../types/camisa';

interface DesktopProps {
  onLogout: () => void;
}

export const Desktop: React.FC<DesktopProps> = ({ onLogout }) => {
  const [camisas, setCamisas] = useState<Camisa[]>([]);
  const [loading, setLoading] = useState(true);

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

  const Header = () => (
    <div className="flex justify-between items-center mb-6 border-b border-neutral-800 pb-4">
      <div className="flex items-center gap-4">
        {currentPath.length > 0 && (
          <button onClick={goBack} className="p-2 hover:bg-neutral-800 rounded-full cursor-pointer transition">
            <ArrowLeft size={20} />
          </button>
        )}
        <h1 className="text-xl font-bold text-neutral-300">
          {currentPath.length === 0 ? 'Área de Trabalho' : `/ ${currentPath.join(' / ')}`}
        </h1>
      </div>

      <button
        onClick={onLogout}
        className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-neutral-400 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg transition cursor-pointer"
      >
        <LogOut size={16} />
        <span>Sair</span>
      </button>
    </div>
  );

  if (currentPath.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-900 text-white p-8 font-sans">
        <Header />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <button
            onClick={() => openFolder('Times')}
            className="flex flex-col items-center p-4 rounded-lg hover:bg-neutral-800 transition cursor-pointer group"
          >
            <Folder size={64} className="text-yellow-500 fill-yellow-500/20 group-hover:scale-105 transition" />
            <span className="mt-2 text-sm font-medium">Times</span>
          </button>

          <button
            onClick={() => openFolder('Selecoes')}
            className="flex flex-col items-center p-4 rounded-lg hover:bg-neutral-800 transition cursor-pointer group"
          >
            <Folder size={64} className="text-blue-500 fill-blue-500/20 group-hover:scale-105 transition" />
            <span className="mt-2 text-sm font-medium">Seleções</span>
          </button>
        </div>
      </div>
    );
  }

  if (currentPath.length === 1) {
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
      <div className="min-h-screen bg-neutral-900 text-white p-8 font-sans">
        <Header />
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
      </div>
    );
  }

  if (currentPath.length === 2) {
    const categoriaAtual = currentPath[1];
    const camisasDaCategoria = camisas.filter(
      (c) => c.categoria?.toLowerCase() === categoriaAtual.toLowerCase()
    );

    const timesUnicos = Array.from(new Set(camisasDaCategoria.map((c) => c.nomeTime)));

    return (
      <div className="min-h-screen bg-neutral-900 text-white p-8 font-sans">
        <Header />
        {timesUnicos.length === 0 ? (
          <div className="text-neutral-500 mt-10">Nenhum item cadastrado nesta pasta ainda.</div>
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
        )}
      </div>
    );
  }

  const timeAtual = currentPath[2];
  const camisasDoTime = camisas.filter(
    (c) => c.nomeTime.toLowerCase() === timeAtual.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-8 font-sans">
      <Header />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {camisasDoTime.map((camisa) => (
          <div
            key={camisa.id}
            className="flex flex-col items-center p-4 bg-neutral-800/50 border border-neutral-700/50 rounded-xl hover:border-neutral-500 transition group cursor-pointer"
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
    </div>
  );
};