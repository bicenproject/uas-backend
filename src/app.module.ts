import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import configuration from './common/config/configuration';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { AuditModule } from './audit/audit.module';
import { ProductModule } from './product/product.module';
import { SupplierModule } from './supplier/supplier.module';
import { CategoryModule } from './category/category.module';
import { CustomerModule } from './customer/customer.module';
import { PembelianModule } from './pembelian/pembelian.module';
 import { PenjualanModule } from './penjualan/penjualan.module';
 
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    RoleModule,
    AuditModule,
    ProductModule,
    SupplierModule,
    CategoryModule,
    CustomerModule,
    PembelianModule,
     PenjualanModule,
   ],
})
export class AppModule {}
