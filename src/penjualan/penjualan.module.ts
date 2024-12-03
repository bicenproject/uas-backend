import { Module } from '@nestjs/common';
import { PenjualanService } from './penjualan.service';
import { PenjualanController } from './penjualan.controller';
import { PrismaModule } from '@backend/prisma/prisma.module';
import { AuditService } from '@backend/audit/audit.service';
import { CustomerService } from '@backend/customer/customer.service';

@Module({
  imports: [PrismaModule],
  providers: [PenjualanService, AuditService, CustomerService],
  controllers: [PenjualanController]
})
export class PenjualanModule {}
