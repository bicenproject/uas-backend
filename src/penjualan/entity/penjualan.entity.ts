// src/penjualan/entities/penjualan.entity.ts  
import { Expose, Type } from 'class-transformer';  
 import { ProductEntity } from '../../product/entities/product.entity';  
import { CustomerEntity } from '@backend/customer/entity/product.entity';

export class DetailPenjualanEntity {  
  @Expose()  
  id: number;  

  @Expose()  
  id_barang: number;  

  @Expose()  
  id_penjualan: number;  

  @Expose()  
  qty: number;  

  @Expose()  
  harga_jual: string;  

  @Expose()  
  @Type(() => ProductEntity)  
  barang?: ProductEntity;  
}  

export class PenjualanEntity {  
  constructor(partial: Partial<PenjualanEntity>) {  
    Object.assign(this, partial);  
  }  

  @Expose()  
  id: number;  

  @Expose()  
  code: string;  

  @Expose()  
  id_customer: number;  

  @Expose()  
  tanggal: Date;  

  @Expose()  
  @Type(() => CustomerEntity)  
  customer?: CustomerEntity;  

  @Expose()  
  @Type(() => DetailPenjualanEntity)  
  DetailPenjualan?: DetailPenjualanEntity[];  
}