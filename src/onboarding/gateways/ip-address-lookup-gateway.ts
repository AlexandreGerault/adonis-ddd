interface IpAddressLookupResponse {
  country: string
  countryCode: string
}

export interface IpAddressLookupGateway {
  lookup(ipAddress: string): Promise<IpAddressLookupResponse>
}
