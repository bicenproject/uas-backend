import { CategoryEntity } from '@backend/category/entities/category.entity';
import { Barang } from '@prisma/client';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class ProductEntity implements Barang {
  constructor(partial: Partial<ProductEntity>) {
    Object.assign(this, partial);
  }

  @Expose()
  id: number;

  @Expose()
  image: string | null;

  @Expose()
  nama_barang: string;

  @Expose()
  category_id: number;

  @Expose()
  harga_beli: string;

  @Expose()
  harga_jual: string;

  @Expose()
  stock: number | null;

  @Expose()
  @Type(() => CategoryEntity)
  category?: CategoryEntity;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;

  @Exclude()
  deleted_at: Date | null;
}
