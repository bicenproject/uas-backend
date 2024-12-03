import { Injectable } from '@nestjs/common';  
import { Customer, Prisma } from '@prisma/client';  
import { PrismaService } from 'src/prisma/prisma.service';  
import { CreateCustomerDto } from './dto/create-customer.dto';

@Injectable()  
export class CustomerService {  
  constructor(private readonly prismaService: PrismaService) {}  

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {  
    return this.prismaService.customer.create({  
      data: createCustomerDto,  
    });  
  }  

  async findAll(): Promise<Customer[]> {  
    return this.prismaService.customer.findMany({  
      where: { deleted_at: null },  
      include: {  
        Penjualan: true, 
      },  
      orderBy: {   
        created_at: 'desc'   
      }  
    });  
  }  

  async findOne(id: number): Promise<Customer | null> {  
    return this.prismaService.customer.findUnique({  
      where: { id },  
      include: {  
      },  
    });  
  }  

  async findOneBy(where: Prisma.CustomerWhereInput): Promise<Customer | null> {  
    return this.prismaService.customer.findFirst({   
      where: {  
        ...where,  
        deleted_at: null 
      },
      include: {  
        Penjualan: true  
      }  
    });  
  }  

  async update(id: number, updateCustomerDto: CreateCustomerDto): Promise<Customer> {  
    return this.prismaService.customer.update({  
      where: { id },  
      data: updateCustomerDto,  
    });  
  }  

  async remove(id: number): Promise<Customer> {  
    const Customer = await this.findOne(id);  
    return this.prismaService.customer.update({  
      where: { id },  
      data: {   
        deleted_at: new Date(),  
        customer_name: `${Customer?.customer_name} (deleted at: ${new Date().toISOString()})`  
      }  
    });  
  }  

  async getAll(): Promise<Customer[]> {  
    return this.prismaService.customer.findMany({  
      where: { deleted_at: null },
      include: {  
        Penjualan: true  
      }    
    });  
  }  
}