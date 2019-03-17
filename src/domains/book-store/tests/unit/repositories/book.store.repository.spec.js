/**
* @author
* Olsi Rrjolli
*
* This test case test the Book Store Repository layer
*/

const BookStoreRepository = require("../../../../../../dist/domains/book-store/BookStoreRepository").default;
const sinon = require('sinon');
const expect = require('chai').expect;
const aws = require("aws-sdk");

describe("BookStoreRepository", function () {
  let BookStoreRepositoryStub;

  before(function () {
    process.env.bookStoreTableName = "bookStoreTable";
    process.env.awsRegion = "awsRegion";
    BookStoreRepositoryStub = sinon.spy(function() {
      return sinon.createStubInstance(BookStoreRepository);
    });

    BookStoreRepositoryStubClass = new BookStoreRepositoryStub();
    bookStoreRepositoryInstance = new BookStoreRepositoryStubClass.constructor();
  });

  /**
   * Test BookStoreRepository getBookStores Method
   */
  describe("getBookStores", function () {
    it("When calling getBookStores Method the dynamoDbClient.scan is calling one time", function (done) {
      // given
      const bookStores = { Items: [] };
      const scanStub = { promise: () => Promise.resolve(bookStores) };
      const scan =  sinon.stub(bookStoreRepositoryInstance.dynamoDbClient, 'scan').returns(scanStub);

      // when - method under Test
      bookStoreRepositoryInstance.getBookStores()
        .then((result) => {
          expect(result).to.equal(bookStores.Items);
          done();
        })
        .catch((err) => done(err));

      // then
      sinon.assert.callCount(scan,1);
      scan.restore();
    });
  });

  /**
   * Test BookStoreRepository createBookStore Method
   */
  describe("createBookStore", function () {
    it("When calling createBookStore Method, test the dynamoDbClient.put is calling exact once", function (done) {
      // given
      const addBookStore = { id: '1' };
      const putStub = { promise: () => Promise.resolve() };
      const put =  sinon.stub(bookStoreRepositoryInstance.dynamoDbClient, 'put').returns(putStub);

      //  when - method under Test
      bookStoreRepositoryInstance.createBookStore(addBookStore)
        .then((result) => {
          expect(result.id).to.equal(addBookStore.id);
          done();
        })
        .catch((err) => done(err));

      // then
      sinon.assert.callCount(put,1);
      put.restore();
    });
  });

  /**
   * Test BookStoreRepository deleteBookStore Method
   */
  describe("deleteBookStore", function () {
    let bookStoreId;

    beforeEach(() => {
      bookStoreId = '1';
    });

    it("When calling deleteBookStore Method test the dynamoDbClient.update is calling exact once", function (done) {
      // given
      const dbResult = {};
      const updateStub = { promise: () => Promise.resolve(dbResult) };
      const update =  sinon.stub(bookStoreRepositoryInstance.dynamoDbClient, 'update').returns(updateStub);

      //  when - method under Test
      bookStoreRepositoryInstance.deleteBookStore(bookStoreId)
        .then((result) => {
          expect(result).to.equal(dbResult);
          done();
        })
        .catch((err) => done(err));

      // then
      sinon.assert.callCount(update,1);
      update.restore();
    });

    it("Should throw NotFoundError when catch ConditionalCheckFailedException", function (done) {
      // given
      const error = { name: 'ConditionalCheckFailedException' };
      const updateStub = { promise: () => Promise.reject(error) };
      const update =  sinon.stub(bookStoreRepositoryInstance.dynamoDbClient, 'update').returns(updateStub);

      //  when - method under Test
      bookStoreRepositoryInstance.deleteBookStore(bookStoreId)
        .catch((err) => {
          // then
          expect(err.name).to.equal('NotFoundError');
          expect(err.message).to.equal('Can not found book store 1');
          done();
        });

      update.restore();
    });

    it("Should throw the error when catch none ConditionalCheckFailedException error", function (done) {
      // given
      const error = { name: 'Error' };
      const updateStub = { promise: () => Promise.reject(error) };
      const update =  sinon.stub(bookStoreRepositoryInstance.dynamoDbClient, 'update').returns(updateStub);

      //  when - method under Test
      bookStoreRepositoryInstance.deleteBookStore(bookStoreId)
        .catch((err) => {
          // then
          expect(err.name).to.equal(error.name);
          done();
        });

      update.restore();
    });
  });

  /**
   * Test BookStoreRepository updateBookStore Method
   */
  describe("updateBookStore", function () {
    let addBookStore, bookStoreId;

    beforeEach(() => {
      addBookStore = require('../../resources/postBookStoreExample.json');
      bookStoreId = '1';
    });

    it("Test when calling updateBookStore Method test the call dynamoDbClient.put", function (done) {
      // given
      const dbResult = {};
      const putStub = { promise: () => Promise.resolve(dbResult) };
      const put =  sinon.stub(bookStoreRepositoryInstance.dynamoDbClient, 'put').returns(putStub);

      //  when - method under Test
      bookStoreRepositoryInstance.updateBookStore(addBookStore, bookStoreId)
        .then((result) => {
          expect(result).to.equal(dbResult);
          done();
        })
        .catch((err) => done(err));

      // then
      sinon.assert.callCount(put,1);
      put.restore();
    });

    it("Should throw NotFoundError when catch ConditionalCheckFailedException", function (done) {
      // given
      const error = { name: 'ConditionalCheckFailedException' };
      const putStub = { promise: () => Promise.reject(error) };
      const put =  sinon.stub(bookStoreRepositoryInstance.dynamoDbClient, 'put').returns(putStub);

      //  when - method under Test
      bookStoreRepositoryInstance.updateBookStore(addBookStore, bookStoreId)
        .catch((err) => {
          // then
          expect(err.name).to.equal('NotFoundError');
          expect(err.message).to.equal('Can not found book store 1');
          done();
        });

      put.restore();
    });

    it("Should throw the error when catch none ConditionalCheckFailedException error", function (done) {
      // given
      const error = { name: 'Error' };
      const putStub = { promise: () => Promise.reject(error) };
      const put =  sinon.stub(bookStoreRepositoryInstance.dynamoDbClient, 'put').returns(putStub);

      //  when - method under Test
      bookStoreRepositoryInstance.updateBookStore(addBookStore, bookStoreId)
        .catch((err) => {
          // then
          expect(err.name).to.equal(error.name);
          done();
        });

      put.restore();
    });
  });

  /**
   * Test BookStoreRepository getBookStoreById Method
   */
  describe("getBookStoreById", function () {
    it("Test when calling getBookStoreById Method test the call dynamoDbClient.get", function (done) {
      // given
      const bookStoreId = '1';
      const bookStore = { Item: { id: bookStoreId } };
      const getStub = { promise: () => Promise.resolve(bookStore) };
      const get =  sinon.stub(bookStoreRepositoryInstance.dynamoDbClient, 'get').returns(getStub);

      //  when - method under Test
      bookStoreRepositoryInstance.getBookStoreById(bookStoreId)
        .then((result) => {
          expect(result).to.equal(bookStore.Item);
          done();
        })
        .catch((err) => done(err));

      // then
      sinon.assert.callCount(get,1);
      get.restore();
    });

    it("Should throw NotFoundError when no book store found", function (done) {
      // given
      const bookStoreId = '1';
      const noResult = {};
      const getStub = { promise: () => Promise.resolve(noResult) };
      const get =  sinon.stub(bookStoreRepositoryInstance.dynamoDbClient, 'get').returns(getStub);

      //  when - method under Test
      bookStoreRepositoryInstance.getBookStoreById(bookStoreId)
        .catch((err) => {
          expect(err.name).to.equal('NotFoundError');
          expect(err.message).to.equal('Can not found book store 1');
          done();
        });

      // then
      sinon.assert.callCount(get,1);
      get.restore();
    });
  });
});
