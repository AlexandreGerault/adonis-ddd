import { test } from '@japa/runner'
import { validateLocationSUT } from './validate-location-sut'

test.group('Onboarding / ValidateLocation', () => {
  test('it validates a location', async ({ assert }) => {
    const { getResponse, validateLocation } = validateLocationSUT().build()

    await validateLocation()

    assert.equal(getResponse(), 'VALIDATED')
  })

  test('it invalidates a location', async ({ assert }) => {
    const { getResponse, validateLocation } = validateLocationSUT().invalid().build()

    await validateLocation()

    assert.equal(getResponse(), 'INVALIDATED')
  })
})
