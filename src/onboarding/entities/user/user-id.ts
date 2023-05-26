import { randomUUID } from 'crypto'

export class UserId {
  public readonly value: string

  constructor(value: string) {
    this.value = value
  }

  public static create(value: string): UserId {
    return new UserId(value)
  }

  public static generate(): UserId {
    return new UserId(randomUUID())
  }
}
