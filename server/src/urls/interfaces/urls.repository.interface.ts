import { IBaseRepository } from '../../common/repositories/base.repository.interface';
import { UrlDocument } from '../schemas/url.schema';

export interface IUrlsRepository extends IBaseRepository<UrlDocument> {
  // complex querying methods here
}
