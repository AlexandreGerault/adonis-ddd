import { User } from '@domain/onboarding/entities/user'

export interface UserGateway {
  pseudoExists(pseudo: string): Promise<boolean>
  emailExists(email: string): Promise<boolean>
  save(user: User): Promise<void>
}
