import type { Uuid } from '@/utils/Uuid';

export type TipoProfissional = 'NUTRICIONISTA' | 'PSICOLOGO';

export interface IProfissional {
    id: Uuid;
    nome: string;
    email: string;
    telefone: string | null;
    cpf: string;
    tipo: TipoProfissional;
    especialidade: string | null;
    registro: string;
    foto: string | null;
    bio: string | null;
    ativo: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ICreateProfissional {
    nome: string;
    email: string;
    senha: string;
    cpf: string;
    tipo:  TipoProfissional;
    registro: string;
    telefone?:  string;
    especialidade?: string;
    bio?: string;
    foto?: string;
}

export interface IUpdateProfissional {
    nome?: string;
    email?: string;
    senha?: string;
    telefone?: string;
    especialidade?: string;
    bio?: string;
    foto?: string;
}

export interface ILoginProfissional {
    cpf: string;
    password:  string;
}

export interface IProfissionalWithRelations extends IProfissional {
    disponibilidades?:  IDisponibilidadePublic[];
    _count?: {
        agendamentos: number;
        formularios: number;
    };
}

export interface IProfissionalPublic {
    id: Uuid;
    nome: string;
    email: string;
    telefone:  string | null;
    tipo: TipoProfissional;
    tipoLabel?:  string;
    especialidade: string | null;
    registro: string;
    foto: string | null;
    bio: string | null;
    bioResumo?:  string;
    createdAt: string;
    disponibilidades: IDisponibilidadePublic[];
    resumoDisponibilidade?: string;
    temDisponibilidade:  boolean;
    totalAtendimentos: number;
    instagram?: string | null;
    linkedin?: string | null;
    whatsApp?: string | null;
}

export interface IDisponibilidadePublic {
    id: Uuid;
    diaSemana: number;
    dia?:  string;
    horaInicio: string;
    horaFim: string;
}

export interface IListProfissionalResponse {
    data: IProfissional[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface IListProfissionalPublicResponse {
    data: IProfissionalPublic[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
    filters?: {
        tipo:  TipoProfissional | null;
        especialidade: string | null;
        search:  string | null;
        ordenarPor?:  string | null;
    };
    summary?:  {
        totalProfissionais: number;
        totalNutricionistas: number;
        totalPsicologos: number;
    };
}

export interface IProfissionalDashboardBase {
    agendamentosHoje: number;
    faturamentoMes: number;
}

export interface IProfissionalDashboardNutricionista
    extends IProfissionalDashboardBase {

    evolucoesRecentes: any[];
}

export interface IProfissionalDashboardPsicologo
    extends IProfissionalDashboardBase {

    sessoesRealizadas: number;
}

export interface IProfissionalDashboardResponse {
    profissional: {
        id: string;
        nome: string;
        tipo: 'NUTRICIONISTA' | 'PSICOLOGO';
        ativo: boolean;
    };
}
