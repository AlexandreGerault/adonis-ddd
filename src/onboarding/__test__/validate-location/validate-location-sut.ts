import { ValidateLocation } from '@domain/onboarding/application/validate-location'
import { ValidateLocationTestPresenter } from './validate-location-presenter'
import { FakeIpAddressLookupGateway } from '../fake-ip-lookup'
import { FakeBlacklistCountriesQuery } from '../fake-blacklist-countries'

interface Props {
  invalid: boolean
}

export function validateLocationSUT(props: Props = { invalid: false }) {
  return {
    invalid() {
      return validateLocationSUT({ ...props, invalid: true })
    },
    build() {
      const ipLookupGateway = new FakeIpAddressLookupGateway()
      const blacklistCountriesQuery = new FakeBlacklistCountriesQuery(props.invalid)

      const validateLocation = new ValidateLocation(ipLookupGateway, blacklistCountriesQuery)

      const presenter = new ValidateLocationTestPresenter()

      const input = {
        ipAdress: '123.42.23.124',
      }

      return {
        validateLocation: () => validateLocation.execute(input, presenter),
        getResponse: () => presenter.response,
      }
    },
  }
}
