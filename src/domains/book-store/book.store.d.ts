
/**
 * @author Olsi Rrjolli
 */
import { IModel } from 'restify-aws-lambda';

export interface IBookStore extends IModel {
  id: string;
  bookStoreName: string;
  bookStoreId: string;
  createdDate: string;
  lastModified: string;
  isDeleted: boolean;

  validate(): void;
}
