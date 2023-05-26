import { z } from 'zod'

export class Email {
  private email: string

  constructor(email: string) {
    z.string().email('EMAIL_INVALID').parse(email)

    this.email = email
  }

  public value(): string {
    return this.email
  }
}
