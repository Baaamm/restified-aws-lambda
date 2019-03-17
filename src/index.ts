/**
 * @author Olsi Rrjolli
 */
import { Context, Callback } from 'aws-lambda';
import { ControllerRegistry, execute, IAwsRequestEvent } from 'restify-aws-lambda';
import 'reflect-metadata';
import BookStoreController from './domains/book-store/BookStoreController';
import Response from './shared/Response';

// Register all Controllers
ControllerRegistry.register(BookStoreController);

const response: Response = new Response();

/**
 * This method choose the right function to execute the http request for AWS, it is the entry method of the aws function
 * @param awsRequestEvent
 *  contains the httpMethod (get,post,delete,put) and the body of the request
 * @param context
 *  The AWS Context
 * @param callback
 *  The response callback
 *  first parameter is to throw an error from AWS.
 *  first parameter is undefined because if we want to use our error code to send it to the client
 */
export function awsHandler(awsRequestEvent: IAwsRequestEvent, context: Context, callback: Callback): any {
  execute(awsRequestEvent).then((result) => {
    // PUT SOME DEBUGGING LOGS HERE
    callback(undefined, response.getSuccessResponse(awsRequestEvent.httpMethod, result));
  }).catch((error) => {
    // PUT SOME DEBUGGING LOGS HERE
    callback(undefined, response.getErrorResponse(error));
  });
}
