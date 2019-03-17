import {  IBookStore } from './book.store';

/**
 * @author Olsi Rrjolli 
 * 
 * Book Store Repository
 * This class abstract the DB calls for the book store
 */
export interface IBookStoreRepository {
  /**
   * Get all the book stores from the db
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
   *  the id of the bookStores
   * @return
   *  One Book Store
   */
  getBookStoreById(id: string): Promise<IBookStore>;

  /**
   * Update an existing Book Store
   * @param id 
   * the id of the bookStores which will be updated
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
