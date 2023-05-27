import { RegistrationGateway } from '@domain/onboarding/gateways'
import { Registration } from '@domain/onboarding/entities/registration'

class InMemoryUserGateway implements RegistrationGateway {
  private _users: Registration[] = []

  constructor(users: Registration[] = []) {
    this._users = users
  }

  public pseudoExists(pseudo: string): Promise<boolean> {
    return Promise.resolve(this._users.some((user) => user.pseudo.value() === pseudo))
  }

  public async save(user: Registration) {
    this._users.push(user)
  }

  public emailExists(email: string): Promise<boolean> {
    return Promise.resolve(this._users.some((user) => user.email.value() === email))
  }

  public count() {
    return this._users.length
  }
}

export { InMemoryUserGateway }
