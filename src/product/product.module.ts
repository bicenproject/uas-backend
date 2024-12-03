import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { AuditService } from '@backend/audit/audit.service';
import { PrismaModule } from '@backend/prisma/prisma.module';
import { CategoryService } from '@backend/category/category.service';

@Module({
  imports: [PrismaModule],
  controllers: [ProductController],
  providers: [ProductService, AuditService, CategoryService]
})
export class ProductModule {}
