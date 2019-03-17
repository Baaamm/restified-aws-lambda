/**
 * @author Olsi Rrjolli
 * This Class represent the service layer for BookStore
 */

import { IBookStoreService } from './service';
import { IBookStore } from './book.store';
import { Inject } from 'typescript-ioc';
import { v4 as uuid } from 'uuid';

import BookStoreRepository from './BookStoreRepository';

export default class BookStoreService implements IBookStoreService {
  @Inject
  private bookStoreRepository: BookStoreRepository;

    public getBookStores(): Promise<IBookStore[]> {
      return this.bookStoreRepository.getBookStores();
    }

    public createBookStore(bookStore: IBookStore): Promise<IBookStore> {
      bookStore.id = uuid();
      bookStore.createdDate = new Date().toISOString();
      bookStore.lastModified = new Date().toISOString();
      bookStore.isDeleted = false;
      return this.bookStoreRepository.createBookStore(bookStore);
    }

    public getBookStoreById(id: string): Promise<IBookStore> {
      return this.bookStoreRepository.getBookStoreById(id);
    }

    public updateBookStore(bookStore: IBookStore, id: string): Promise<IBookStore> {
      bookStore.lastModified = new Date().toISOString();
      return this.bookStoreRepository.updateBookStore(bookStore, id);
    }

    public deleteBookStore(id: string): Promise<IBookStore> {
      return this.bookStoreRepository.deleteBookStore(id);
    }
  }
