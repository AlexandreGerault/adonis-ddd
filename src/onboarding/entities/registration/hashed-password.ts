export class HashedPassword {
  private password: string

  constructor(password: string) {
    this.password = password
  }

  public value(): string {
    return this.password
  }
}
