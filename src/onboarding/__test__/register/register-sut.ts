import { Register, RegisterProps } from '@domain/onboarding/application/register'
import { InMemoryUserGateway } from '@domain/onboarding/__test__/in-memory-user-gateway'
import { User } from '@domain/onboarding/entities/user'
import { RegisterTestPresenter } from './register-presenter'
import { TrashEmailGateway } from '@domain/onboarding/gateways/tash-email-gateway'
import { InMemoryEventPublisher } from '../in-memory-event-publisher'

interface RegisterSUTProps {
  users: User[]
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
        users: [...props.users, User.create(email, 'pseudo', 'Password_0!')],
      })
    },
    withExistingPseudo(pseudo: string) {
      return registerSUT({
        ...props,
        users: [...props.users, User.create('email@example.com', pseudo, 'Password_0!')],
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

      const registerUseCase = new Register(
        userGateway,
        new FakeTrashEmailGateway(props.emailIsTrash || false),
        eventPublisher
      )

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
