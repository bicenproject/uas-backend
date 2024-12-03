import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { PrismaModule } from '@backend/prisma/prisma.module';
import { AuditService } from '@backend/audit/audit.service';

@Module({
  imports : [PrismaModule],
  controllers: [CategoryController],
  providers: [CategoryService, AuditService]
})
export class CategoryModule {}
