import api from './api';
import type { CreateUrlDto } from '@/types/link.types';

export const urlService = {
    async getAll(page: number = 1, limit: number = 10, search?: string) {
        const response = await api.get('/urls', {
            params: { page, limit, search }
        });
        return response.data;
    },

    async create(dto: CreateUrlDto) {
        const response = await api.post('/urls', dto);
        return response.data;
    },

    async update(id: string, dto: Partial<CreateUrlDto>) {
        const response = await api.put(`/urls/${id}`, dto);
        return response.data;
    },

    async delete(id: string) {
        const response = await api.delete(`/urls/${id}`);
        return response.data;
    },

    async checkAvailability(slug: string, excludeId?: string) {
        const response = await api.get('/urls/check-availability', {
            params: { slug, excludeId }
        });
        return response.data;
    },
};
