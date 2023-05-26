import { DomainEvent } from './events'

export interface EventPublisher {
  publish(events: DomainEvent | DomainEvent[]): void
}
