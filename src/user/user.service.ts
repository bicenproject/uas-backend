import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { Prisma, User, UserSession } from '@prisma/client';
import { AuthService } from 'src/auth/auth.service';
import { transformEntity } from 'src/common/transformer/entity.transformer';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const user = await this.prismaService.user.create({
      data: {
        ...createUserDto,
        password: await this.authService.hashData(createUserDto.password),
      },
      include: {
        akses: true,
      },
    });

    return transformEntity(UserEntity, user);
  }

  async findAll(): Promise<UserEntity[]> {  
    const users = await this.prismaService.user.findMany({  
      where: {  
        deleted_at: null,  
      },  
      orderBy: {  
        created_at: 'desc', 
      },  
      include: {  
        akses: true,  
      },  
    });  
  
    return transformEntity(UserEntity, users);  
  }  

  async findOne(id: number) {  
    return this.prismaService.user.findUnique({  
      where: { id },  
      include: {  
        akses: true 
      }  
    });  
  }  

  findOneBy(where: Prisma.UserWhereInput): Promise<User> {
    return this.prismaService.user.findFirst({
      where,
      include: {
        akses: true,
      },
    });
  }

  async findByEmail(email: string) {  
    return this.prismaService.user.findUnique({  
      where: { email },  
      include: {  
        akses: true  
      }  
    });  
  }  

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const password = updateUserDto.password
      ? {
          password: await this.authService.hashData(updateUserDto.password),
        }
      : {};
    return this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        ...updateUserDto,
        ...password,
      },
      include: {
        akses: true,
      },
    });
  }

  async remove(id: number): Promise<null> {
    const find = await this.findOne(id);

    await this.prismaService.$transaction(async (trx) => {
      return await Promise.all([
        trx.user.update({
          where: {
            id,
          },
          data: {
            email: `${find.email} (deleted_at: ${Date.now()})`,
          },
        }),
        trx.user.delete({
          where: {
            id,
          },
        }),
      ]);
    });

    return null;
  }

  async findOneUserSessionBy(where: { user_id: number; identifier: string }) {  
    return this.prismaService.userSession.findUnique({  
      where: {  
        user_id_identifier: where,  
      },  
    });  
  }  

  async getAll(where: Prisma.UserWhereInput = {}): Promise<User[]> {
    return this.prismaService.user.findMany({
      where,
    });
  }
}