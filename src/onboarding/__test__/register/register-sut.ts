import { Register, RegisterProps } from '@domain/onboarding/application/register'
import { InMemoryUserGateway } from '@domain/onboarding/__test__/in-memory-user-gateway'
import { Registration } from '@domain/onboarding/entities/registration'
import { RegisterTestPresenter } from './register-presenter'
import { TrashEmailGateway } from '@domain/onboarding/gateways/tash-email-gateway'
import { InMemoryEventPublisher } from '../in-memory-event-publisher'
import { PlainPassword } from '@domain/onboarding/entities/registration/plain-password'
import { HashedPassword } from '@domain/onboarding/entities/registration/hashed-password'
import { RegistrationFactory } from '@domain/onboarding/entities/registration/registration-factory'
import { FakePasswordHasher } from '../fake-password-hasher'
import { Email } from '@domain/onboarding/entities/registration/email'
import { Pseudo } from '@domain/onboarding/entities/registration/pseudo'

interface RegisterSUTProps {
  users: Registration[]
  emailIsTrash?: boolean
}

class FakeTrashEmailGateway implements TrashEmailGateway {
  constructor(private readonly _isTrash: boolean) {}

  public async isTrash(_email: string): Promise<boolean> {
    return this._isTrash
  }
}

export function registerSUT(props: RegisterSUTProps = { users: [] }) {
  return {
    withExistingEmail(email: string) {
      return registerSUT({
        ...props,
        users: [
          ...props.users,
          Registration.create(
            new Email(email),
            new Pseudo('pseudo'),
            new HashedPassword('Password_0!')
          ),
        ],
      })
    },
    withExistingPseudo(pseudo: string) {
      return registerSUT({
        ...props,
        users: [
          ...props.users,
          Registration.create(
            new Email('email@example.com'),
            new Pseudo(pseudo),
            new HashedPassword('Password_0!')
          ),
        ],
      })
    },
    considerEmailIsTrash() {
      return registerSUT({
        ...props,
        emailIsTrash: true,
      })
    },
    build() {
      const userGateway = new InMemoryUserGateway(props.users)

      const presenter = new RegisterTestPresenter()

      const eventPublisher = new InMemoryEventPublisher()

      const registrationFactory = new RegistrationFactory(
        new FakePasswordHasher(),
        new FakeTrashEmailGateway(props.emailIsTrash || false),
        userGateway
      )

      const registerUseCase = new Register(userGateway, eventPublisher, registrationFactory)

      const registerUser = (input: RegisterProps) => {
        return registerUseCase.execute(input, presenter)
      }

      return {
        userGateway,
        registerUser,
        getResponse: () => presenter.response,
        getErrors: () => presenter.errors,
        getEvents: () => eventPublisher.events,
      }
    },
  }
}
