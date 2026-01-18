import type { Uuid } from '@/utils/Uuid';

export interface IDisponibilidade {
    id: Uuid;
    profissionalId: Uuid;
    diaSemana: number;
    horaInicio: string;
    horaFim: string;
    ativo: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ICreateDisponibilidade {
    profissionalId: Uuid;
    diaSemana: number;
    horaInicio: string;
    horaFim:  string;
    ativo?:  boolean;
}

export interface IUpdateDisponibilidade {
    diaSemana?: number;
    horaInicio?: string;
    horaFim?: string;
    ativo?: boolean;
}

export interface IListDisponibilidadeResponse {
    data: IDisponibilidade[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface IDisponibilidadeAgrupada {
    diaSemana: number;
    diaLabel: string;
    horarios: Array<{
        id: Uuid;
        horaInicio: string;
        horaFim: string;
        ativo: boolean;
    }>;
}