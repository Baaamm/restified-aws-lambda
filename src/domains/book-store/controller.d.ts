/**
 * @author Olsi Rrjolli
 * Book Store example controller
 */

import { IBookStore } from './book.store.d';
import { IController } from 'restify-aws-lambda';

export interface IBookStoreController extends IController  {
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
   * Get book store by id
   * @param id
   *  the id of the book store
   * @return
   *  One Book store
   */
  getBookStoreById(id: string): Promise<IBookStore>;

  /**
   * Update an existing book store
   * @param bookStore
   * The book store object
   * @param id
   *  the id of the book store which will be updated
   * @return
   *  The updated book store
   */
  updateBookStore(bookStore: IBookStore, id: string): Promise<IBookStore>;

  /**
   * Delete an existing book store
   * @param id
   *  the id of the book store which will be deleted
   * @return
   *  The deleted book store
   */
  deleteBookStore(id: string): Promise<IBookStore>;
}