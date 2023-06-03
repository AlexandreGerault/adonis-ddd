export interface BlacklistCountriesQuery {
  isBlacklisted(country: string): Promise<boolean>
}
