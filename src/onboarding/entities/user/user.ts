import { UserException } from './user-exception'
import { z } from 'zod'

import { Email } from './email'
import { Pseudo } from './pseudo'
import { Password } from './password'
import { DomainEvent } from '@domain/onboarding/events'
import { UserId } from './user-id'
import { UserRegistered } from './user-registered'

export class User {
  public readonly email: Email
  public readonly pseudo: Pseudo
  public readonly password: Password
  public readonly userId: UserId
  private readonly _domainEvents: DomainEvent[] = []

  constructor(userId: UserId, email: Email, pseudo: Pseudo, password: Password) {
    this.userId = userId
    this.email = email
    this.pseudo = pseudo
    this.password = password
  }

  public static create(email: string, pseudo: string, password: string): User {
    try {
      const user = new User(
        UserId.generate(),
        new Email(email),
        new Pseudo(pseudo),
        new Password(password)
      )

      user.emit(new UserRegistered(user.userId))

      return user
    } catch (error) {
      if (!(error instanceof z.ZodError)) {
        throw error
      }

      throw new UserException(
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
