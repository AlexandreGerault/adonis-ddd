import { RegistrationError } from './registration-error'

export class RegistrationException extends Error {
  public readonly errors = [] as RegistrationError[]

  constructor(message, errors: RegistrationError[]) {
    super(message)
    this.name = 'RegistrationException'
    this.errors = errors
  }
}
