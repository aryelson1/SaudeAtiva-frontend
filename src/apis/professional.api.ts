import axios, { type AxiosInstance } from 'axios';

import { getToken, logout } from '@/auth';
import type { Uuid } from '@/utils/Uuid';
import type {
    IProfissional,
    ICreateProfissional,
    IUpdateProfissional,
    ILoginProfissional,
    IListProfissionalResponse,
    IListProfissionalPublicResponse,
} from './professional.api.d';

const PROFISSIONAL_LIST = '/profissional';
const PROFISSIONAL_LIST_PUBLIC = '/profissional/public';
const PROFISSIONAL_LIST_PUBLIC_DETAILED = '/profissional/public/detailed';
const PROFISSIONAL_CREATE = '/profissional';
const PROFISSIONAL_LOGIN = '/login/professional';
const PROFISSIONAL_GET = (id: Uuid) => `/profissional/${id}`;
const PROFISSIONAL_UPDATE = (id: Uuid) => `/profissional/${id}`;
const PROFISSIONAL_DELETE = (id: Uuid) => `/profissional/${id}`;
const PROFISSIONAL_DASHBOARD = (id: Uuid) => `/profissional/${id}/dashboard`;

const http: AxiosInstance = axios.create({
    baseURL: `http://localhost:7070/api/`,
    timeout: 15000,
    headers: {},
});

http.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

http.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            logout();
        }

        return Promise.reject(error);
    }
);

export const ProfissionalApi = {
    // Login
    login: async (credentials: ILoginProfissional): Promise<string> => {
        const res = await http.post<{ token: string; profissional: IProfissional }>(
            PROFISSIONAL_LOGIN,
            credentials
        );
        return res.data.token;
    },

    // Criar profissional
    create: async (data: ICreateProfissional): Promise<IProfissional | undefined> => {
        const res = await http.post<IProfissional>(PROFISSIONAL_CREATE, data);
        if (res.status === 201) {
            return res.data;
        }
        return undefined;
    },

    // Buscar por ID
    getById: async (id: Uuid): Promise<IProfissional | undefined> => {
        const res = await http.get<IProfissional>(PROFISSIONAL_GET(id));
        if (res.status === 200) {
            return res.data;
        }
        return undefined;
    },

    // Atualizar
    update: async (id: Uuid, data: IUpdateProfissional): Promise<IProfissional | undefined> => {
        const res = await http.put<IProfissional>(PROFISSIONAL_UPDATE(id), data);
        if (res.status === 200) {
            return res.data;
        }
        return undefined;
    },

    // Deletar (soft delete)
    delete: async (id: Uuid): Promise<boolean> => {
        const res = await http.delete(PROFISSIONAL_DELETE(id));
        return res.status === 204;
    },

    // Listar (autenticado)
    list: async (params?: {
        tipo?: 'NUTRICIONISTA' | 'PSICOLOGO';
        ativo?: boolean;
        page?: number;
        limit?: number;
    }): Promise<IListProfissionalResponse | undefined> => {
        const res = await http.get<IListProfissionalResponse>(PROFISSIONAL_LIST, { params });
        if (res.status === 200) {
            return res.data;
        }
        return undefined;
    },

    // Listar público (para tela inicial)
    listPublic: async (params?: {
        tipo?: 'NUTRICIONISTA' | 'PSICOLOGO';
        especialidade?: string;
        search?: string;
        page?: number;
        limit?: number;
    }): Promise<IListProfissionalPublicResponse | undefined> => {
        const res = await http.get<IListProfissionalPublicResponse>(PROFISSIONAL_LIST_PUBLIC, { params });
        if (res.status === 200) {
            return res.data;
        }
        return undefined;
    },

    // Listar público detalhado
    listPublicDetailed: async (params?: {
        tipo?: 'NUTRICIONISTA' | 'PSICOLOGO';
        especialidade?: string;
        search?: string;
        ordenarPor?: 'recente' | 'nome' | 'atendimentos';
        page?: number;
        limit?: number;
    }): Promise<IListProfissionalPublicResponse | undefined> => {
        const res = await http.get<IListProfissionalPublicResponse>(PROFISSIONAL_LIST_PUBLIC_DETAILED, { params });
        if (res.status === 200) {
            return res.data;
        }
        return undefined;
    },

    // Dashboard profissional
    dashboard: async (id: Uuid): Promise<any | undefined> => {

        const res = await http.get(PROFISSIONAL_DASHBOARD(id));

        if (res.status === 200) {
            return res.data;
        }

        return undefined;
    },

};