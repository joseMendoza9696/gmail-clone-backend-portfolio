import { Args, Resolver, Mutation } from '@nestjs/graphql';
// DTO
import { UserAuth } from './dto/users.dto';
import { UsersService } from './users.service';

@Resolver('Users')
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  // MUTATION
  @Mutation('USER_login')
  async login(@Args('login') login: UserAuth) {
    return this.usersService.login(login);
  }

  @Mutation('USER_register')
  async register(@Args('register') register: UserAuth) {
    return this.usersService.register(register);
  }
}
