import { z } from 'zod'

export class PlainPassword {
  private password: string

  constructor(password: string) {
    z.string()
      .regex(
        /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,}$/,
        'PASSWORD_INVALID_CHARACTERS'
      )
      .parse(password)
    this.password = password
  }

  public value(): string {
    return this.password
  }
}
