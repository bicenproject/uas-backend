import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { PrismaModule } from '@backend/prisma/prisma.module';
import { AuditService } from '@backend/audit/audit.service';

@Module({
  imports: [PrismaModule],
  providers: [CustomerService, AuditService],
  controllers: [CustomerController]
})
export class CustomerModule {}
