import { PartialType } from '@nestjs/mapped-types';  
import { IsDate, IsOptional, IsString } from 'class-validator';  
import { Type } from 'class-transformer';
import { CreateSupplierDto } from './create-supplier.dto';

export class UpdateSupplierDto extends PartialType(CreateSupplierDto) {  
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