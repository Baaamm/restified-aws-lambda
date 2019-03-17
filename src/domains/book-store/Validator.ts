import * as Joi from 'joi';
import * as _ from 'lodash';
import ValidationError from '../../shared/exceptions/ValidationError';

export default class Validator {

  /**
   * Contains all Joi schemas for validation the properties for request
   */
  public static VALIDATOR_SCHEMA = {
    UUID: Joi.string().uuid(),
    UUID_REQUIRED: Joi.string().uuid().required(),
    BOOK_STORE_NAME: Joi.string().required(),
    BOOK_STORE_ID: Joi.string().uuid().required(),
    IS_DELETED: Joi.boolean(),
    CREATED_DATE: Joi.string().isoDate(),
    LAST_MODIFIED: Joi.string().isoDate(),
  };

  /**
   * Validate the field
   * @param validationSchema
   *  The validation Schema
   */
  public static validateField(field: string, value: string, validationSchema: any) {
    const data = {};
    data[field] = value;
    const schema = {};
    schema[field] = validationSchema;
    this.validate(data, schema);
  }

  /**
   * Validate data using Joi
   * @param data
   * validation data
   * @param schema
   * the vailidate schema
   */
  public static validate(data: Object, schema: Object): void {
    const result = Joi.validate(data, schema, { abortEarly: false });
    if (result.error) {
      throw new ValidationError('Invalid data set', this.formatError(result.error.details));
    }
  }

  /**
   * Error message formatter
   * @param details
   *  The Details for the Error message
   * @return {{field: any, message: any}[]}
   */
  private static formatError(details) {
    return _.map(details, (error) => {
      return { field: error['path'], message: error['message'] };
    });
  }
}
