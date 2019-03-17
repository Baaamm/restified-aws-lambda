/**
 * @author Olsi Rrjolli
 * This Class Represent the Controller for the Book Store. In this class are all endpoints defined
 */

import { Inject, Singleton } from 'typescript-ioc';
import BookStoreService from './BookStoreService';
import { Model, Controller, POST, GET, PUT, PathParam, DELETE } from 'restify-aws-lambda';
import { IBookStore } from './book.store';
import { IBookStoreController } from './controller.d';
import { BookStore } from './BookStore';
import Validator from './Validator';

@Singleton
@Model(BookStore)
@Controller('/bookstores')
export default class BookStoreController implements IBookStoreController   {
    @Inject
    private bookStoreService: BookStoreService;

    @GET()
    public getBookStores(): Promise<IBookStore[]> {
      return this.bookStoreService.getBookStores();
    }

    @POST()
    public createBookStore (bookStore: IBookStore): Promise<IBookStore> {
      return this.bookStoreService.createBookStore(bookStore);
    }

    @GET('/{id}')
    public getBookStoreById(@PathParam('id') id: string): Promise<IBookStore> {
      Validator.validateField('id', id, Validator.VALIDATOR_SCHEMA.UUID_REQUIRED);
      return this.bookStoreService.getBookStoreById(id);
    }

    @PUT('/{id}')
    public updateBookStore(bookStore: IBookStore, @PathParam('id') id: string): Promise<IBookStore> {
      Validator.validateField('id', id, Validator.VALIDATOR_SCHEMA.UUID_REQUIRED);
      // TODO valtdate the book store
      return this.bookStoreService.updateBookStore(bookStore, id);
    }

    @DELETE('/{id}')
    public deleteBookStore(@PathParam('id') id: string): Promise<IBookStore> {
      Validator.validateField('id', id, Validator.VALIDATOR_SCHEMA.UUID_REQUIRED);
      // TODO validate the book store
      return this.bookStoreService.deleteBookStore(id);
    }
}
