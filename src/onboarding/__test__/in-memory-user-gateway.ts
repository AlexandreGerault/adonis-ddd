import { UserGateway } from '@domain/onboarding/gateways'
import { User } from '@domain/onboarding/entities/user'

class InMemoryUserGateway implements UserGateway {
  private _users: User[] = []

  constructor(users: User[] = []) {
    this._users = users
  }

  public pseudoExists(pseudo: string): Promise<boolean> {
    return Promise.resolve(this._users.some((user) => user.pseudo.value() === pseudo))
  }

  public async save(user: User) {
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
