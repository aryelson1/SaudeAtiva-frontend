export interface Question {
  id: number;
  pergunta: string;
  tipo: 'texto' | 'texto_longo' | 'multipla_escolha' | 'sim_nao' | 'numero' | 'data' | 'checkbox' | 'escala';
  opcoes?: string[];
  obrigatoria?: boolean;
  min?: number;
  max?: number;
}

export interface Questionnaire {
  id: string;
  titulo: string;
  descricao: string;
  tipo: string;
  perguntas: Question[];
  obrigatorio: boolean;
}

export interface Professional {
  id: string;
  nome: string;
  tipo: string;
  especialidade?: string;
  foto?: string;
  bio?: string;
}

export interface FormData {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientCpf?: string;
  clientBirthDate?: string;
  clientGender?: string;
}