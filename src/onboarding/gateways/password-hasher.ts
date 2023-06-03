import { HashedPassword } from '../entities/registration/hashed-password'
import { PlainPassword } from '../entities/registration/plain-password'

export interface PasswordHasher {
  hash(password: PlainPassword): Promise<HashedPassword>
}
