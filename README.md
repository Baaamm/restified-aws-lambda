# Introduction
This project describes a way to implement aws lambda functions in  form of enterprise patterns as a multi tier application and uses dynamodb local and lambda local to simplify the local implementation. 
The project seperate the application into three layers. The controllers, the services and the repository (DAO layer)

The project is based on TypeScript and uses the reflect-metadata library to map the AWS lambda event to the respective controllers. 


## How to get start?
You can look at the "book-store" example which is in the src / domains. There you can see how an application could look like. In src / index.ts you will find an awsHandler and how to register a controller.

```sh```
npm install

```sh``` 
npm run build

## Testing
Run all test    
`npm run test`  

The component tests are testing all Layers (Controller, Service and Repository).
These tests build a local dynamodb on the fly and create the appropriate table you need.
You can insert, select and update data in the table.

### Create your Controller
When you create a new controller you need first to define the resource that match to the aws event

example aws event:
```json
{
  "resource": "/bookstores",
  "path": "/bookstores",
  "httpMethod": "GET",
  "headers": {},
  "queryStringParameters": null,
  "pathParameters": null,
  "requestContext":
  {
    "path": "/bookstores",
    "accountId": "",
    "resourceId": "",
    "stage": "",
    "requestId": "",
    "resourcePath": "/",
    "httpMethod": "GET",
    "apiId": ""
  },
  "body": null,
  "isBase64Encoded": false
}
```
As you can see, the resource in this example is "/bookstores", that means your controller need to defined by the same resource: @Controller('/bookstores'). See following code:

Example Controller:
```js
@Singleton
@Model(BookStore)
@Controller('/bookstores')
export default class BookStoreController implements IBookStoreController   {
    @Inject
    private bookStoreService: BookStoreService;

    @GET()
    public getBookStores(): Promise<IBookStore[]> {
      return this.bookStoreService.getBookStores();
    }

    @GET('/{id}')
    public getBookStoreById(@PathParam('id') id: string): Promise<IBookStore> {
      Validator.validateField('id', id, Validator.VALIDATOR_SCHEMA.UUID_REQUIRED);
      return this.bookStoreService.getBookStoreById(id);
    }

    @POST()
    public createBookStore (bookStore: IBookStore): Promise<IBookStore> {
      return this.bookStoreService.createBookStore(bookStore);
    }
    ....
}
```

As you can also see, you can use annotations (as in jax-rs or spring requestMapping) @GET, @POST, @PUT, @DELETE to define the routing. 
In addition, you can use @PathParam and @QueryParam to access the path paremeter and query paremeter

Adding new Controller in the index.ts:
``` js
ControllerRegistry.register(BookStoreController);
```
Thats it!

By simply registering the controllers, you no longer need to worry about mapping the aws event for the particular component, and your code remains clearly structured

### Available Modules/Components
``` js
import { Model, Controller, POST, GET, PUT, PathParam, DELETE 
 ControllerRegistry, Response, QueryParam, MethodNotFoundError, NotFoundError
 ValidationError, execute, Validator, Model} from 'restify-aws-lambda';
```
You can import following exported methods/classes/modules like below:

| components          | description                                         | 
| ------------------- |:---------------------------------------------------:| 
| ControllerRegistry  | to register a controller                            | 
| Controller          | @Controller to define an new controller             | 
| GET                 | HTTP GET    -> @GET                                 | 
| POST                | HTTP POST   -> @POST                                | 
| PUT                 | HTTP PUT    -> @PUT                                 | 
| DELETE              | HTTP DELETE -> @DELETE                              | 
| PathParam           | @PathParam to get the path paramenter               | 
| QueryParam          | @QueryParam to get the query paremeter              | 
| execute             | execute the incoming aws event                      | 
| Model               | Model for example Book Store                        | 

Please take a look of the example how you can use the below components.

