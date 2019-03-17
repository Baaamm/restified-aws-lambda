/**
 * @author
 * Olsi Rrjolli
 *
 * These Tests describe a whole component for the Book Store. They create an In-Memory DynamoDB with a Table
 * These Tests are using a Local Lambda instance and cover all the layers involved in this repository (book store controller and book store service )
 */

const lambdaLocal = require('lambda-local');
const aws = require("aws-sdk");
const localDynamo = require('local-dynamo');
const expect = require('chai').expect;

describe("Test book store Api", function () {
  let awsdb = undefined;
  const BOOK_STOCK_TABLE_NAME = 'bookStore';
  const lamdaLocalEnvironment = { 'bookStoreTableName': BOOK_STOCK_TABLE_NAME };
  const dynamoLocalPort = 8000;
  let dbTableData;

  function getLambdaOptions(event, env) {
    return {
      event: event,
      lambdaPath: 'dist/index.js',
      lambdaHandler: "awsHandler",
      profileName: 'default',
      environment: env || lamdaLocalEnvironment,
      timeoutMs: 3000
    }
  }

  before(function () {
    aws.config.update({
      region: "us-west-2",
      endpoint: "http://localhost:8000",
      credentials: {
        accessKeyId: "accessKeyId",
        secretAccessKey: "secretAccessKey"
      }
    });
    awsdb = new aws.DynamoDB();

    dbTableData = {
      TableName: BOOK_STOCK_TABLE_NAME,
      KeySchema: [
        { AttributeName: "id", KeyType: "HASH" },
      ],
      AttributeDefinitions: [
        { AttributeName: "id", AttributeType: "S" },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10
      }
    };
    localDynamo.launch({
      port: dynamoLocalPort,
      sharedDb: true,
      heap: '512m'
    });
  });

  beforeEach(function (doneBeforeEach) {
    awsdb.createTable(dbTableData).promise().then(() => {
      console.log("Table Created: ", BOOK_STOCK_TABLE_NAME);
      doneBeforeEach();
    }).catch((err) => {
      doneBeforeEach(error);
    });
  });

  afterEach(function (afterEach) {
    const params = {
      TableName: BOOK_STOCK_TABLE_NAME
    };

    awsdb.deleteTable(params).promise().then((data) => {
      console.log("Deleted table. Table description JSON:", JSON.stringify(data, null, 2));
      afterEach();
    }).catch((error) => {
      afterEach(error);
    })
  });

  /**
   * Test the book store POST method for inserting a book store object
   */
  describe("POST /bookstore", function () {
    it("201 Created", function (donePost) {
      // given
      const postData = require('../resources/postBookStoreExample.json');

      // when - method under test
      lambdaLocal
        .execute(getLambdaOptions(postData))
        .then(function (response) {
          // Invoked Tests

          // then
          expect(JSON.parse(response.body)).to.have.property('id');
          expect(response.statusCode).to.equal(201);
          donePost();
        }).catch(function (err) {
          donePost(err);
        });
    });



    it("500 Internal server error", function (doneGet) {
      // given
      const postData = require('../resources/postBookStoreExample.json');

      // when - method under test
      lambdaLocal
        .execute(getLambdaOptions(postData, { 'bookStoreTableName': 'NONE_EXIST_DB' }))
        .then(function (response) {
          // Invoked Tests
          // then
          const body = JSON.parse(response.body);
          expect(body.message).to.equal('Cannot do operations on a non-existent table');
          expect(body.statusCode).to.equal(500);
          expect(response.statusCode).to.equal(500);
          doneGet();
        }).catch(function (err) {
          doneGet(err);
        });
    });
  });

  /**
   * Test the book store  GET method for getting the book store
   */
  describe("GET /bookstore", function () {

    beforeEach(function (endBefore) {
      delete require.cache[require.resolve('./../resources/getBookStoreExample.json')]; // to clear the npm cache = required module cache is cleanUp
      const expectedData = require('./../resources/postBookStoreExample.json');
      // post the data
      lambdaLocal
        .execute(getLambdaOptions(expectedData))
        .then(function (response) {
          endBefore()
        });
    });

    it("200 Success", function (doneGet) {
      // given
      delete require.cache[require.resolve('./../resources/postBookStoreExample.json')]; // to clear the npm cache = required module cache is cleanUp
      const getData = require('./../resources/getBookStoreExample.json');
      const expectedData = require('./../resources/postBookStoreExample.json');
      // when - method under test
      lambdaLocal
        .execute(getLambdaOptions(getData))
        .then(function (response) {
          // Invoked Tests
          // then
          expect(response.statusCode).to.equal(200);
          expect((JSON.parse(response.body))[0].bookStoreName).to.equal(JSON.parse(expectedData.body).bookStoreName);
          expect((JSON.parse(response.body))[0].bookStoreId).to.equal(JSON.parse(expectedData.body).bookStoreId);
          doneGet();
        }).catch(function (err) {
          doneGet(err);
        });
    });

    it("500 Internal server error", function (doneGet) {
      // given
      delete require.cache[require.resolve('./../resources/postBookStoreExample.json')]; // to clear the npm cache = required module cache is cleanUp
      const getData = require('./../resources/getBookStoreExample.json');
      const expectedData = require('./../resources/postBookStoreExample.json');
      // when - method under test
      lambdaLocal
        .execute(getLambdaOptions(getData, { 'bookStoreTableName': 'NONE_EXIST_DB' }))
        .then(function (response) {
          // Invoked Tests
          // then
          const body = JSON.parse(response.body);
          expect(body.message).to.equal('Cannot do operations on a non-existent table');
          expect(body.statusCode).to.equal(500);
          expect(response.statusCode).to.equal(500);
          doneGet();
        }).catch(function (err) {
          doneGet(err);
        });
    });
  });

  /**
   * Test the book store PUT method for updating a book store
   */
  describe("PUT /bookstore/{id}", function () {
    let id;
    let lastModified;
    let putData = require('./../resources/putBookStoreExample.json');

    beforeEach(function (endBefore) {
      delete require.cache[require.resolve('./../resources/getBookStoreExample.json')]; // to clear the npm cache = required module cache is cleanUp
      const postData = require('./../resources/postBookStoreExample.json');
      // post the data
      lambdaLocal
        .execute(getLambdaOptions(postData))
        .then(function (response) {
          // get all data to save the id
          const getData = require('./../resources/getBookStoreExample.json');
          return lambdaLocal.execute(getLambdaOptions(getData))
        })
        .then(function (response) {
          expect(response.statusCode).to.equal(200);
          id = JSON.parse(response.body)[0].id;
          lastModified = JSON.parse(response.body)[0].lastModified;
          endBefore();
        }).catch(function (err) {
          endBefore(err);
        });
    });

    it("204 Updated", function (done) {
      // given
      putData.pathParameters.id = id;
      let body = JSON.parse(putData.body);
      body.id = id;
      body = JSON.stringify(body);
      putData.body = body;
      // when - method under test
      lambdaLocal
        .execute(getLambdaOptions(putData))
        .then(function (response) {
          // Invoked Tests
          // then
          expect(response.statusCode).to.equal(204);
        })
        .then(() => {
          delete require.cache[require.resolve('./../resources/getBookStoreExample.json')]; // to clear the npm cache = required module cache is cleanUp
          let expectedData = require('./../resources/getOneBookStoreExample.json');
          expectedData.pathParameters.id = id;
          return lambdaLocal.execute(getLambdaOptions(expectedData))
        })
        .then((response) => {
          expect(JSON.parse(response.body).bookStoreName).to.equal(JSON.parse(putData.body).bookStoreName);
          expect(JSON.parse(response.body).bookStoreId).to.equal(JSON.parse(putData.body).bookStoreId);
          expect(JSON.parse(response.body).lastModified).to.not.equal(lastModified);

          done();
        })
        .catch(function (err) {
          done(err);
        });
    });

    it("400 Bad Request", function (done) {
      // given
      const BOOK_STORE_ID_INVALID = 'a8a09291';
      putData.pathParameters.id = BOOK_STORE_ID_INVALID;
      let body = JSON.parse(putData.body);
      body.id = id;
      body = JSON.stringify(body);
      putData.body = body;
      // when - method under test
      lambdaLocal
        .execute(getLambdaOptions(putData))
        .then(function (response) {
          const body = JSON.parse(response.body);
          expect(body.statusCode).to.equal(400);
          expect(body.message).to.equal('Invalid data set');
          expect(body.errors).to.deep.equal([
            { field: 'id', message: '\"id\" must be a valid GUID' }
          ]);
          expect(response.statusCode).to.equal(400);
          done();
        })
        .catch(function (err) {
          done(err);
        });
    });

    it("404 BookStore Not Found", function (donePut) {
      // given
      const BOOK_STORE_ID_NOT_EXIST = 'e30718c1-b8a4-4d81-a714-f0cfc2ab3a3a';
      putData.pathParameters.id = BOOK_STORE_ID_NOT_EXIST;
      let body = JSON.parse(putData.body);
      body.id = BOOK_STORE_ID_NOT_EXIST;
      body = JSON.stringify(body);
      putData.body = body;
      // when - method under test
      lambdaLocal
        .execute(getLambdaOptions(putData))
        .then(function (response) {
          // Invoked Tests
          // then
          const body = JSON.parse(response.body);
          expect(body.statusCode).to.equal(404);
          expect(body.message).to.equal('Can not found book store e30718c1-b8a4-4d81-a714-f0cfc2ab3a3a');
          expect(response.statusCode).to.equal(404);
          donePut();
        }).catch(function (err) {
          donePut(err);
        });
    });

    it("500 Internal server error", function (doneGet) {
      // given
      putData.pathParameters.id = id;
      let body = JSON.parse(putData.body);
      body.id = id;
      body = JSON.stringify(body);
      putData.body = body;
      // when - method under test
      lambdaLocal
        .execute(getLambdaOptions(putData, { 'bookStoreTableName': 'NONE_EXIST_DB' }))
        .then(function (response) {
          // Invoked Tests
          // then
          const body = JSON.parse(response.body);
          expect(body.message).to.equal('Cannot do operations on a non-existent table');
          expect(body.statusCode).to.equal(500);
          expect(response.statusCode).to.equal(500);
          doneGet();
        }).catch(function (err) {
          doneGet(err);
        });
    });
  });

  /**
   * Test the BookStore GET method for getting the bookStore
   */
  describe("GET /bookstore/{id}", function () {
    let id;
    beforeEach(function (endBefore) {
      delete require.cache[require.resolve('./../resources/getBookStoreExample.json')]; // to clear the npm cache = required module cache is cleanUp
      const expectedData = require('./../resources/postBookStoreExample.json');

      // post the data
      lambdaLocal
        .execute(getLambdaOptions(expectedData))
        .then(function (response) {
          // get all data to save the id
          const getData = require('./../resources/getBookStoreExample.json');
          return lambdaLocal.execute(getLambdaOptions(getData));
        })
        .then(function (response) {
          expect(response.statusCode).to.equal(200);
          id = JSON.parse(response.body)[0].id;

          endBefore();
        }).catch(function (err) {
          endBefore(err);
        });
    });

    it("200 Success", function (doneGet) {
      // given
      delete require.cache[require.resolve('./../resources/postBookStoreExample.json')]; // to clear the npm cache = required module cache is cleanUp
      let getData = require('./../resources/getOneBookStoreExample.json');
      const expectedData = require('./../resources/postBookStoreExample.json');
      getData.pathParameters.id = id;
      // when - method under test
      lambdaLocal
        .execute(getLambdaOptions(getData))
        .then(function (response) {

          // Invoked Tests
          // then
          expect(response.statusCode).to.equal(200);
          expect(JSON.parse(response.body).bookStoreName).to.equal(JSON.parse(expectedData.body).bookStoreName);
          expect(JSON.parse(response.body).bookStoreId).to.equal(JSON.parse(expectedData.body).bookStoreId);
          doneGet();
        }).catch(function (err) {
          doneGet(err);
        });
    });

    it("400 Invalid Request", function (doneGet) {
      // given
      delete require.cache[require.resolve('./../resources/postBookStoreExample.json')]; // to clear the npm cache = required module cache is cleanUp
      let getData = require('./../resources/getOneBookStoreExample.json');
      const INVALID_BOOK_STORE_ID = 'a8a09291';
      getData.pathParameters.id = INVALID_BOOK_STORE_ID;
      // when - method under test
      lambdaLocal
        .execute(getLambdaOptions(getData))
        .then(function (response) {

          // Invoked Tests
          // then
          const body = JSON.parse(response.body);
          expect(body.statusCode).to.equal(400);
          expect(body.message).to.equal('Invalid data set');
          expect(body.errors).to.deep.equal([
            {
              field: 'id',
              message: '"id" must be a valid GUID'
            }
          ]);
          expect(response.statusCode).to.equal(400);

          doneGet();
        }).catch(function (err) {
          doneGet(err);
        });
    });

    it("404 Not Found", function (doneGet) {
      // given
      delete require.cache[require.resolve('./../resources/postBookStoreExample.json')]; // to clear the npm cache = required module cache is cleanUp
      let getData = require('./../resources/getOneBookStoreExample.json');
      const NONE_BOOK_STORE_ID_EXIST = 'a8a09291-03fb-4fd8-a6bc-6cbb725da0ed';
      getData.pathParameters.id = NONE_BOOK_STORE_ID_EXIST;
      // when - method under test
      lambdaLocal
        .execute(getLambdaOptions(getData))
        .then(function (response) {

          // Invoked Tests
          // then
          const body = JSON.parse(response.body);
          expect(body.statusCode).to.equal(404);
          expect(body.message).to.equal('Can not found book store a8a09291-03fb-4fd8-a6bc-6cbb725da0ed');
          expect(response.statusCode).to.equal(404);

          doneGet();
        }).catch(function (err) {
          doneGet(err);
        });
    });

    it("500 Internal server error", function (doneGet) {
      // given
      delete require.cache[require.resolve('./../resources/postBookStoreExample.json')]; // to clear the npm cache = required module cache is cleanUp
      let getData = require('./../resources/getOneBookStoreExample.json');
      // when - method under test
      lambdaLocal
        .execute(getLambdaOptions(getData, { 'bookStoreTableName': 'NONE_EXIST_DB' }))
        .then(function (response) {
          // Invoked Tests
          // then
          const body = JSON.parse(response.body);
          expect(body.message).to.equal('Cannot do operations on a non-existent table');
          expect(body.statusCode).to.equal(500);
          expect(response.statusCode).to.equal(500);
          doneGet();
        }).catch(function (err) {
          doneGet(err);
        });
    });
  });

  /**
   * Test the bookStore GET method for getting the BookStore
   */
  describe("DELETE /bookstore/{id}", function () {

    let id;
    beforeEach(function (endBefore) {
      delete require.cache[require.resolve('./../resources/getBookStoreExample.json')]; // to clear the npm cache = required module cache is cleanUp
      const expectedData = require('./../resources/postBookStoreExample.json');

      // post the data
      lambdaLocal
        .execute(getLambdaOptions(expectedData))
        .then(function (response) {
          // get all data to save the id
          const getData = require('./../resources/getBookStoreExample.json');
          return lambdaLocal.execute(getLambdaOptions(getData));
        })
        .then(function (response) {
          expect(response.statusCode).to.equal(200);
          id = JSON.parse(response.body)[0].id;

          endBefore();
        }).catch(function (err) {
          endBefore(err);
        });
    });

    it("204 Deleted - soft delete", function (done) {
      // given
      delete require.cache[require.resolve('./../resources/postBookStoreExample.json')]; // to clear the npm cache = required module cache is cleanUp
      const deleteData = require('./../resources/deleteBookStoreExample.json');
      deleteData.pathParameters.id = id;

      // when - method under test
      lambdaLocal
        .execute(getLambdaOptions(deleteData))
        .then(function (response) {
          // Invoked Tests
          // then
          expect(response.statusCode).to.equal(204);
        })
        .then(() => {
          delete require.cache[require.resolve('./../resources/getBookStoreExample.json')]; // to clear the npm cache = required module cache is cleanUp
          const expectedData = require('./../resources/getBookStoreExample.json');
          return lambdaLocal.execute(getLambdaOptions(expectedData));
        })
        .then((response) => {
          expect(response.statusCode).to.equal(200);
          expect(JSON.parse(response.body)).to.be.empty;
          done();
        })
        .catch(function (err) {
          done(err);
        });
    });

    it("400 Invalid Request", function (doneGet) {
      // given
      delete require.cache[require.resolve('./../resources/postBookStoreExample.json')]; // to clear the npm cache = required module cache is cleanUp
      const deleteData = require('./../resources/deleteBookStoreExample.json');
      const INVALIDE_BOOK_STORE_ID = 'a8a09291';
      deleteData.pathParameters.id = INVALIDE_BOOK_STORE_ID;
      // when - method under test
      lambdaLocal
        .execute(getLambdaOptions(deleteData))
        .then(function (response) {

          // Invoked Tests
          // then
          const body = JSON.parse(response.body);
          expect(body.statusCode).to.equal(400);
          expect(body.message).to.equal('Invalid data set');
          expect(body.errors).to.deep.equal([
            {
              field: 'id',
              message: '"id" must be a valid GUID'
            }
          ]);
          expect(response.statusCode).to.equal(400);

          doneGet();
        }).catch(function (err) {
          doneGet(err);
        });
    });

    it("404 BookStore Not Found", function (done) {
      // given
      const NONE_BOOK_STORE_ID_EXIST = '130af053-d103-4903-b84a-1ec016275f7c';
      delete require.cache[require.resolve('./../resources/postBookStoreExample.json')]; // to clear the npm cache = required module cache is cleanUp
      const deleteData = require('./../resources/deleteBookStoreExample.json');
      deleteData.pathParameters.id = NONE_BOOK_STORE_ID_EXIST;

      // when - method under test
      lambdaLocal
        .execute(getLambdaOptions(deleteData))
        .then(function (response) {
          // Invoked Tests
          // then
          const body = JSON.parse(response.body);
          expect(body.statusCode).to.equal(404);
          expect(body.message).to.equal('Can not found book store 130af053-d103-4903-b84a-1ec016275f7c');
          expect(response.statusCode).to.equal(404);
          done();
        })
        .catch(function (err) {
          done(err);
        });
    });

    it("500 Internal server error", function (done) {
      // given
      delete require.cache[require.resolve('./../resources/postBookStoreExample.json')]; // to clear the npm cache = required module cache is cleanUp
      const deleteData = require('./../resources/deleteBookStoreExample.json');
      deleteData.pathParameters.id = id;

      // when - method under test
      lambdaLocal
        .execute(getLambdaOptions(deleteData, { 'bookStoreTableName': 'NONE_EXIST_DB' }))
        .then(function (response) {
          // Invoked Tests
          // then
          const body = JSON.parse(response.body);
          expect(body.message).to.equal('Cannot do operations on a non-existent table');
          expect(body.statusCode).to.equal(500);
          expect(response.statusCode).to.equal(500);
          done();
        })
        .catch(function (err) {
          done(err);
        });
    });
  });
});
