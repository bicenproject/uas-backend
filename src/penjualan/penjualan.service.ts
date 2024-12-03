// src/penjualan/penjualan.service.ts  
import { Injectable, BadRequestException } from '@nestjs/common';  
import { PrismaService } from '../prisma/prisma.service';  
import { CreatePenjualanDto } from './dto/create-penjualan.dto';  
import { UpdatePenjualanDto } from './dto/update-penjualan.dto';  

@Injectable()  
export class PenjualanService {  
  constructor(private readonly prisma: PrismaService) {}  

  // Fungsi membuat code penjualan otomatis
  private async generatePenjualanCode(): Promise<string> {  
    const today = new Date();  
    const day = String(today.getDate()).padStart(2, '0');  
    const month = String(today.getMonth() + 1).padStart(2, '0');  
    const year = String(today.getFullYear());  

     const startOfDay = new Date(today.setHours(0, 0, 0, 0));  
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));  

    const lastPenjualan = await this.prisma.penjualan.findFirst({  
      where: {  
        tanggal: {  
          gte: startOfDay,  
          lte: endOfDay,  
        },  
      },  
      orderBy: {  
        code: 'desc',  
      },  
    });  

    let sequence = '0001';  
    if (lastPenjualan) {  
      const lastSequence = parseInt(lastPenjualan.code.slice(-2));  
      sequence = String(lastSequence + 1).padStart(4, '0');  
    }  

    return `PNJ-${day}${month}${year}${sequence}`;  
  }  

// fungsi membuat create objek
async create(createPenjualanDto: CreatePenjualanDto) {  
  const { details, ...penjualanData } = createPenjualanDto;  
  const code = await this.generatePenjualanCode();  

  for (const detail of details) {  
    const barang = await this.prisma.barang.findUnique({  
      where: { id: detail.id_barang }  
    });  

    if (!barang) {  
      throw new BadRequestException(`Barang dengan ID ${detail.id_barang} tidak ditemukan`);  
    }  

    if (barang.stock < detail.qty) {  
      throw new BadRequestException(  
        `Stok tidak mencukupi untuk barang ${barang.nama_barang}. Sisa stok: ${barang.stock}`  
      );  
    }  
  }  

  return this.prisma.$transaction(async (prisma) => {  
     const penjualan = await prisma.penjualan.create({  
      data: {  
        ...penjualanData,  
        code,  
        DetailPenjualan: {  
          create: details  
        }  
      },  
      include: {  
        customer: true,  
        DetailPenjualan: {  
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
            decrement: detail.qty 
          }  
        }  
      });  
    }  

    return penjualan;  
  });  
}

// fungsi untuk mencari seluruh data
  async findAll() {  
    return this.prisma.penjualan.findMany({  
      include: {  
        customer: true,  
        DetailPenjualan: {  
          include: {  
            barang: true  
          }  
        }  
      },  
      orderBy: {  
        tanggal: 'desc'  
      }  
    });  
  }  

  // fungsi untuk mencari data terbaru
  async findRecent(limit: number = 5) {  
    try {  
      const transactions = await this.prisma.penjualan.findMany({  
        take: limit,  
        orderBy: {  
          created_at: 'desc'  
        },  
        include: {  
          customer: true,  
          DetailPenjualan: {  
            include: {  
              barang: true  
            }  
          }  
        },  
        where: {  
          deleted_at: null  
        }  
      });  
  
      return transactions.map(transaction => ({  
        ...transaction,  
        total: transaction.DetailPenjualan.reduce(  
          (sum, detail) => sum + (parseInt(detail.harga_jual) * detail.qty),   
          0  
        )  
      }));  
    } catch (error) {  
      console.error('Error in findRecent:', error);  
      return [];  
    }  
  }

  // fungsi untuk mencari satu data
  async findOne(id: number) {  
    return this.prisma.penjualan.findUnique({  
      where: { id },  
      include: {  
        customer: true,  
        DetailPenjualan: {  
          include: {  
            barang: true  
          }  
        }  
      }  
    });  
  }  

  // fungsi untuk memperbarui data
  async update(id: number, updatePenjualanDto: UpdatePenjualanDto) {  
    return this.prisma.penjualan.update({  
      where: { id },  
      data: updatePenjualanDto,  
      include: {  
        customer: true,  
        DetailPenjualan: {  
          include: {  
            barang: true  
          }  
        }  
      }  
    });  
  }  

  // fungsi untuk remove data
  async remove(id: number) {  
    const penjualan = await this.findOne(id);  
    if (!penjualan) {  
      throw new BadRequestException('Penjualan tidak ditemukan');  
    }  

    return this.prisma.$transaction(async (prisma) => {  
      // Kembalikan stok barang  
      for (const detail of penjualan.DetailPenjualan) {  
        await prisma.barang.update({  
          where: { id: detail.id_barang },  
          data: {  
            stock: {  
              increment: detail.qty  
            }  
          }  
        });  
      }  

      // Hapus detail penjualan  
      await prisma.detailPenjualan.deleteMany({  
        where: { id_penjualan: id }  
      });  

      // Hapus penjualan  
      return prisma.penjualan.delete({  
        where: { id }  
      });  
    });  
  }  
}