 import { IsOptional, IsString, IsNumber, IsDateString } from 'class-validator';  

export class UpdatePenjualanDto {  

  @IsOptional()  
  @IsNumber()  
  id_customer?: number;  

  @IsOptional()  
  @IsDateString()  
  tanggal?: Date;  
}  

export class UpdateDetailPenjualanDto {  
  @IsOptional()  
  @IsNumber()  
  id_barang?: number;  

  @IsOptional()  
  @IsNumber()  
  qty?: number;  

  @IsOptional()  
  @IsString()  
  harga_jual?: string;  
}