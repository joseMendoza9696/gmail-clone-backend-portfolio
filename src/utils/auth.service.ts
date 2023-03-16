import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async verifyPassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  createUserToken(id: string, email: string): string {
    return this.jwtService.sign({ id, email });
  }

  verifyToken(token: string) {
    try {
      const jwt = this.jwtService.verify(token);
      return jwt;
    } catch (error) {
      return false;
    }
  }
}
