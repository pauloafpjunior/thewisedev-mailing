import { UserData } from '../../domain/user-data'
import { UserRepository } from '../ports/user-repository'
import { InMemoryUserRepository } from '../../adapters/repositories/in-memory/in-memory-user-repository'
import { RegisterUserOnMailingList } from './register-user-on-mailing-list'
import { InvalidNameError } from '../../domain/errors/invalid-name'
import { InvalidEmailError } from '../../domain/errors/invalid-email'
import { ExistingUserError } from '../errors/existing-user-error'

describe('Register user on mailing list use case', () => {
  test('should register new user on mailing list with complete data', async () => {
    const name = 'any_name'
    const email = 'any_email@mail.com'
    var users: UserData[] = []
    const repo: UserRepository = new InMemoryUserRepository(users)
    const sut = new RegisterUserOnMailingList(repo)
    const response = await sut.registerUserOnMailingList({ name, email })
    const user = repo.findUserByEmail(email)
    expect((await user).email).toEqual('any_email@mail.com')
    expect(response.isRight()).toBeTruthy()
  })

  test('should not register new user with empty name', async () => {
    const name = ''
    const email = 'any_email@mail.com'
    var users: UserData[] = []
    const repo: UserRepository = new InMemoryUserRepository(users)
    const sut = new RegisterUserOnMailingList(repo)
    const error = await sut.registerUserOnMailingList({ name, email })
    expect(error.value).toEqual(new InvalidNameError(name))
    expect(error.isLeft()).toBeTruthy()
  })

  test('should not register new user with invalid name', async () => {
    const name = 'O'
    const email = 'any_email@mail.com'
    var users: UserData[] = []
    const repo: UserRepository = new InMemoryUserRepository(users)
    const sut = new RegisterUserOnMailingList(repo)
    const error = await sut.registerUserOnMailingList({ name, email })
    expect(error.value).toEqual(new InvalidNameError(name))
  })

  test('should not register new user with empty email', async () => {
    const name = 'any_name'
    const email = ''
    var users: UserData[] = []
    const repo: UserRepository = new InMemoryUserRepository(users)
    const sut = new RegisterUserOnMailingList(repo)
    const error = await sut.registerUserOnMailingList({ name, email })
    expect(error.value).toEqual(new InvalidEmailError(email))
  })

  test('should not register new user with undefined email', async () => {
    const name = 'any_name'
    let email: string
    var users: UserData[] = []
    const repo: UserRepository = new InMemoryUserRepository(users)
    const sut = new RegisterUserOnMailingList(repo)
    const error = await sut.registerUserOnMailingList({ name, email })
    expect(error.value).toEqual(new InvalidEmailError(email))
  })

  test('should not register existing user on mailing list', async () => {
    const name = 'any_name'
    const email = 'any_email@mail.com'
    const users: UserData[] = [{ name, email }]
    const repo: UserRepository = new InMemoryUserRepository(users)
    const sut = new RegisterUserOnMailingList(repo)
    const error = await sut.registerUserOnMailingList({ name, email })
    expect(error.value).toBeInstanceOf(ExistingUserError)
  })
})
