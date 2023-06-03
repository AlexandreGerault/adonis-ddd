import { RegistrationError, RegistrationException } from '@domain/onboarding/entities/registration'
import { RegistrationGateway } from '@domain/onboarding/gateways'
import { EventPublisher } from '../event-publisher'
import { RegistrationFactory } from '../entities/registration/registration-factory'

export interface RegisterProps {
  email: string
  pseudo: string
  password: string
}

export interface RegisterPresenter {
  validationFailed(errors: RegistrationError[]): void
  userRegistered(): void
}

export class Register {
  constructor(
    private readonly userGateway: RegistrationGateway,
    private readonly eventPublisher: EventPublisher,
    private readonly registrationFactory: RegistrationFactory
  ) {}

  public async execute(input: RegisterProps, presenter: RegisterPresenter): Promise<void> {
    try {
      const user = await this.registrationFactory.create(input.email, input.pseudo, input.password)

      await this.userGateway.save(user)

      this.eventPublisher.publish(user.domainEvents())
    } catch (error) {
      if (error instanceof RegistrationException) {
        presenter.validationFailed(error.errors)
        return
      }
    }

    presenter.userRegistered()
  }
}
