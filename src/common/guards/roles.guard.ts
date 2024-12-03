 import {  
    Injectable,  
    CanActivate,  
    ExecutionContext,  
    ForbiddenException,  
  } from '@nestjs/common';  
  import { Reflector } from '@nestjs/core';  
  import { PrismaService } from 'src/prisma/prisma.service';  
  import { ROLES_KEY } from '../decorator/roles.decorator';  
import { UserAkses } from '../constants/enum';
import { IS_PUBLIC_KEY } from '../decorator/guest.decorator';
  
  @Injectable()  
  export class RolesGuard implements CanActivate {  
    constructor(  
      private reflector: Reflector,  
      private prismaService: PrismaService,  
    ) {}  
  
    async canActivate(context: ExecutionContext): Promise<boolean> {  
      // Cek route public  
      const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [  
        context.getHandler(),  
        context.getClass()  
      ]);  
  
      // Jika public, izinkan akses  
      if (isPublic) {  
        return true;  
      }  
  
      // Lanjutkan logika role sebelumnya  
      const requiredRoles = this.reflector.getAllAndOverride<UserAkses[]>(  
        ROLES_KEY,  
        [context.getHandler(), context.getClass()],  
      );  
      
      // Jika tidak ada role yang didefinisikan, izinkan akses  
      if (!requiredRoles) {  
        return true;  
      }  
  
      // Dapatkan request dan user  
      const request = context.switchToHttp().getRequest();  
      const user = request.user;  
  
      // Jika tidak ada user, lempar unauthorized  
      if (!user) {  
        throw new ForbiddenException('You must log in first.');  
      }  
  
      // Cari user dengan role  
      const userWithRole = await this.prismaService.user.findUnique({  
        where: { id: user.id },  
        include: { akses: true },  
      });  
  
      // Periksa apakah role user ada di antara role yang diizinkan  
      const hasAccess = requiredRoles.includes(userWithRole.akses_user_id);  
  
      if (!hasAccess) {  
        // Ambil nama role yang dibutuhkan  
        const roleNames = await this.getRoleNames(requiredRoles);  
  
        throw new ForbiddenException(  
          `Access denied. You do not have permission to use this feature.`,  
        );  
      }  
  
      return hasAccess;  
    }  
  
    // Metode untuk mendapatkan nama role  
    private async getRoleNames(roleIds: UserAkses[]): Promise<string[]> {  
      const roles = await this.prismaService.akses_user.findMany({  
        where: {  
          id_akses: { in: roleIds },  
        },  
        select: { role: true },  
      });  
  
      return roles.map((role) => role.role);  
    }  
  }