import api from './api';
import type { CreateUrlDto } from '@/types/link.types';
import { URL_API_ROUTES } from '@/constants/apiRoutes';

export const urlService = {
    async getAll(page: number = 1, limit: number = 10, search?: string) {
        const response = await api.get(URL_API_ROUTES.URLS, {
            params: { page, limit, search }
        });
        return response.data;
    },

    async create(dto: CreateUrlDto) {
        const response = await api.post(URL_API_ROUTES.URLS, dto);
        return response.data;
    },

    async update(id: string, dto: Partial<CreateUrlDto>) {
        const response = await api.put(URL_API_ROUTES.URL_BY_ID(id), dto);
        return response.data;
    },

    async delete(id: string) {
        const response = await api.delete(URL_API_ROUTES.URL_BY_ID(id));
        return response.data;
    },

    async checkAvailability(slug: string, excludeId?: string) {
        const response = await api.get(URL_API_ROUTES.CHECK_AVAILABILITY, {
            params: { slug, excludeId }
        });
        return response.data;
    },
};
