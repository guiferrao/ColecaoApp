import React, { useState, useEffect } from 'react';
import { Folder, Shield, Trophy } from 'lucide-react';

interface FolderIconProps {
  name: string;
  level: number; // 1 = Categorias/Ligas, 2 = Times/Seleções
  className?: string;
}

// 1. Mapeamento de bandeiras para Seleções Nacionais
const PAIS_PARA_CODIGO: Record<string, string> = {
  brasil: 'br',
  argentina: 'ar',
  uruguai: 'uy',
  frança: 'fr',
  franca: 'fr',
  alemanha: 'de',
  espanha: 'es',
  itália: 'it',
  italia: 'it',
  inglaterra: 'gb-eng',
  portugal: 'pt',
  holanda: 'nl',
  'países baixos': 'nl',
  japão: 'jp',
  japao: 'jp',
  'estados unidos': 'us',
  eua: 'us',
  colômbia: 'co',
  colombia: 'co',
  chile: 'cl',
};

// 2. Mapeamento de siglas para Ligas e Categorias
const LIGA_SIGLAS: Record<string, string> = {
  brasileirão: 'BRA',
  brasileirao: 'BRA',
  'premier league': 'EPL',
  'la liga': 'LAL',
  'serie a': 'ITA',
  'champions league': 'UCL',
  libertadores: 'LIB',
  'sul-americana': 'SUL',
  sulamericana: 'SUL',
  américa: 'AM',
  america: 'AM',
  europa: 'EU',
  ásia: 'AS',
  asia: 'AS',
  outros: 'OUT',
};

// Helper para obter/gerar a sigla da liga
const getSigla = (nome: string): string => {
  const lower = nome.toLowerCase().trim();
  if (LIGA_SIGLAS[lower]) return LIGA_SIGLAS[lower];

  const palavras = nome.split(' ').filter(Boolean);
  if (palavras.length > 1) {
    return palavras.map((p) => p[0]).join('').substring(0, 3).toUpperCase();
  }
  return nome.substring(0, 3).toUpperCase();
};

// Cache em memória para busca dinâmica de times
const logoCache: Record<string, string | null> = {};

export const FolderIcon: React.FC<FolderIconProps> = ({ name, level, className = '' }) => {
  const nomeLower = name.toLowerCase().trim();

  const [logoUrl, setLogoUrl] = useState<string | null>(logoCache[nomeLower] ?? null);
  const [hasError, setHasError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setHasError(false);
  }, [name]);

  // BUSCA DINÂMICA: Exclusiva para o nível 2 (Times)
  useEffect(() => {
    if (level !== 2 || PAIS_PARA_CODIGO[nomeLower] || logoCache[nomeLower] !== undefined) {
      return;
    }

    let isMounted = true;
    setLoading(true);

    const fetchTeamLogo = async () => {
      try {
        const response = await fetch(
          `https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${encodeURIComponent(name)}`
        );
        const data = await response.json();

        const foundBadge = data.teams?.[0]?.strBadge || null;
        logoCache[nomeLower] = foundBadge;

        if (isMounted) setLogoUrl(foundBadge);
      } catch (err) {
        console.error(`Erro ao buscar escudo para ${name}:`, err);
        logoCache[nomeLower] = null;
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchTeamLogo();

    return () => {
      isMounted = false;
    };
  }, [name, level, nomeLower]);

  // NÍVEL 1: Ligas e Categorias (Troféu + Sigla)
  if (level === 1) {
    const sigla = getSigla(name);
    return (
      <div className={`w-16 h-16 rounded-2xl bg-neutral-800 border border-neutral-700/80 p-2 flex flex-col items-center justify-center font-bold text-xs tracking-wider group-hover:border-amber-500 group-hover:scale-105 transition shadow-md ${className}`}>
        <Trophy size={22} className="text-amber-400 mb-0.5 opacity-90" />
        <span className="text-neutral-300 font-bold">{sigla}</span>
      </div>
    );
  }

  // NÍVEL 2: Seleção Nacional (Bandeira)
  const isoCode = PAIS_PARA_CODIGO[nomeLower];
  if (isoCode && !hasError) {
    return (
      <div className={`w-16 h-16 rounded-2xl overflow-hidden border border-neutral-700 bg-neutral-800 flex items-center justify-center shadow-md group-hover:scale-105 transition ${className}`}>
        <img
          src={`https://flagcdn.com/w160/${isoCode}.png`}
          alt={name}
          onError={() => setHasError(true)}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  // NÍVEL 2: Clube com Logo da Busca Dinâmica
  if (logoUrl && !hasError) {
    return (
      <div className={`w-16 h-16 rounded-2xl bg-neutral-800/80 border border-neutral-700/80 p-2 flex items-center justify-center group-hover:border-blue-500 group-hover:scale-105 transition shadow-md ${className}`}>
        <img
          src={logoUrl}
          alt={name}
          onError={() => setHasError(true)}
          className="w-full h-full object-contain filter drop-shadow"
        />
      </div>
    );
  }

  // NÍVEL 2: Fallback para Times sem Logo Encontrada (Escudo com Inicial)
  if (level === 2) {
    const inicial = name.charAt(0).toUpperCase();
    return (
      <div className={`w-16 h-16 rounded-2xl bg-neutral-800 border border-neutral-700 flex flex-col items-center justify-center group-hover:border-blue-500 group-hover:scale-105 transition shadow-md ${className}`}>
        <Shield size={24} className={`text-blue-400 mb-0.5 ${loading ? 'animate-pulse' : ''}`} />
        <span className="text-xs font-bold text-neutral-200">{inicial}</span>
      </div>
    );
  }

  // Fallback Padrão
  return (
    <Folder size={64} className={`text-amber-400 fill-amber-400/20 group-hover:scale-105 transition ${className}`} />
  );
};