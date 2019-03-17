import * as _ from 'lodash';
import { HttpStatusCode } from './enums/HttpStatusCode';
import { httpMethod as HttpMethod } from './constants/constants';
import NotFoundError from './exceptions/NotFoundError';
import ValidationError from './exceptions/ValidationError';

/**
 * This class represent the http response object
 */
export default class Response {
  private statusCode: HttpStatusCode;
  private headers: Object;
  private body: Object;

  /**
   * Generate success response for aws API gateway
   * @param body
   * Http response body object
   * @param statusCode
   * Http status code like 200, 204 etc
   * @return
   * Http response object as JSON string
   */
  public getSuccessResponse(httpMethod: string, body?: Object): Object {
    this.setSuccessResponse(httpMethod, body);
    return this.toJSONObject();
  }

  /**
   * Generate error response for aws API gateway
   * @param error
   * Application error like 500, 400 etc
   * @return
   * Http response object as JSON string
   */
  public getErrorResponse(error: Object): Object {
    this.setErrorResponse(error);
    return this.toJSONObject();
  }

  /**
   * Set Response from the success body and
   * map http method to http status code
   * @param httpMethod
   * The httpMethod like GET, POST etc
   * @param body
   * Response body object
   */
  public setSuccessResponse(httpMethod: string, body?: Object): void {
    switch (httpMethod) {
      case HttpMethod.GET:
        this.body = JSON.stringify(body);
        this.statusCode = HttpStatusCode.OK;
        break;
      case HttpMethod.POST:
        this.body = JSON.stringify(body);
        this.statusCode = HttpStatusCode.CREATED;
        break;
      case HttpMethod.PUT:
        this.statusCode = HttpStatusCode.UPDATED;
        break;
      case HttpMethod.DELETE:
        this.statusCode = HttpStatusCode.UPDATED;
        break;
      default:
        throw new Error(`Unknown httpMethod ${httpMethod}`);
    }

    this.headers = { 'Access-Control-Allow-Origin': '*' };
  }

  /**
   * Set Response based on the error type and
   * map error to corresponding http status code
   * @param error
   * Application error
   */
  public setErrorResponse(error: Object): void {
    let statusCode;
    let message;
    let errors;

    switch (error.constructor.name) {
      case NotFoundError.name:
        statusCode = HttpStatusCode.NOT_FOUND;
        message = _.get(error, 'message');
        break;
      case ValidationError.name:
        statusCode = HttpStatusCode.BAD_REQUEST;
        message = _.get(error, 'message');
        errors = _.get(error, 'errors');
        break;
      default:
        statusCode = HttpStatusCode.INTERNAL_SERVER_ERROR;
        if (error instanceof Error) {
          message = _.get(error, 'message');
        } else {
          message = _.isObject(error) ? JSON.stringify(error) : error;
        }
    }

    const responseBody = {
      statusCode: statusCode,
      message: message
    };

    if (errors) {
      responseBody['errors'] = errors;
    }

    this.body = JSON.stringify(responseBody);
    this.headers = { 'Access-Control-Allow-Origin': '*' };
    this.statusCode = statusCode;
  }

  /**
   * Convert Response object instance to JSON Object
   */
  public toJSONObject(): Object {
    return JSON.parse(JSON.stringify(this));
  }
}
