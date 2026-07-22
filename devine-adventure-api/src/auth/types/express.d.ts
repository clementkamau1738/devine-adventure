import { RequestUser } from './jwt-payload.type';

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface User extends RequestUser {}
  }
}
