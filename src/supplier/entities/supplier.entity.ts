import { Supplier } from '@prisma/client';  
import { Exclude, Expose } from 'class-transformer';  

export class SupplierEntity implements Supplier {  
  constructor(partial: Partial<SupplierEntity>) {  
    Object.assign(this, partial);  
  }  

  @Expose()  
  id: number;  

  @Expose()  
  name: string | null;  

  @Expose()  
  address: string | null;  

  @Expose()  
  phone: string | null;  

  @Expose()  
  description: string | null;  

  @Expose()  
  established_date: Date | null;  

  @Expose()  
  business_license: string | null;  

  @Exclude()  
  created_at: Date;  

  @Exclude()  
  updated_at: Date;  

  @Exclude()  
  deleted_at: Date | null;  
}