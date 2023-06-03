import { PasswordHasher } from '../gateways/password-hasher'
import { PlainPassword } from '../entities/registration/plain-password'
import { HashedPassword } from '../entities/registration/hashed-password'

export class FakePasswordHasher implements PasswordHasher {
  public async hash(password: PlainPassword): Promise<HashedPassword> {
    return new HashedPassword(password.value())
  }
}
