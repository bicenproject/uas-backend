import { PartialType } from '@nestjs/mapped-types';  
import { CreateCategoryDto } from './create-category.dto';  
import { IsOptional, IsString, Validate } from 'class-validator';  
import { IsUnique } from 'src/common/validator/is-unique.validator';  

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {  
  @IsOptional()  
  @IsString()  
  @Validate(IsUnique, ['category', 'name', 'Category name already exists.'])  
  name?: string;  

  @IsOptional()  
  @IsString()  
  description?: string;  
}