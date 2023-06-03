export class FakeBlacklistCountriesQuery {
  constructor(private _isBlacklisted: boolean = false) {}

  public async isBlacklisted(_country: string): Promise<boolean> {
    return this._isBlacklisted
  }
}
