import { BadRequestException, Injectable } from '@nestjs/common';
import { akses_user, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RoleService {
  constructor(private readonly prismaService: PrismaService) {}

  
  async create(createRoleDto: CreateRoleDto): Promise<akses_user> {  
     try {  
      const role = await this.prismaService.akses_user.create({  
        data: createRoleDto,  
      });  
       return role;  
    } catch (error) {  
       throw error;  
    }  
  }  
  
  async findAll(): Promise<akses_user[]> {  
    return this.prismaService.akses_user.findMany({  
      where: {  
        deleted_at: null, 
      },  
      orderBy: {  
        created_at: 'desc',   
      },  
    });  
  }

  findOne(id_akses: number): Promise<akses_user> {
    return this.prismaService.akses_user.findUnique({
      where: {
        id_akses,
      },
    });
  }

  findOneBy(where: Prisma.akses_userWhereInput): Promise<akses_user> {
    return this.prismaService.akses_user.findFirst({
      where,
    });
  }

  update(id_akses: number, updateRoleDto: UpdateRoleDto): Promise<akses_user> {
    return this.prismaService.akses_user.update({
      where: {
        id_akses,
      },
      data: updateRoleDto,
    });
  }

  async remove(id_akses: number): Promise<null> {
    const role = await this.findOne(id_akses);
    if (!role) {
      throw new BadRequestException('Data not found.');
    }

    await this.prismaService.$transaction(async (trx) => {
      await trx.akses_user.update({
        where: { id_akses },
        data: {
          code: `${role.code} (deleted_at: ${new Date().toISOString()})`,
          deleted_at: new Date(),
        },
      });
      await trx.akses_user.delete({
        where: { id_akses },
      });
    });
    return null;
  }
}
