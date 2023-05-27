import { DomainEvent } from '@domain/onboarding/events'
import { RegistrationId } from './registration-id'

export class UserRegistered implements DomainEvent {
  public readonly userId: RegistrationId
  public readonly type = 'USER_REGISTERED'
  public readonly occurredAt = new Date()

  constructor(userId) {
    this.userId = userId
  }
}
