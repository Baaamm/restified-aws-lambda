/**
 * @author
 * Olsi Rrjolli
 *
 * This test case test the Book Store Controller API layer
 */
const BookStoreController = require("../../../../../../dist/domains/book-store/BookStoreController").default;
const BookStoreService = require("../../../../../../dist/domains/book-store/BookStoreService").default;
const BookStore = require("../../../../../../dist//domains/book-store/BookStore").BookStore;
const Validator = require("../../../../../../dist/domains/book-store/Validator").default;
const assert = require('chai').assert;
const sinon = require('sinon');


describe("BookStoreController", function () {
  let bookStoreController;

  before(function () {
    bookStoreController = new BookStoreController();
  });

  /**
   * Test BookStoreController getBookStores Method
   */
  describe("getBookStores", function () {
    it("Test getBookStoresService getBookStores Method is calling", function () {
     // given
      const bookStoreService =  sinon.stub(BookStoreService.prototype, 'getBookStores').returns(null);

      // when - method under test
      bookStoreController.getBookStores();

      // then
      assert.isTrue(bookStoreService.called);
      bookStoreService.restore();
    });
  });

  /**
   * Test BookStoreController createBookStore Method
   */
  describe("createBookStore", function () {
    let createBookStore;
    let bookStore;

    beforeEach(() => {
      bookStore = new BookStore();
      sinon.stub(bookStore, 'validate').returns(null);
      createBookStore =  sinon.stub(BookStoreService.prototype, 'createBookStore').returns(null);

      bookStoreController.createBookStore(bookStore);
    });

    afterEach(() => {
      bookStore.validate.restore();
      createBookStore.restore();
    });

    it("should call bookStoreService.createBookStore()", function () {
      sinon.assert.calledWith(createBookStore, bookStore);
    });
  });

  /**
   * Test BookStoreController updateBookStore Method
   */
  describe("updateBookStore", function () {
    let updateBookStore;
    let bookStoreId;
    let bookStore;

    beforeEach(() => {
      bookStoreId = '1';
      bookStore = new BookStore();
      sinon.stub(Validator, 'validateField').returns(null);
      sinon.stub(bookStore, 'validate').returns(null);
      updateBookStore =  sinon.stub(BookStoreService.prototype, 'updateBookStore').returns(null);

      bookStoreController.updateBookStore(bookStore, bookStoreId);
    });

    afterEach(() => {
      Validator.validateField.restore();
      bookStore.validate.restore();
      updateBookStore.restore();
    });

    it("should call Validator.validateField()", function () {
      sinon.assert.calledOnce(Validator.validateField);
      sinon.assert.calledWith(Validator.validateField, 'id', bookStoreId, Validator.VALIDATOR_SCHEMA.UUID_REQUIRED);
    });

    it("should call bookStoreService.updateBookStore()", function () {
      sinon.assert.calledOnce(updateBookStore);
      sinon.assert.calledWith(updateBookStore, bookStore, bookStoreId);
    });
  });

  /**
   * Test BookStoreController deleteBookStore Method
   */
  describe("deleteBookStore", function () {
    let deleteBookStore;
    let bookStoreId;

    beforeEach(() => {
      bookStoreId = '1';
      sinon.stub(Validator, 'validateField').returns(null);
      deleteBookStore =  sinon.stub(BookStoreService.prototype, 'deleteBookStore').returns(null);

      bookStoreController.deleteBookStore(bookStoreId);
    });

    afterEach(() => {
      Validator.validateField.restore();
      deleteBookStore.restore();
    });

    it("should call Validator.validateField()", function () {
      sinon.assert.calledWith(Validator.validateField, 'id', bookStoreId, Validator.VALIDATOR_SCHEMA.UUID_REQUIRED);
    });

    it("should call bookStoreService.deleteBookStore()", function () {
      sinon.assert.calledWith(deleteBookStore, bookStoreId);
    });
  });

  /**
   * Test BookStoreController getBookStoreById Method
   */
  describe("getBookStoreById", function () {
    let getBookStoreById;
    let bookStoreId;

    beforeEach(() => {
      bookStoreId = '1';
      sinon.stub(Validator, 'validateField').returns(null);
      getBookStoreById =  sinon.stub(BookStoreService.prototype, 'getBookStoreById').returns(null);

      bookStoreController.getBookStoreById(bookStoreId);
    });

    afterEach(() => {
      Validator.validateField.restore();
      getBookStoreById.restore();
    });

    it("should call Validator.validateField()", function () {
      sinon.assert.calledWith(Validator.validateField, 'id', bookStoreId, Validator.VALIDATOR_SCHEMA.UUID_REQUIRED);
    });

    it("should call bookStoreService.getBookStoreById()", function () {
      sinon.assert.calledWith(getBookStoreById, bookStoreId);
    });
  });
});
