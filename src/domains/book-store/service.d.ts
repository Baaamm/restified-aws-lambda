/**
 * @autor Olsi Rrjolli
 *  All interfaces for the Services are defined in this class.
 */

import {  IBookStore } from './book.store';

/**
 * Book Store Service
 * this class contains all the business Logic for the Book Store
 */
export interface IBookStoreService {
  /**
   * Get all the Book Stores from the db
   */
  getBookStores(): Promise<IBookStore[]>;

  /**
   * Create a new Book Store
   * @param bookStore
   *  the new Book Store which will be created
   * @return
   *  The new created Book Store
   */
  createBookStore(bookStore: IBookStore): Promise<IBookStore>;

  /**
   * Get bookStores by id
   * @param id
   *  the id of the book store
   * @return
   *  One Book Store
   */
  getBookStoreById(id: string): Promise<IBookStore>;

  /**
   * Update an existing Book Store
   * @param id
   *  the id of the bookStores which will be updated
   * @param bookStore
   *  the Book Store entity which will be updated
   * @return
   *  The updated Book Store
   */
  updateBookStore(bookStore: IBookStore, id: string): Promise<IBookStore>;

  /**
   * Delete an existing Book Store
   * @param id
   *  the id of the bookStores which will be deleted
   * @return
   *  The deleted Book Store
   */
  deleteBookStore(id: string): Promise<IBookStore>;
}
