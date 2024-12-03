 import { IsNotEmpty, IsString, IsNumber, IsDateString } from 'class-validator';  

export class CreatePembelianDto {  

  @IsNotEmpty()  
  @IsNumber()  
  id_supplier: number;  

  @IsNotEmpty()  
  @IsDateString()  
  tanggal_pembelian: Date;  

  @IsNotEmpty()  
  details: CreateDetailPembelianDto[];  
}  

export class CreateDetailPembelianDto {  
  @IsNotEmpty()  
  @IsString()  
  harga_beli: string;  

  @IsNotEmpty()  
  @IsNumber()  
  id_barang: number;  

  @IsNotEmpty()  
  @IsNumber()  
  quantity: number;  
}