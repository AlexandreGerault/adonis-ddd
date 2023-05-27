import { RegistrationException } from './registration-exception'
import { z } from 'zod'

import { Email } from './email'
import { Pseudo } from './pseudo'
import { PlainPassword } from './password'
import { DomainEvent } from '@domain/onboarding/events'
import { RegistrationId } from './registration-id'
import { UserRegistered } from './user-registered'

export class Registration {
  public readonly email: Email
  public readonly pseudo: Pseudo
  public readonly password: PlainPassword
  public readonly userId: RegistrationId
  private readonly _domainEvents: DomainEvent[] = []

  constructor(userId: RegistrationId, email: Email, pseudo: Pseudo, password: PlainPassword) {
    this.userId = userId
    this.email = email
    this.pseudo = pseudo
    this.password = password
  }

  public static create(email: string, pseudo: string, password: string): Registration {
    try {
      const user = new Registration(
        RegistrationId.generate(),
        new Email(email),
        new Pseudo(pseudo),
        new PlainPassword(password)
      )

      user.emit(new UserRegistered(user.userId))

      return user
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

  public domainEvents(): DomainEvent[] {
    return this._domainEvents
  }

  private emit(event: DomainEvent): void {
    this._domainEvents.push(event)
  }
}
