import { PartialType } from '@nestjs/mapped-types';  
import { IsOptional, IsString, IsNumber } from 'class-validator';  
import { ProductEntity } from '../entities/product.entity';  

export class UpdateProductDto {  
  @IsOptional()  
  @IsString()  
  nama_barang?: string;  

  @IsOptional()  
  @IsString()  
  image?: string;  
  
  @IsOptional()  
  @IsNumber()  
  category_id?: number;  

  @IsOptional()  
  @IsString()  
  harga_beli?: string;  

  @IsOptional()  
  @IsString()  
  harga_jual?: string;  

  @IsOptional()  
  @IsNumber()  
  stock?: number;  
}