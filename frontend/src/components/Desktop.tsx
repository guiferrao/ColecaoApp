import React, { useState, useEffect } from 'react';
import { Folder, ArrowLeft, Shirt } from 'lucide-react';
import { api } from '../services/api';
import type { Camisa } from '../types/camisa'; // Adicionado 'type' aqui

export const Desktop: React.FC = () => {
  const [camisas, setCamisas] = useState<Camisa[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Controle de navegação do OS: [] -> ['Times'] -> ['Times', 'Vasco']
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

  // Navegar para dentro de uma pasta
  const openFolder = (folderName: string) => {
    setCurrentPath([...currentPath, folderName]);
  };

  // Voltar um nível no sistema de pastas
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

  // Renderiza a pasta de primeiro nível ('Times' ou 'Seleções')
  if (currentPath.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-900 text-white p-8 font-sans">
        <h1 className="text-xl font-bold mb-6 text-neutral-400">Área de Trabalho</h1>
        <div className="grid grid-cols-4 gap-6">
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

  // Renderiza a lista de clubes/seleções agrupados dinamicamente
  if (currentPath.length === 1) {
    const timesUnicos = Array.from(new Set(camisas.map((c) => c.nomeTime)));

    return (
      <div className="min-h-screen bg-neutral-900 text-white p-8 font-sans">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={goBack} className="p-2 hover:bg-neutral-800 rounded-full cursor-pointer">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-neutral-300">/ {currentPath[0]}</h1>
        </div>

        <div className="grid grid-cols-4 gap-6">
          {timesUnicos.map((time) => (
            <button
              key={time}
              onClick={() => openFolder(time)}
              className="flex flex-col items-center p-4 rounded-lg hover:bg-neutral-800 transition cursor-pointer group"
            >
              <div className="w-16 h-16 bg-neutral-800 border border-neutral-700 rounded-lg flex items-center justify-center group-hover:scale-105 transition">
                <Folder size={40} className="text-neutral-400" />
              </div>
              <span className="mt-2 text-sm font-medium">{time}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Renderiza as camisas específicas do time selecionado (Nível 3)
  const timeAtual = currentPath[1];
  const camisasDoTime = camisas.filter((c) => c.nomeTime.toLowerCase() === timeAtual.toLowerCase());

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-8 font-sans">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={goBack} className="p-2 hover:bg-neutral-800 rounded-full cursor-pointer">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-neutral-300">
          / {currentPath[0]} / {timeAtual}
        </h1>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {camisasDoTime.map((camisa) => (
          <div
            key={camisa.id}
            className="flex flex-col items-center p-4 bg-neutral-800/50 border border-neutral-700/50 rounded-xl hover:border-neutral-500 transition group cursor-pointer"
          >
            <div className="w-full h-32 bg-neutral-800 rounded-lg overflow-hidden flex items-center justify-center mb-3">
              {camisa.fotoUrl ? (
                <img src={camisa.fotoUrl} alt={camisa.nomeTime} className="w-full h-full object-cover group-hover:scale-105 transition" />
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