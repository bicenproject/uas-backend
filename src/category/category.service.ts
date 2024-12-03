import { Injectable, BadRequestException } from '@nestjs/common';  
import { Prisma, Category } from '@prisma/client';  
import { PrismaService } from 'src/prisma/prisma.service';  
import { CreateCategoryDto } from './dto/create-category.dto';  
import { UpdateCategoryDto } from './dto/update-category.dto';  

@Injectable()  
export class CategoryService {  
  constructor(private readonly prismaService: PrismaService) {}  

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {  
    try {  
      return this.prismaService.category.create({  
        data: createCategoryDto,  
      });  
    } catch (error) {  
      throw new BadRequestException(`Failed to create category: ${error.message}`);  
    }  
  }  

  async findAll(): Promise<Category[]> {  
    return this.prismaService.category.findMany({  
      where: { deleted_at: null },  
      orderBy: { created_at: 'desc' }  
    });  
  }  

  async findOne(id: number): Promise<Category | null> {  
    return this.prismaService.category.findUnique({  
      where: {   
        id,   
        deleted_at: null   
      },  
      include: {  
        Barang: true  
      }  
    });  
  }  

  async findOneBy(where: Prisma.CategoryWhereInput): Promise<Category | null> {  
    return this.prismaService.category.findFirst({   
      where: {  
        ...where,  
        deleted_at: null  
      }  
    });  
  }  

  async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category> {  
    try {  
      return this.prismaService.category.update({  
        where: { id },  
        data: updateCategoryDto,  
      });  
    } catch (error) {  
      throw new BadRequestException(`Failed to update category: ${error.message}`);  
    }  
  }  

  async remove(id: number): Promise<Category> {  
    try {  
      const category = await this.findOne(id);  
      
      if (!category) {  
        throw new BadRequestException('Category not found');  
      }  

      return this.prismaService.category.update({  
        where: { id },  
        data: {   
          deleted_at: new Date(),  
          name: `${category.name} (deleted at: ${new Date().toISOString()})`  
        }  
      });  
    } catch (error) {  
      throw new BadRequestException(`Failed to delete category: ${error.message}`);  
    }  
  }  

  async getAll(): Promise<Category[]> {  
    return this.prismaService.category.findMany({  
      where: { deleted_at: null }  
    });  
  }  
}