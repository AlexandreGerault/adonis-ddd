import { EventPublisher } from '../event-publisher'
import { DomainEvent } from '../events'

export class InMemoryEventPublisher implements EventPublisher {
  public events: DomainEvent[] = []

  public publish(events: DomainEvent | DomainEvent[]): void {
    if (Array.isArray(events)) {
      this.events.push(...events)
      return
    }

    this.events.push(events)
  }
}
