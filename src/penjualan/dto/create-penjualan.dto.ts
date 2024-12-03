 import { IsNotEmpty, IsString, IsNumber, IsDateString, ValidateNested, IsArray } from 'class-validator';  
import { Type } from 'class-transformer';  

export class CreateDetailPenjualanDto {  
  @IsNotEmpty()  
  @IsNumber()  
  id_barang: number;  

  @IsNotEmpty()  
  @IsNumber()  
  qty: number;  

  @IsNotEmpty()  
  @IsString()  
  harga_jual: string;  
}  

export class CreatePenjualanDto {  

  @IsNotEmpty()  
  @IsNumber()  
  id_customer: number;  

  @IsNotEmpty()  
  @IsDateString()  
  tanggal: Date;  

  @IsArray()  
  @ValidateNested({ each: true })  
  @Type(() => CreateDetailPenjualanDto)  
  details: CreateDetailPenjualanDto[];  
}