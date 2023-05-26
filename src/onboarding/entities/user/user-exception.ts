import { UserError } from './user-error'

export class UserException extends Error {
  public readonly errors = [] as UserError[]

  constructor(message, errors: UserError[]) {
    super(message)
    this.name = 'UserException'
    this.errors = errors
  }
}
