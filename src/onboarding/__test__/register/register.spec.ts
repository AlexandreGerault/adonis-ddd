import { test } from '@japa/runner'
import { registerSUT } from './register-sut'
import { UserRegistered } from '@domain/onboarding/entities/registration/user-registered'

test.group('Onboarding / Register', () => {
  test('it registers a user', async ({ assert }) => {
    const { registerUser, userGateway, getResponse, getEvents } = registerSUT().build()

    await registerUser({
      email: 'email@domain.com',
      password: 'Password_0!',
      pseudo: 'pseudo',
    })

    assert.equal(userGateway.count(), 1)
    assert.equal(getResponse(), 'User created')
    assert.lengthOf(getEvents(), 1)
    assert.instanceOf(getEvents()[0], UserRegistered)
  })

  test('it cannot register a user with an existing email', async ({ assert }) => {
    const { registerUser, userGateway, getResponse } = registerSUT()
      .withExistingEmail('already@used.com')
      .build()

    await registerUser({
      email: 'already@used.com',
      password: 'Password_0!',
      pseudo: 'pseudo',
    })

    assert.equal(userGateway.count(), 1)
    assert.equal(getResponse(), 'Validation failed')
  })

  test('it cannot register a user with an existing pseudo', async ({ assert }) => {
    const { registerUser, userGateway, getResponse } = registerSUT()
      .withExistingPseudo('already-used')
      .build()

    await registerUser({
      email: 'new-email@example.com',
      pseudo: 'already-used',
      password: 'Password_0!',
    })

    assert.equal(userGateway.count(), 1)
    assert.equal(getResponse(), 'Validation failed')
  })

  test('it validates business rules when registering a user')
    .with([
      {
        email: 'emailexample.com',
        pseudo: 'pseudo',
        password: 'Password0!',
        errorMessage: 'EMAIL_INVALID',
      },
      {
        email: 'email@example.com',
        pseudo: 'pseu',
        password: 'Password0!',
        errorMessage: 'PSEUDO_INVALID_CHARACTERS',
      },
      {
        email: 'email@example.com',
        pseudo: 'PSEUDO_TOO_LONG_FOR_VALIDATION',
        password: 'Password_0!',
        errorMessage: 'PSEUDO_INVALID_CHARACTERS',
      },
      {
        email: 'email@example.com',
        pseudo: 'Cinquième',
        password: 'Password_0!',
        errorMessage: 'PSEUDO_INVALID_CHARACTERS',
      },
      {
        email: 'email@example.com',
        pseudo: 'pseudo',
        password: 'password',
        errorMessage: 'PASSWORD_INVALID_CHARACTERS',
      },
    ])
    .run(async ({ assert }, { email, pseudo, password, errorMessage }) => {
      const { registerUser, userGateway, getErrors } = registerSUT().build()

      await registerUser({
        email,
        pseudo,
        password,
      })

      assert.equal(userGateway.count(), 0)
      assert.lengthOf(getErrors(), 1)
      assert.containsSubset(getErrors(), [
        {
          code: errorMessage,
        },
      ])
    })

  test('it checks if the email is not a trash email', async ({ assert }) => {
    const { registerUser, userGateway, getResponse } = registerSUT().considerEmailIsTrash().build()

    await registerUser({
      email: 'new-email@example.com',
      pseudo: 'already-used',
      password: 'Password_0!',
    })

    assert.equal(userGateway.count(), 0)
    assert.equal(getResponse(), 'Validation failed')
  })
})
