import { User, UserError, UserException } from '@domain/onboarding/entities/user'
import { UserGateway } from '@domain/onboarding/gateways'
import { TrashEmailGateway } from '@domain/onboarding/gateways/tash-email-gateway'
import { EventPublisher } from '../event-publisher'

export interface RegisterProps {
  email: string
  pseudo: string
  password: string
}

export interface RegisterPresenter {
  validationFailed(errors: UserError[]): void
  pseudoAlreadyInUse(): void
  emailAlreadyInUse(): void
  userRegistered(): void
  emailIsTrash(): void
}

export class Register {
  constructor(
    private readonly userGateway: UserGateway,
    private readonly trashEmail: TrashEmailGateway,
    private readonly eventPublisher: EventPublisher
  ) {}

  public async execute(input: RegisterProps, presenter: RegisterPresenter): Promise<void> {
    if (await this.userGateway.emailExists(input.email)) {
      presenter.emailAlreadyInUse()
      return
    }

    if (await this.userGateway.pseudoExists(input.pseudo)) {
      presenter.pseudoAlreadyInUse()
      return
    }

    if (await this.trashEmail.isTrash(input.email)) {
      presenter.emailIsTrash()
      return
    }

    try {
      const user = User.create(input.email, input.pseudo, input.password)
      await this.userGateway.save(user)
      this.eventPublisher.publish(user.domainEvents())
    } catch (error) {
      if (error instanceof UserException) {
        presenter.validationFailed(error.errors)
        return
      }
    }

    presenter.userRegistered()
  }
}
