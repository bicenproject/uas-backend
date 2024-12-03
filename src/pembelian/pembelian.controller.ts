// src/pembelian/pembelian.controller.ts  
import {  
    BadRequestException,  
    Body,  
    Controller,  
    Delete,  
    Get,  
    Param,  
    Patch,  
    Post,  
    Query,  
    Req,  
    UseGuards,  
  } from '@nestjs/common';  
  import { Request } from 'express';  
  import { PembelianService } from './pembelian.service';  
  import { CreatePembelianDto } from './dto/create-pembelian.dto';  
  import { UpdatePembelianDto } from './dto/update-pembelian.dto';  
  import { transformEntity } from 'src/common/transformer/entity.transformer';  
  import { User } from 'src/common/decorator/currentuser.decorator';  
  import { AuditService } from 'src/audit/audit.service';  
  import { AccessTokenGuard } from '@backend/common/guards/access-token.guard';  
  import { RolesGuard } from '@backend/common/guards/roles.guard';  
  import { Roles } from '@backend/common/decorator/roles.decorator';  
  import { UserAkses } from '@backend/common/constants/enum';  
  import { ParamIdDto } from 'src/common/decorator/param-id.dto';  
  import { SupplierService } from 'src/supplier/supplier.service';  
import { PembelianEntity } from './entity/pembelian.entity';
  
  @UseGuards(AccessTokenGuard, RolesGuard)  
  @Controller('pembelian')  
  @Roles(UserAkses.ADMIN)  
  export class PembelianController {  
    constructor(  
      private readonly pembelianService: PembelianService,  
      private readonly auditService: AuditService,  
      private readonly supplierService: SupplierService,  
    ) {}  
  
    @Post()  
    async create(  
      @Body() createPembelianDto: CreatePembelianDto,  
      @User() user: any,  
      @Req() req: Request,  
    ): Promise<PembelianEntity> {  
      try {  
        const supplier = await this.supplierService.findOne(  
          createPembelianDto.id_supplier,  
        );  
        if (!supplier) {  
          throw new BadRequestException('Supplier not found.');  
        }  
  
        const create = await this.pembelianService.create(createPembelianDto);  
        const pembelianEntity = new PembelianEntity(create);  
  
        // Catat audit  
        await this.auditService.create({  
          Url: req.url,  
          ActionName: 'Create Pembelian',  
          MenuName: 'Pembelian',  
          DataBefore: '',  
          DataAfter: JSON.stringify(pembelianEntity),  
          UserName: user.name,  
          IpAddress: req.ip,  
          ActivityDate: new Date(),  
          Browser: this.getBrowserFromUserAgent(req.headers['user-agent'] || ''),  
          OS: this.getOSFromUserAgent(req.headers['user-agent'] || '', req),  
          AppSource: 'Desktop',  
          created_by: user.id,  
          updated_by: user.id,  
        });  
  
        return pembelianEntity;  
      } catch (error) {  
        if (error instanceof BadRequestException) {  
          throw error;  
        }  
        console.error('Pembelian Creation Error:', error);  
        throw new BadRequestException(  
          error.message || 'Failed to create pembelian',  
        );  
      }  
    }  
  
    @Get()  
    async findAll(): Promise<PembelianEntity[]> {  
      const pembelians = await this.pembelianService.findAll();  
      return transformEntity(PembelianEntity, pembelians);  
    }  

    @Get('recent')
    @Roles(UserAkses.ADMIN, UserAkses.SUPERVISOR)
    async getRecentTransactions(@Query('limit') limit = 5): Promise<any> {
      try {
        const recentTransactions = await this.pembelianService.findRecent(limit);
        return {
          status: {
            code: 200,
            description: 'OK',
          },
          result: recentTransactions,
        };
      } catch (error) {
        return {
          status: {
            code: 500,
            description: 'Internal Server Error',
          },
          result: [],
        };
      }
    }
  
    @Get(':id')  
    async findOne(@Param() param: ParamIdDto): Promise<PembelianEntity> {  
      const find = await this.pembelianService.findOne(param.id);  
      if (!find) throw new BadRequestException('Pembelian not found.');  
  
      return new PembelianEntity(find);  
    }  
  
    @Patch(':id')  
    async update(  
      @Param() param: ParamIdDto,  
      @Body() updatePembelianDto: UpdatePembelianDto,  
      @User() user: any,  
      @Req() req: Request,  
    ): Promise<PembelianEntity> {  
      try {  
        const existingPembelian = await this.pembelianService.findOne(param.id);  
        if (!existingPembelian) {  
          throw new BadRequestException('Pembelian not found.');  
        }  
  
        if (updatePembelianDto.id_supplier) {  
          const supplier = await this.supplierService.findOne(  
            updatePembelianDto.id_supplier,  
          );  
          if (!supplier) {  
            throw new BadRequestException('Supplier not found.');  
          }  
        }  
  
        const oldData = { ...existingPembelian };  
  
        const updatedPembelian = await this.pembelianService.update(  
          param.id,  
          updatePembelianDto,  
        );  
        const pembelianEntity = new PembelianEntity(updatedPembelian);  
  
        await this.auditService.create({  
          Url: req.url,  
          ActionName: 'Update Pembelian',  
          MenuName: 'Pembelian',  
          DataBefore: JSON.stringify(oldData),  
          DataAfter: JSON.stringify(pembelianEntity),  
          UserName: user.name,  
          IpAddress: req.ip,  
          ActivityDate: new Date(),  
          Browser: this.getBrowserFromUserAgent(req.headers['user-agent'] || ''),  
          OS: this.getOSFromUserAgent(req.headers['user-agent'] || '', req),  
          AppSource: 'Desktop',  
          created_by: user.id,  
          updated_by: user.id,  
        });  
  
        return pembelianEntity;  
      } catch (error) {  
        if (error instanceof BadRequestException) {  
          throw error;  
        }  
        console.error('Pembelian Update Error:', error);  
        throw new BadRequestException(  
          error.message || 'Failed to update pembelian',  
        );  
      }  
    }  
  
    @Delete(':id')  
    async remove(  
      @Param() param: ParamIdDto,  
      @User() user: any,  
      @Req() req: Request,  
    ): Promise<null> {  
      try {  
        const existingPembelian = await this.pembelianService.findOne(param.id);  
        if (!existingPembelian) {  
          throw new BadRequestException('Pembelian not found.');  
        }  
  
        await this.pembelianService.remove(param.id);  
  
        await this.auditService.create({  
          Url: req.url,  
          ActionName: 'Delete Pembelian',  
          MenuName: 'Pembelian',  
          DataBefore: JSON.stringify(existingPembelian),  
          DataAfter: '',  
          UserName: user.name,  
          IpAddress: req.ip,  
          ActivityDate: new Date(),  
          Browser: this.getBrowserFromUserAgent(req.headers['user-agent'] || ''),  
          OS: this.getOSFromUserAgent(req.headers['user-agent'] || '', req),  
          AppSource: 'Desktop',  
          created_by: user.id,  
          updated_by: user.id,  
        });  
  
        return null;  
      } catch (error) {  
        if (error instanceof BadRequestException) {  
          throw error;  
        }  
        console.error('Pembelian Delete Error:', error);  
        throw new BadRequestException(  
          error.message || 'Failed to delete pembelian',  
        );  
      }  
    }  
  
    //  @Get('report/summary')  
    // async getPembelianSummary() {  
    //   try {  
    //     const summary = await this.pembelianService.getPembelianSummary();  
    //     return {  
    //       success: true,  
    //       message: 'Pembelian summary retrieved successfully',  
    //       data: summary  
    //     };  
    //   } catch (error) {  
    //     throw new BadRequestException(  
    //       error.message || 'Failed to get pembelian summary',  
    //     );  
    //   }  
    // }  
  
    // Method helper untuk mendapatkan informasi browser  
    private getBrowserFromUserAgent(userAgent: string): string {  
      if (userAgent.includes('Chrome')) return 'Chrome';  
      if (userAgent.includes('Firefox')) return 'Firefox';  
      if (userAgent.includes('Safari')) return 'Safari';  
      if (userAgent.includes('Edge')) return 'Edge';  
      if (userAgent.includes('MSIE') || userAgent.includes('Trident/'))  
        return 'Internet Explorer';  
      return 'Unknown';  
    }  
  
    // Method helper untuk mendapatkan informasi OS  
    private getOSFromUserAgent(userAgent: string, request: Request): string {  
      const testOS = request.headers['x-test-os'];  
  
      if (testOS) return testOS as string;  
  
      if (/PostmanRuntime/i.test(userAgent))  
        return 'Postman (Testing Environment)';  
      if (userAgent.includes('Windows')) return 'Windows';  
      if (userAgent.includes('Mac')) return 'MacOS';  
      if (userAgent.includes('Linux')) return 'Linux';  
      if (userAgent.includes('Android')) return 'Android';  
      if (userAgent.includes('iOS')) return 'iOS';  
  
      return 'Unknown';  
    }  
  }