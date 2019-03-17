/**
 * @author Olsi Rrjolli
 */

export default class NotFoundError extends Error {
  constructor(message: string) {
    super();
    this.message = message;
    this.name = NotFoundError.name;
  }
}
