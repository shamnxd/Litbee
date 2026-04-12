import { Document, UpdateQuery } from 'mongoose';
import type { QueryFilter } from 'mongoose';

export interface IBaseRepository<T extends Document> {
  create(doc: unknown): Promise<T>;
  findOne(filterQuery: QueryFilter<T>): Promise<T | null>;
  findById(id: string): Promise<T | null>;
  find(
    filterQuery: QueryFilter<T>,
    skip?: number,
    limit?: number,
    sort?: string | Record<string, 1 | -1 | 'asc' | 'desc' | 'ascending' | 'descending'>,
  ): Promise<T[]>;
  findOneAndUpdate(
    filterQuery: QueryFilter<T>,
    updateQuery: UpdateQuery<T>,
  ): Promise<T | null>;
  findByIdAndUpdate(id: string, updateQuery: UpdateQuery<T>): Promise<T | null>;
  deleteOne(filterQuery: QueryFilter<T>): Promise<boolean>;
  countDocuments(filterQuery: QueryFilter<T>): Promise<number>;
}
