export interface Camisa {
  id: number;
  nomeTime: string;
  marca: string;
  temporada: string;
  tamanho: number;
  tipo: number; 
  versao: number; 
  numero: number;
  nomeJogador: string;
  isAutografada: boolean;
  fotoUrl: string;
  usuarioId: number;
  isSelecao?: boolean; 
  categoria?: string;
}

export interface AuthResponse {
  token: string;
}