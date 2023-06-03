import { BlacklistCountriesQuery } from '../gateways/blacklist-countries-query'
import { IpAddressLookupGateway } from '../gateways/ip-address-lookup-gateway'

export interface ValidateLocationPresenter {
  validated(): void
  invalidated(): void
}

interface ValidateLocationProps {
  ipAdress: string
}

export class ValidateLocation {
  constructor(
    private _ipLookupGateway: IpAddressLookupGateway,
    private _blacklistCountryQuery: BlacklistCountriesQuery
  ) {}

  public async execute(input: ValidateLocationProps, presenter: ValidateLocationPresenter) {
    const { country } = await this._ipLookupGateway.lookup(input.ipAdress)

    if (await this._blacklistCountryQuery.isBlacklisted(country)) {
      presenter.invalidated()
      return
    }

    presenter.validated()
  }
}
