import { IsNotEmpty, IsOptional, IsString, Validate } from 'class-validator';  
import { IsUnique } from 'src/common/validator/is-unique.validator';  

export class CreateCategoryDto {  
  @IsNotEmpty()  
  @IsString()  
  @Validate(IsUnique, ['category', 'name', 'Category name already exists.'])  
  name: string;  

  @IsOptional()  
  @IsString()  
  description?: string;  
}