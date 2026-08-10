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
}

export interface AuthResponse {
  token: string;
}