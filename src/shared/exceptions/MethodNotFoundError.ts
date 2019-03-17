/**
 * @author Olsi Rrjolli
 */

export default class MethodNotFoundError extends Error {
  constructor(message: string) {
    super();
    this.message = message;
    this.name = MethodNotFoundError.name;
  }
}
