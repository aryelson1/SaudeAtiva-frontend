import axios, { type AxiosInstance } from 'axios';

import { getToken, logout } from '@/auth';
import type { Uuid } from '@/utils/Uuid';


const QUESTIONNAIRE_GET = (id: Uuid) => `/questionnaire/${id}`;
const QUESTIONNAIRE_SUBMIT = (id: Uuid) => `/questionnaire/${id}/submit`;
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

export const QuestionnaireAPI = {
    getQuestionnaire: async (id: Uuid): Promise<any | undefined> => {

        const res = await http.get(QUESTIONNAIRE_GET(id));

        if (res.status === 200) {
            return res.data;
        }

        return undefined;
    },

    submitQuestionnaire: async (id: Uuid, data: any): Promise<any | undefined> => {
        const res = await http.post(QUESTIONNAIRE_SUBMIT(id), data);
        if (res.status === 201) {
            return res.data;
        }
        return undefined;
    },

};