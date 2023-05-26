import { DomainEvent } from '@domain/onboarding/events'
import { UserId } from './user-id'

export class UserRegistered implements DomainEvent {
  public readonly userId: UserId
  public readonly type = 'USER_REGISTERED'
  public readonly occurredAt = new Date()

  constructor(userId) {
    this.userId = userId
  }
}
