 import { IsOptional, IsString, IsNumber, IsDateString } from 'class-validator';  

export class UpdatePembelianDto {  

  @IsOptional()  
  @IsNumber()  
  id_supplier?: number;  

  @IsOptional()  
  @IsDateString()  
  tanggal_pembelian?: Date;  
}  

export class UpdateDetailPembelianDto {  
  @IsOptional()  
  @IsString()  
  harga_beli?: string;  

  @IsOptional()  
  @IsNumber()  
  id_barang?: number;  

  @IsOptional()  
  @IsNumber()  
  quantity?: number;  
}