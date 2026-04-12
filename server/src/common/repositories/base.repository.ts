import { Document, Model, UpdateQuery } from 'mongoose';
import type { QueryFilter } from 'mongoose';
import { IBaseRepository } from './base.repository.interface';

export abstract class BaseRepository<T extends Document>
  implements IBaseRepository<T>
{
  constructor(protected readonly model: Model<T>) {}

  async create(doc: unknown): Promise<T> {
    const createdEntity = new this.model(doc);
    return createdEntity.save() as unknown as Promise<T>;
  }

  async findOne(filterQuery: QueryFilter<T>): Promise<T | null> {
    return this.model.findOne(filterQuery).exec() as Promise<T | null>;
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id).exec() as Promise<T | null>;
  }

  async find(
    filterQuery: QueryFilter<T>,
    skip: number = 0,
    limit: number = 10,
    sort?: string | Record<string, 1 | -1 | 'asc' | 'desc' | 'ascending' | 'descending'>,
  ): Promise<T[]> {
    let query = this.model.find(filterQuery);
    if (sort) {
      query = query.sort(sort);
    }
    return query.skip(skip).limit(limit).exec() as Promise<T[]>;
  }

  async findOneAndUpdate(
    filterQuery: QueryFilter<T>,
    updateQuery: UpdateQuery<T>,
  ): Promise<T | null> {
    return this.model
      .findOneAndUpdate(filterQuery, updateQuery, { new: true })
      .exec() as Promise<T | null>;
  }

  async findByIdAndUpdate(
    id: string,
    updateQuery: UpdateQuery<T>,
  ): Promise<T | null> {
    return this.model
      .findByIdAndUpdate(id, updateQuery, { new: true })
      .exec() as Promise<T | null>;
  }

  async deleteOne(filterQuery: QueryFilter<T>): Promise<boolean> {
    const result = await this.model.deleteOne(filterQuery).exec();
    return result.deletedCount !== undefined && result.deletedCount > 0;
  }

  async countDocuments(filterQuery: QueryFilter<T>): Promise<number> {
    return this.model.countDocuments(filterQuery).exec();
  }
}
