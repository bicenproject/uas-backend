import { IsUnique } from 'src/common/validator/is-unique.validator';
import {
  IsNotEmpty,
  IsString,
  Validate,
} from 'class-validator';
import { RoleType } from '@prisma/client';

export class CreateRoleDto {
  @IsNotEmpty()
  @IsString()
  role: RoleType;

  @IsNotEmpty()
  @IsString()
  @Validate(IsUnique, ['role', 'code', 'Role code already exist.'])
  code: string;
}
