import { Module } from '@nestjs/common';
import { SupplierController } from './supplier.controller';
import { SupplierService } from './supplier.service';
import { PrismaModule } from '@backend/prisma/prisma.module';
import { AuditService } from '@backend/audit/audit.service';

@Module({
  imports:[PrismaModule],
  controllers: [SupplierController],
  providers: [SupplierService, AuditService],
})
export class SupplierModule {}
