export default class ValidationError extends Error {
  private errors: Object[];

  constructor(message: string, errors: Object[]) {
    super();
    this.message = message;
    this.errors = errors;
    this.name = ValidationError.name;
  }
}
