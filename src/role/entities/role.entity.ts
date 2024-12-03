import { akses_user, RoleType } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

export class RoleEntity implements akses_user {
  constructor(partial: Partial<RoleEntity>) {
    Object.assign(this, partial);
  }
  @Expose()
  id_akses: number;
  @Expose()
  role: RoleType;
  @Expose()
  code: string;
  @Exclude()
  created_by: number;
  @Exclude()
  updated_by: number;
  @Exclude()
  created_at: Date;
  @Exclude()
  updated_at: Date;
  @Exclude()
  deleted_at: Date;
}