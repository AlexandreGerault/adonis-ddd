import { RegistrationException } from './registration-exception'
import { z } from 'zod'

import { Email } from './email'
import { Pseudo } from './pseudo'
import { DomainEvent } from '@domain/onboarding/events'
import { RegistrationId } from './registration-id'
import { UserRegistered } from './user-registered'
import { HashedPassword } from './hashed-password'

export class Registration {
  public readonly email: Email
  public readonly pseudo: Pseudo
  public readonly password: HashedPassword
  public readonly userId: RegistrationId
  private readonly _domainEvents: DomainEvent[] = []

  constructor(userId: RegistrationId, email: Email, pseudo: Pseudo, password: HashedPassword) {
    this.userId = userId
    this.email = email
    this.pseudo = pseudo
    this.password = password
  }

  public static create(email: Email, pseudo: Pseudo, password: HashedPassword): Registration {
    try {
      const user = new Registration(RegistrationId.generate(), email, pseudo, password)

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
