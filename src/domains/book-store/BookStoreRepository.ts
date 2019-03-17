/**
 * @author Olsi Rrjolli
 * These Repository represent the abstract layer for the book store database
 */
import AWS = require('aws-sdk');
import { Inject } from 'typescript-ioc';
import { IBookStore } from './book.store';
import { IBookStoreRepository } from './repository';
import NotFoundError from '../../shared/exceptions/NotFoundError';

export default class BookStoreRepository implements IBookStoreRepository {
    @Inject
    private dynamoDbClient: AWS.DynamoDB.DocumentClient;
    private params: any;

    constructor() {
        AWS.config.update({
            region: process.env.awsRegion
        });

        this.params = {
            TableName: process.env.bookStoreTableName
        };
    }

    public getBookStores(): any {
      this.params.FilterExpression = 'isDeleted = :isDeleted';
      this.params.ExpressionAttributeValues = {
        ':isDeleted': false
      };

      return this.dynamoDbClient.scan(this.params).promise().then((result: any) => {
        return result.Items;
      });
    }

    public createBookStore(bookStore: IBookStore): any {
      this.params.Item = bookStore;
      return this.dynamoDbClient.put(this.params).promise().then((result: any) => {
        return {id: bookStore.id};
      });
    }

    public getBookStoreById(id: string): any {
      this.params.Key = {
        id: id
      };
      return this.dynamoDbClient.get(this.params).promise().then((result) => {
        if (Object.keys(result).length === 0) {
          throw new NotFoundError(`Can not found book store ${id}`);
        }

        return result.Item;
      });
    }

    public updateBookStore(bookStore: IBookStore, id: string): any {
      this.params.Item = bookStore;
      this.params.ConditionExpression = 'contains(id, :id)';
      this.params.ExpressionAttributeValues = {
        ':id': id
      };

      return this.dynamoDbClient.put(this.params).promise().then((result: any) => {
        return result;
      }).catch((err) => {
        if (err.name === 'ConditionalCheckFailedException') {
          console.trace(err);
          throw new NotFoundError(`Can not found book store ${id}`);
        }

        return Promise.reject(err);
      });
    }

    public deleteBookStore(id: string): any {
      this.params.UpdateExpression = 'set isDeleted = :isDeleted';
      this.params.ConditionExpression = 'contains(id, :id)';
      this.params.ExpressionAttributeValues = {
        ':isDeleted': true,
        ':id': id
      };

      this.params.Key = {
        id : id
      };

      return this.dynamoDbClient.update(this.params).promise().then((result) => {
        return result;
      }).catch((err) => {
        if (err.name === 'ConditionalCheckFailedException') {
          console.trace(err);
          throw new NotFoundError(`Can not found book store ${id}`);
        }
        return Promise.reject(err);
      });
    }
}
