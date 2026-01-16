import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';

import type { ICreateFleet, IGetVehicleResponse, IResponseTelemetry, IVehicle, UserCredentials } from './trail.api.d';

import { getToken, logout } from '@/auth';
import type { Uuid } from '@/utils/Uuid';

const TRAIL_GET_TESTE = '/vehicles';
const TRAIL_PUT_TESTE = (id: Uuid) => `/vehicles/${id}`;
const TRAIL_GET_TESTE_UUID = (id: Uuid) => `/vehicles/${id}/teste`;
const TRAIL_POST_TESTE = '/fleets';
const TRAIL_LOGIN = '/login';

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

export const TrailApi = {
    getVehicles: async (): Promise<IGetVehicleResponse | undefined> => {
        const res = await http.get(TRAIL_GET_TESTE);
        if (res.status === 200) {
            return res.data;
        }
        return undefined;
    },
    getLastTelemetry: async (vehicleId: Uuid): Promise<IResponseTelemetry | undefined> => {
        const res = await http.get(TRAIL_GET_TESTE_UUID(vehicleId));
        if (res.status === 200) {
            return res.data;
        }
        return undefined;
    },
    login: async (userCredentials: UserCredentials): Promise<string> => {
        const res = await http.post<{ token: string }>(TRAIL_LOGIN, userCredentials);
        return res.data.token;
    },
    postFleet: async (fleetData: ICreateFleet): Promise<boolean> => {
        const res = await http.post(TRAIL_POST_TESTE, fleetData);
        return res.status === 201;
    },
    putVehicle: async (vehicleId: Uuid, vehicleData: IVehicle): Promise<boolean> => {
        const res = await http.put(TRAIL_PUT_TESTE(vehicleId), vehicleData);
        return res.status === 204;
    },
    getTelemetryHistory: async (vehicleId: Uuid, params: AxiosRequestConfig<any>): Promise<IResponseTelemetry[]> => {
        const res = await http.get(TRAIL_GET_TESTE_UUID(vehicleId), params);
        return res.data;
    },
};
