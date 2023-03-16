import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class EmailCreate {
  @IsNotEmpty()
  @IsEmail()
  to: string;

  @IsNotEmpty()
  @IsString()
  body: string;

  @IsNotEmpty()
  @IsString()
  subject: string;
}

export class DecodedToken {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}
