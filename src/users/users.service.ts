import { Injectable, UnprocessableEntityException } from '@nestjs/common';
// DTOS
import { UserAuth } from './dto/users.dto';
// UTILS
import { AuthService } from '../utils/auth.service';
// GRAPHQL
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
// SCHEMAS
import { User } from '../mongodb/schemas/users.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private authService: AuthService,
  ) {}

  async login(login: UserAuth) {
    try {
      // search for the user by email
      const userFound = await this.userModel.findOne({
        email: login.email,
      });

      // if user is not found
      if (!userFound) {
        throw new UnprocessableEntityException('Invalid User or password');
      }

      // compare the password with the hashed password
      const passwordVerified = await this.authService.verifyPassword(
        login.password,
        userFound.password,
      );
      // if password is invalid
      if (!passwordVerified) {
        throw new UnprocessableEntityException('Invalid Email or password');
      }

      // create and return JWT
      return {
        token: this.authService.createUserToken(userFound.id, userFound.email),
      };
    } catch (error) {
      throw new UnprocessableEntityException('Invalid Email or password');
    }
  }

  async register(register: UserAuth) {
    try {
      // hash the password
      const hashedPassword = await this.authService.hashPassword(
        register.password,
      );

      // save the new user in mongoDB
      const newUser = await new this.userModel({
        email: register.email,
        password: hashedPassword,
      }).save();

      // create and return JWT
      return {
        token: this.authService.createUserToken(newUser.id, newUser.email),
      };
    } catch (error) {
      throw new UnprocessableEntityException('Email already exists');
    }
  }
}
