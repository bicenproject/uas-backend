import { IsNotEmpty, IsOptional, IsString, IsNumber, Validate } from 'class-validator';  
import { IsUnique } from 'src/common/validator/is-unique.validator';  

export class CreateProductDto {  
  @IsNotEmpty()  
  @IsString()  
  nama_barang: string;  

  @IsOptional()  
  @IsString()  
  image?: string;  
  
  @IsNotEmpty()  
  @IsNumber()  
  category_id: number;  

  @IsNotEmpty()  
  @IsString()  
  harga_beli: string;  

  @IsNotEmpty()  
  @IsString()  
  harga_jual: string;

  @IsNotEmpty()  
  @IsNumber()  
  stock: number;  

}