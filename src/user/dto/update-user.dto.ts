import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, ValidateIf } from 'class-validator';
import { Match } from 'src/common/validator/match.validator';

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, [
    'email',
    'password',
    'password_confirmation',
  ] as const),
) {
  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsNumber()
  akses_user_id: number;

  @IsOptional()
  dob: Date;

  @IsOptional()
  password: string;

  @IsNotEmpty()
  @Match('password', { message: "Password confirmation doesn't match" })
  @ValidateIf((obj) => obj.hasOwnProperty('password'))
  password_confirmation: number;
}
