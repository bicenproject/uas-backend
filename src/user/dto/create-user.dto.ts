import { IsUnique } from 'src/common/validator/is-unique.validator';
import { Match } from 'src/common/validator/match.validator';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Validate,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @Transform(({ value }) => value && parseInt(value))
  @IsNumber()
  akses_user_id: number;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @Validate(IsUnique, ['user', 'email', 'Email already exist.'])
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @Match('password', { message: "Password confirmation doesn't match" })
  password_confirmation: number;

  @IsOptional()
  @IsDateString()
  @Transform(({ value }) => (!!value ? new Date(value).toISOString() : value))
  dob: Date;

  @IsOptional()
  phone: string;
}
