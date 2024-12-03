import { Module } from '@nestjs/common';
import { PembelianService } from './pembelian.service';
import { PembelianController } from './pembelian.controller';
import { AuditService } from '@backend/audit/audit.service';
import { PrismaModule } from '@backend/prisma/prisma.module';
import { SupplierService } from '@backend/supplier/supplier.service';

@Module({
  imports: [PrismaModule],
  providers: [PembelianService, AuditService, SupplierService],
  controllers: [PembelianController]
})
export class PembelianModule {}
