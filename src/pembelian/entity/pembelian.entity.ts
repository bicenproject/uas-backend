 import { Expose, Type } from 'class-transformer';  
import { SupplierEntity } from '@backend/supplier/entities/supplier.entity';  
import { ProductEntity } from '@backend/product/entities/product.entity';

export class PembelianEntity {  
  constructor(partial: Partial<PembelianEntity>) {  
    Object.assign(this, partial);  
  }  

  @Expose()  
  id: number;  

  @Expose()  
  code: string;  

  @Expose()  
  id_supplier: number;  

  @Expose()  
  tanggal_pembelian: Date;  

  @Expose()  
  @Type(() => SupplierEntity)  
  supplier?: SupplierEntity;  

  @Expose()  
  @Type(() => DetailPembelianEntity)  
  DetailPembelian?: DetailPembelianEntity[];  
}  

export class DetailPembelianEntity {  
  @Expose()  
  id: number;  

  @Expose()  
  harga_beli: string;  

  @Expose()  
  id_barang: number;  

  @Expose()  
  id_pembelian: number;  

  @Expose()  
  quantity: number;  

  @Expose()  
  @Type(() => ProductEntity)  
  barang?: ProductEntity;  
}