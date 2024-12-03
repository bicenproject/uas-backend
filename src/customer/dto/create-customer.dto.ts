import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';  

export class CreateCustomerDto {  
  @IsNotEmpty()  
  @IsString()  
  alamat: string;  

  @IsNotEmpty()  
  @IsString()  
  customer_name: string;  
  
  @IsNotEmpty()  
  @IsString()  
  phone: string;   

}