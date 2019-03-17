/**
 * @author Olsi Rrjolli
 */
import {  IBookStore } from './book.store';
import { JsonProperty } from 'json-typescript-mapper';
import Validator from './Validator';


export class BookStore implements IBookStore {

  @JsonProperty('id')
  id: string;
  @JsonProperty('bookStoreName')
  bookStoreName: string;
  @JsonProperty('bookStoreId')
  bookStoreId: string;
  @JsonProperty('lastModified')
  lastModified: string;
  @JsonProperty('createDate')
  createdDate: string;
  @JsonProperty('isDeleted')
  isDeleted: boolean;

  constructor () {
    this.id = void 0 ;
    this.bookStoreName = void 0 ;
    this.bookStoreId = void 0 ;
    this.createdDate = void 0 ;
    this.lastModified = void 0 ;
    this.isDeleted = void 0 ;
  }

  public validate (): void {
    const data = this;
    const schema = {
      id: Validator.VALIDATOR_SCHEMA.UUID,
      bookStoreName: Validator.VALIDATOR_SCHEMA.BOOK_STORE_NAME,
      bookStoreId: Validator.VALIDATOR_SCHEMA.BOOK_STORE_ID,
      isDeleted: Validator.VALIDATOR_SCHEMA.IS_DELETED,
      createdDate: Validator.VALIDATOR_SCHEMA.CREATED_DATE,
      lastModified: Validator.VALIDATOR_SCHEMA.LAST_MODIFIED
    };

    Validator.validate(data, schema);
  }
}
