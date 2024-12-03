import { CategoryEntity } from '@backend/category/entities/category.entity';
import { Barang, Customer } from '@prisma/client';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class CustomerEntity implements Customer {
  constructor(partial: Partial<CustomerEntity>) {
    Object.assign(this, partial);
  }

  @Expose()
  id: number;

  @Expose()
  alamat: string;

  @Expose()
  customer_name: string;

  @Expose()
  phone: string;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;

  @Exclude()
  deleted_at: Date | null;
}
