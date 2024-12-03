import {  IsOptional, IsString, IsDate } from 'class-validator';  
import { Type } from 'class-transformer';  

export class CreateSupplierDto {  
  @IsOptional()  
  @IsString()  
  name?: string;  

  @IsOptional()  
  @IsString()  
  address?: string;  

  @IsOptional()  
  @IsString()  
  phone?: string;  

  @IsOptional()  
  @IsString()  
  description?: string;  

  @IsOptional()  
  @IsDate()  
  @Type(() => Date)  
  established_date?: Date;  

  @IsOptional()  
  @IsString()  
  business_license?: string;  
}