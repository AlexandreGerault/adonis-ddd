import { RegisterPresenter } from '@domain/onboarding/application/register'
import { UserError } from '@domain/onboarding/entities/user/user-error'

export class RegisterTestPresenter implements RegisterPresenter {
  public response: string

  public errors: UserError[] = []

  public emailAlreadyInUse(): void {
    this.response = 'User already exists with this email'
  }

  public userRegistered(): void {
    this.response = 'User created'
  }

  public pseudoAlreadyInUse(): void {
    this.response = 'User already exists with this pseudo'
  }

  public validationFailed(errors: UserError[]): void {
    this.errors = errors
  }

  public emailIsTrash(): void {
    this.response = 'This email cannot be used'
  }
}
