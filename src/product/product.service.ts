import { Injectable } from '@nestjs/common';  
import { Barang, Prisma } from '@prisma/client';  
import { PrismaService } from 'src/prisma/prisma.service';  
import { CreateProductDto } from './dto/create-product.dto';  
import { UpdateProductDto } from './dto/update-product.dto';  

@Injectable()  
export class ProductService {  
  constructor(private readonly prismaService: PrismaService) {}  

  async create(createProductDto: CreateProductDto): Promise<Barang> {  
    return this.prismaService.barang.create({  
      data: createProductDto,  
    });  
  }  

  async findAll(): Promise<Barang[]> {  
    return this.prismaService.barang.findMany({  
      where: { deleted_at: null },  
      include: {  
        category: true, 
      },  
      orderBy: {   
        created_at: 'desc'   
      }  
    });  
  }  

  async findOne(id: number): Promise<Barang | null> {  
    return this.prismaService.barang.findUnique({  
      where: { id },  
      include: {  
      },  
    });  
  }  

  async findOneBy(where: Prisma.BarangWhereInput): Promise<Barang | null> {  
    return this.prismaService.barang.findFirst({   
      where: {  
        ...where,  
        deleted_at: null 
      },
      include: {  
        category: true  
      }  
    });  
  }  

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Barang> {  
    return this.prismaService.barang.update({  
      where: { id },  
      data: updateProductDto,  
    });  
  }  

  async remove(id: number): Promise<Barang> {  
    const product = await this.findOne(id);  
    return this.prismaService.barang.update({  
      where: { id },  
      data: {   
        deleted_at: new Date(),  
        nama_barang: `${product?.nama_barang} (deleted at: ${new Date().toISOString()})`  
      }  
    });  
  }  

  async getAll(): Promise<Barang[]> {  
    return this.prismaService.barang.findMany({  
      where: { deleted_at: null },
      include: {  
        category: true  
      }    
    });  
  }  
}