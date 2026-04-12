import { IBaseRepository } from '../../common/repositories/base.repository.interface';
import { UrlDocument } from '../schemas/url.schema';

export const I_URLS_REPOSITORY = 'IUrlsRepository';

export interface IUrlsRepository extends IBaseRepository<UrlDocument> {
  // complex querying methods here
}
