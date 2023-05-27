import { z } from 'zod'

export class Pseudo {
  private pseudo: string

  constructor(pseudo: string) {
    z.string()
      .regex(/^[a-zA-Z0-9\-\_]{5,20}$/, 'PSEUDO_INVALID_CHARACTERS')
      .parse(pseudo)
    this.pseudo = pseudo
  }

  public value(): string {
    return this.pseudo
  }
}
