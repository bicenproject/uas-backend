import { User } from '@prisma/client';
import { transformEntity } from 'src/common/transformer/entity.transformer';
import { RoleEntity } from 'src/role/entities/role.entity';
import { Exclude, Expose, Transform } from 'class-transformer';

export class UserEntity implements User {
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
  @Expose()
  id: number;
  @Expose()
  akses_user_id: number;
  @Expose()
  name: string;
  @Expose()
  email: string;
  @Exclude()
  password: string;
  @Exclude()
  supplier_id: number;
  @Exclude()
  warehouse_id: number;
  @Expose()
  dob: Date;
  @Expose()
  phone: string;
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

  @Expose()
  @Transform(({ value }) => transformEntity(RoleEntity, value))
  role: RoleEntity;
}
