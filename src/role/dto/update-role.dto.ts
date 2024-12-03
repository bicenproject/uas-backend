import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateRoleDto } from './create-role.dto';
import { IsOptional, IsString, Validate } from 'class-validator';
import { RoleType } from '@prisma/client';

export class UpdateRoleDto extends PartialType(
  OmitType(CreateRoleDto, ['code'] as const),
) {
  @IsOptional()
  @IsString()
  role: RoleType;

  @IsOptional()
  @IsString()
  code: string;
}
