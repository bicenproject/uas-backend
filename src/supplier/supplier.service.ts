import { Injectable } from '@nestjs/common';  
import { Prisma, Supplier } from '@prisma/client';  
import { PrismaService } from 'src/prisma/prisma.service';  
import { CreateSupplierDto } from './dto/create-supplier.dto';  
import { UpdateSupplierDto } from './dto/update-supplier.dto';  

@Injectable()  
export class SupplierService {  
  constructor(private readonly prismaService: PrismaService) {}  

  async create(createSupplierDto: CreateSupplierDto): Promise<Supplier> {  
    return this.prismaService.supplier.create({  
      data: createSupplierDto,  
    });  
  }  

  async findAll(): Promise<Supplier[]> {  
    return this.prismaService.supplier.findMany({  
      where: { deleted_at: null },  
      orderBy: { created_at: 'desc' }  
    });  
  }  

  async findOne(id: number): Promise<Supplier | null> {  
    return this.prismaService.supplier.findUnique({  
      where: {   
        id,   
        deleted_at: null   
      },  
      include: {  
        Pembelian: true  
      }  
    });  
  }  

  async findOneBy(where: Prisma.SupplierWhereInput): Promise<Supplier | null> {  
    return this.prismaService.supplier.findFirst({   
      where   
    });  
  }  

  async update(id: number, updateSupplierDto: UpdateSupplierDto): Promise<Supplier> {  
    return this.prismaService.supplier.update({  
      where: { id },  
      data: updateSupplierDto,  
    });  
  }  

  async remove(id: number): Promise<Supplier> {  
    return this.prismaService.supplier.update({  
      where: { id },  
      data: {   
        deleted_at: new Date(),  
        name: `${(await this.findOne(id)).name} (deleted at: ${new Date().toISOString()})`,
        address: `${(await this.findOne(id)).address} (deleted at: ${new Date().toISOString()})`,
        phone: `${(await this.findOne(id)).phone} (deleted at: ${new Date().toISOString()})`
      } 
    });  
  }  

  async getAll(): Promise<Supplier[]> {  
    return this.prismaService.supplier.findMany({  
      where: { deleted_at: null }  
    });  
  }  
}