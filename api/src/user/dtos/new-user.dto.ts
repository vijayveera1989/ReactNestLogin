import { IsEmail, IsNotEmpty, MinLength,Matches } from 'class-validator';

export class NewUserDTO {
  @IsNotEmpty()
  name: string;
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message: 'Password must be at least 8 characters long, contain at least one letter, one number, and one special character.',
  })
  password: string;
}
