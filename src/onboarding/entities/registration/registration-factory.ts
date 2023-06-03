import { PasswordHasher } from '@domain/onboarding/gateways/password-hasher'
import { Registration } from './registration'
import { PlainPassword } from './plain-password'
import { Email } from './email'
import { Pseudo } from './pseudo'
import { TrashEmailGateway } from '@domain/onboarding/gateways/tash-email-gateway'
import { RegistrationGateway } from '@domain/onboarding/gateways'
import { RegistrationError } from './registration-error'
import { RegistrationException } from './registration-exception'
import { z } from 'zod'

export class RegistrationFactory {
  constructor(
    private readonly _passwordHasher: PasswordHasher,
    private readonly trashEmail: TrashEmailGateway,
    private readonly userGateway: RegistrationGateway
  ) {}

  public async create(email: string, pseudo: string, password: string): Promise<Registration> {
    const errors = [] as RegistrationError[]

    if (await this.userGateway.emailExists(email)) {
      errors.push({ code: 'EMAIL_ALREADY_IN_USE' })
    }

    if (await this.userGateway.pseudoExists(pseudo)) {
      errors.push({ code: 'PSEUDO_ALREADY_IN_USE' })
    }

    if (await this.trashEmail.isTrash(email)) {
      errors.push({ code: 'EMAIL_IS_TRASH' })
    }

    if (errors.length > 0) {
      throw new RegistrationException('Registration failed', errors)
    }

    try {
      const hashedPassword = await this._passwordHasher.hash(new PlainPassword(password))
      return Registration.create(new Email(email), new Pseudo(pseudo), hashedPassword)
    } catch (error) {
      if (!(error instanceof z.ZodError)) {
        throw error
      }

      throw new RegistrationException(
        'INVALID_USER',
        error.issues.map((issue) => ({
          code: issue.message,
        }))
      )
    }
  }
}
