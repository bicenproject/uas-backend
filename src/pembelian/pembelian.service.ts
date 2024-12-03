// src/pembelian/pembelian.service.ts  
import { Injectable } from '@nestjs/common';  
import { PrismaService } from '../prisma/prisma.service';  
import { CreatePembelianDto } from './dto/create-pembelian.dto';  
import { UpdatePembelianDto } from './dto/update-pembelian.dto';  

@Injectable()  
export class PembelianService {  
  constructor(private readonly prisma: PrismaService) {}  

  private async generatePembelianCode(): Promise<string> {  
    const today = new Date();  
    const day = String(today.getDate()).padStart(2, '0');  
    const month = String(today.getMonth() + 1).padStart(2, '0');  
    const year = String(today.getFullYear());  

    // Ambil pembelian terakhir pada hari ini  
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));  
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));  

    const lastPembelian = await this.prisma.pembelian.findFirst({  
      where: {  
        tanggal_pembelian: {  
          gte: startOfDay,  
          lte: endOfDay,  
        },  
      },  
      orderBy: {  
        code: 'desc',  
      },  
    });  

    let sequence = '0001';  
    if (lastPembelian) {  
      const lastSequence = parseInt(lastPembelian.code.slice(-2));  
      sequence = String(lastSequence + 1).padStart(4, '0');  
    }  

    return `PMB-${day}${month}${year}${sequence}`;  
  }  

  async create(createPembelianDto: CreatePembelianDto) {  
    const { details, ...pembelianData } = createPembelianDto;  
    const code = await this.generatePembelianCode();  
  
    return this.prisma.$transaction(async (prisma) => {  
       const pembelian = await prisma.pembelian.create({  
        data: {  
          ...pembelianData,  
          code,  
          DetailPembelian: {  
            create: details.map(detail => ({  
              id_barang: detail.id_barang,  
              quantity: Number(detail.quantity),  
              harga_beli: detail.harga_beli  
            }))  
          }  
        },  
        include: {  
          supplier: true,  
          DetailPembelian: {  
            include: {  
              barang: true  
            }  
          }  
        }  
      });  
  
       for (const detail of details) {  
        await prisma.barang.update({  
          where: { id: detail.id_barang },  
          data: {  
            stock: {  
              increment: Number(detail.quantity)  
            },  
          }  
        });  
      }  
  
      return pembelian;  
    });  
  }

  async findAll() {  
    return this.prisma.pembelian.findMany({  
      include: {  
        supplier: true,  
        DetailPembelian: {  
          include: {  
            barang: true  
          }  
        }  
      }  
    });  
  }  

  async findOne(id: number) {  
    return this.prisma.pembelian.findUnique({  
      where: { id },  
      include: {  
        supplier: true,  
        DetailPembelian: {  
          include: {  
            barang: true  
          }  
        }  
      }  
    });  
  }  

  async update(id: number, updatePembelianDto: UpdatePembelianDto) {  
    return this.prisma.pembelian.update({  
      where: { id },  
      data: updatePembelianDto,  
      include: {  
        supplier: true,  
        DetailPembelian: true  
      }  
    });  
  }  

  async remove(id: number) {  
    await this.prisma.detailPembelian.deleteMany({  
      where: { id_pembelian: id }  
    });  
    
    return this.prisma.pembelian.delete({  
      where: { id }  
    });  
  }  
}