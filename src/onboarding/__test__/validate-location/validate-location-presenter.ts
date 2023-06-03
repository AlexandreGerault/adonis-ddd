import { ValidateLocationPresenter } from '@domain/onboarding/application/validate-location'

export class ValidateLocationTestPresenter implements ValidateLocationPresenter {
  public response: string

  public validated(): void {
    this.response = 'VALIDATED'
  }

  public invalidated(): void {
    this.response = 'INVALIDATED'
  }
}
