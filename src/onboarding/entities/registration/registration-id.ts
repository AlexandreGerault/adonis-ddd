import { randomUUID } from 'crypto'

export class RegistrationId {
  public readonly value: string

  constructor(value: string) {
    this.value = value
  }

  public static create(value: string): RegistrationId {
    return new RegistrationId(value)
  }

  public static generate(): RegistrationId {
    return new RegistrationId(randomUUID())
  }
}
