/**
 * @author
 * Olsi Rrjolli
 *
 * This test case test the BookStore Service layer
 */
const BookStoreService = require("../../../../../../dist/domains/book-store/BookStoreService").default;
const BookStoreRepository = require("../../../../../../dist/domains/book-store/BookStoreRepository").default;
const assert = require('chai').assert;
const sinon = require('sinon');


describe("BookStoreService", function () {
  let bookStoreService;

  beforeEach(function (doneBefore) {
    bookStoreService = new BookStoreService();
    doneBefore()
  });

  /**
   * Test BookStoreService getBookStores Method
   */
  describe("getBookStores", function () {
    it("Test the BookStoreService getBookStores method test repository getBookStores Method is calling", function (doneGet) {
     // given
      const repository = sinon.stub(BookStoreRepository.prototype, 'getBookStores').returns(null);

      // when - method under test
      bookStoreService.getBookStores();

      // then
      assert.isTrue(repository.called);
      repository.restore();
      doneGet();
    });
  });

  /**
   * Test BookStoreService createBookStore Method
   */
  describe("createBookStore", function () {
    it("BookStoreService createBookStore test repository createBookStore Method is calling", function (donePost) {
      // given
      const postDataBody = JSON.parse(require('../../resources/postBookStoreExample.json').body);

      const repository =  sinon.stub(BookStoreRepository.prototype, 'createBookStore').returns(null);

      // when - method under test
      bookStoreService.createBookStore(postDataBody);

      // then
      sinon.assert.calledWith(repository, postDataBody);
      repository.restore();
      donePost();
    });
  });

  /**
   * Test BookStoreService updateBookStore Method
   */
  describe("updateBookStore", function () {
    it("BookStoreService updateBookStore test repository updateBookStore Method is calling", function (doneUpdate) {
      // given
      const postDataBody = JSON.parse(require('../../resources/postBookStoreExample.json').body);
      const repository =  sinon.stub(BookStoreRepository.prototype, 'updateBookStore').returns(null);

      // when - method under test
      bookStoreService.updateBookStore(postDataBody, postDataBody.id);

      // then
      sinon.assert.calledWith(repository, postDataBody, postDataBody.id);
      repository.restore();
      doneUpdate();
    });
  });

  /**
   * Test BookStoreService deleteBookStore Method
   */
  describe("deleteBookStore", function () {
    it("BookStoreService deleteBookStore test repository deleteBookStore Method is calling", function (doneDelete) {
      // given
      const id = 1;
      const repository =  sinon.stub(BookStoreRepository.prototype, 'deleteBookStore').returns(null);

      // when - method under test
      bookStoreService.deleteBookStore(id);

      // then
      sinon.assert.calledWith(repository,id);
      repository.restore();
      doneDelete();
    });
  });

  /**
   * Test BookStoreService getBookStoreById Method
   */
  describe("getBookStoreById", function () {
    it("BookStoreService getBookStoreById test repository getBookStoreById Method is calling", function (doneGetOne) {
      // given
      const id = 1;
      const repository =  sinon.stub(BookStoreRepository.prototype, 'getBookStoreById').returns(null);

      // when - method under test
      bookStoreService.getBookStoreById(id);

      // then
      sinon.assert.calledWith(repository, id);
      repository.restore();
      doneGetOne();
    });
  });
});
