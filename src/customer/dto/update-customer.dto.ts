import { IsOptional, IsString } from 'class-validator';  

export class UpdateCustomerDto {  
  @IsOptional()  
  @IsString()  
  alamat: string;  

  @IsOptional()  
  @IsString()  
  customer_name: string;  
  
  @IsOptional()  
  @IsString()  
  phone: string;   

}