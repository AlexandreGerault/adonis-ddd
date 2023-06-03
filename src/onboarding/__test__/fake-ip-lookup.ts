import { IpAddressLookupGateway } from '../gateways/ip-address-lookup-gateway'

export class FakeIpAddressLookupGateway implements IpAddressLookupGateway {
  public async lookup(_ipAddress) {
    return {
      country: 'Brazil',
      countryCode: 'BR',
    }
  }
}
