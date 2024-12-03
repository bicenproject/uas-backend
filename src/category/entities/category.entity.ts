import { ProductEntity } from '@backend/product/entities/product.entity';
import { Category } from '@prisma/client';  
import { Exclude, Expose, Type } from 'class-transformer';  

export class CategoryEntity implements Category {  
  constructor(partial: Partial<CategoryEntity>) {  
    Object.assign(this, partial);  
  }  

  @Expose()  
  id: number;  

  @Expose()  
  name: string;  

  @Expose()  
  description: string | null;  

  @Exclude()  
  created_at: Date;  

  @Exclude()  
  updated_at: Date;  

  @Exclude()  
  deleted_at: Date | null;  

  @Expose()  
  @Type(() => ProductEntity)  
  Barang?: ProductEntity[];  
}  