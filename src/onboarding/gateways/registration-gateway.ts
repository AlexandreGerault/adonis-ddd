import { Registration } from '@domain/onboarding/entities/registration'

export interface RegistrationGateway {
  pseudoExists(pseudo: string): Promise<boolean>
  emailExists(email: string): Promise<boolean>
  save(user: Registration): Promise<void>
}
