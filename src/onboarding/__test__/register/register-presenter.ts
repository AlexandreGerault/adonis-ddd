import { RegisterPresenter } from '@domain/onboarding/application/register'
import { RegistrationError } from '@domain/onboarding/entities/registration/registration-error'

export class RegisterTestPresenter implements RegisterPresenter {
  public response: string

  public errors: RegistrationError[] = []

  public userRegistered(): void {
    this.response = 'User created'
  }

  public validationFailed(errors: RegistrationError[]): void {
    this.response = 'Validation failed'
    this.errors = errors
  }
}
