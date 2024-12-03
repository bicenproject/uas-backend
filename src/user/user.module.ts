import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RoleService } from 'src/role/role.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { AuditService } from 'src/audit/audit.service';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserService, RoleService, AuthService, JwtService, AuditService],
  exports: [UserService],
})
export class UserModule {}
