// src/supplier/supplier.controller.ts  
import {  
    BadRequestException,  
    Body,  
    Controller,  
    Delete,  
    Get,  
    Param,  
    Patch,  
    Post,  
    Req,  
    UseGuards  
  } from '@nestjs/common';  
  import { Request } from 'express';  
  import { SupplierService } from './supplier.service';  
  import { CreateSupplierDto } from './dto/create-supplier.dto';  
  import { UpdateSupplierDto } from './dto/update-supplier.dto';  
  import { SupplierEntity } from './entities/supplier.entity';  
  import { transformEntity } from 'src/common/transformer/entity.transformer';  
  import { User } from 'src/common/decorator/currentuser.decorator';  
  import { AuditService } from 'src/audit/audit.service';  
  import { AccessTokenGuard } from '@backend/common/guards/access-token.guard';  
  import { RolesGuard } from '@backend/common/guards/roles.guard';  
  import { ParamIdDto } from 'src/common/decorator/param-id.dto';  
import { UserAkses } from '@backend/common/constants/enum';
import { Roles } from '@backend/common/decorator/roles.decorator';
  
  @UseGuards(AccessTokenGuard, RolesGuard)  
  @Controller('supplier')  
  @Roles(UserAkses.ADMIN, UserAkses.SUPERVISOR, UserAkses.KASIR)
  export class SupplierController {  
    constructor(  
      private readonly supplierService: SupplierService,  
      private readonly auditService: AuditService,  
    ) {}  
  
    @Post()  
    async create(  
      @Body() createSupplierDto: CreateSupplierDto,  
      @User() user: any,  
      @Req() req: Request,  
    ): Promise<SupplierEntity> {  
      try {  
        const existingSupplier = await this.supplierService.findOneBy({   
          name: createSupplierDto.name   
        });  
        
        if (existingSupplier) {  
          throw new BadRequestException('Supplier company name already exists.');  
        }  
  
        const create = await this.supplierService.create(createSupplierDto);  
        const supplierEntity = new SupplierEntity(create);  
  
        await this.auditService.create({  
          Url: req.url,  
          ActionName: 'Create Supplier',  
          MenuName: 'Supplier',  
          DataBefore: '',  
          DataAfter: JSON.stringify(supplierEntity),  
          UserName: user.name,  
          IpAddress: req.ip,  
          ActivityDate: new Date(),  
          Browser: this.getBrowserFromUserAgent(req.headers['user-agent'] || ''),  
          OS: this.getOSFromUserAgent(req.headers['user-agent'] || '', req),  
          AppSource: 'Desktop',  
          created_by: user.id,  
          updated_by: user.id,  
        });  
  
        return supplierEntity;  
      } catch (error) {  
        throw error instanceof BadRequestException   
          ? error   
          : new BadRequestException('Failed to create supplier');  
      }  
    }  
  
    @Get()  
    async findAll(): Promise<SupplierEntity[]> {  
      const suppliers = await this.supplierService.findAll();  
      return transformEntity(SupplierEntity, suppliers);  
    }  
  
    @Get(':id')  
    async findOne(@Param() param: ParamIdDto): Promise<SupplierEntity> {  
      const find = await this.supplierService.findOne(param.id);  
      if (!find) throw new BadRequestException('Supplier not found.');  
  
      return new SupplierEntity(find);  
    }  
  
    @Patch(':id')  
    async update(  
      @Param() param: ParamIdDto,  
      @Body() updateSupplierDto: UpdateSupplierDto,  
      @User() user: any,  
      @Req() req: Request,  
    ): Promise<SupplierEntity> {  
      const existingSupplier = await this.supplierService.findOne(param.id);  
      if (!existingSupplier) {  
        throw new BadRequestException('Supplier not found.');  
      }  
  
      const findExistCompanyName = await this.supplierService.findOneBy({  
        name: updateSupplierDto.name,  
      });  
      if (findExistCompanyName && findExistCompanyName.id !== existingSupplier.id) {  
        throw new BadRequestException('Supplier company name already exists.');  
      }  
  
      const oldData = { ...existingSupplier };  
  
      const updatedSupplier = await this.supplierService.update(  
        param.id,   
        updateSupplierDto  
      );  
      const supplierEntity = new SupplierEntity(updatedSupplier);  
  
      await this.auditService.create({  
        Url: req.url,  
        ActionName: 'Update Supplier',  
        MenuName: 'Supplier',  
        DataBefore: JSON.stringify(oldData),  
        DataAfter: JSON.stringify(supplierEntity),  
        UserName: user.name,  
        IpAddress: req.ip,  
        ActivityDate: new Date(),  
        Browser: this.getBrowserFromUserAgent(req.headers['user-agent'] || ''),  
        OS: this.getOSFromUserAgent(req.headers['user-agent'] || '', req),  
        AppSource: 'Desktop',  
        created_by: user.id,  
        updated_by: user.id,  
      });  
  
      return supplierEntity;  
    }  
  
    @Delete(':id')  
    async remove(  
      @Param() param: ParamIdDto,  
      @User() user: any,  
      @Req() req: Request,  
    ): Promise<null> {  
      const existingSupplier = await this.supplierService.findOne(param.id);  
      if (!existingSupplier) {  
        throw new BadRequestException('Supplier not found.');  
      }  
  
      await this.supplierService.remove(param.id);  
  
      await this.auditService.create({  
        Url: req.url,  
        ActionName: 'Delete Supplier',  
        MenuName: 'Supplier',  
        DataBefore: JSON.stringify(existingSupplier),  
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
    }  
  
    @Get('get/all')  
    async getAll(): Promise<SupplierEntity[]> {  
      const suppliers = await this.supplierService.getAll();  
      return transformEntity(SupplierEntity, suppliers);  
    }  
  
    // Metode untuk mendapatkan browser  
    private getBrowserFromUserAgent(userAgent: string): string {  
      if (userAgent.includes('Chrome')) return 'Chrome';  
      if (userAgent.includes('Firefox')) return 'Firefox';  
      if (userAgent.includes('Safari')) return 'Safari';  
      if (userAgent.includes('Edge')) return 'Edge';  
      if (userAgent.includes('MSIE') || userAgent.includes('Trident/')) return 'Internet Explorer';  
      return 'Unknown';  
    }  
  
    // Metode untuk mendapatkan OS  
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