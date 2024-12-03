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
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { PenjualanService } from './penjualan.service';
import { CreatePenjualanDto } from './dto/create-penjualan.dto';
import { UpdatePenjualanDto } from './dto/update-penjualan.dto';
import { transformEntity } from 'src/common/transformer/entity.transformer';
import { User } from 'src/common/decorator/currentuser.decorator';
import { AuditService } from 'src/audit/audit.service';
import { AccessTokenGuard } from '@backend/common/guards/access-token.guard';
import { RolesGuard } from '@backend/common/guards/roles.guard';
import { Roles } from '@backend/common/decorator/roles.decorator';
import { UserAkses } from '@backend/common/constants/enum';
import { ParamIdDto } from 'src/common/decorator/param-id.dto';
import { CustomerService } from 'src/customer/customer.service';
import { PenjualanEntity } from './entity/penjualan.entity';

@UseGuards(AccessTokenGuard, RolesGuard)
@Controller('penjualan')
@Roles(UserAkses.ADMIN)
export class PenjualanController {
  constructor(
    private readonly penjualanService: PenjualanService,
    private readonly auditService: AuditService,
    private readonly customerService: CustomerService,
  ) {}

  @Post()
  async create(
    @Body() createPenjualanDto: CreatePenjualanDto,
    @User() user: any,
    @Req() req: Request,
  ): Promise<PenjualanEntity> {
    try {
      const customer = await this.customerService.findOne(
        createPenjualanDto.id_customer,
      );
      if (!customer) {
        throw new BadRequestException('Customer not found.');
      }

      const create = await this.penjualanService.create(createPenjualanDto);
      const penjualanEntity = new PenjualanEntity(create);

      // Catat audit
      await this.auditService.create({
        Url: req.url,
        ActionName: 'Create Penjualan',
        MenuName: 'Penjualan',
        DataBefore: '',
        DataAfter: JSON.stringify(penjualanEntity),
        UserName: user.name,
        IpAddress: req.ip,
        ActivityDate: new Date(),
        Browser: this.getBrowserFromUserAgent(req.headers['user-agent'] || ''),
        OS: this.getOSFromUserAgent(req.headers['user-agent'] || '', req),
        AppSource: 'Desktop',
        created_by: user.id,
        updated_by: user.id,
      });

      return penjualanEntity;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error('Penjualan Creation Error:', error);
      throw new BadRequestException(
        error.message || 'Failed to create penjualan',
      );
    }
  }

  @Get()
  async findAll(): Promise<PenjualanEntity[]> {
    const penjualans = await this.penjualanService.findAll();
    return transformEntity(PenjualanEntity, penjualans);
  }

  @Get(':id')
  async findOne(@Param() param: ParamIdDto): Promise<PenjualanEntity> {
    const find = await this.penjualanService.findOne(param.id);
    if (!find) throw new BadRequestException('Penjualan not found.');

    return new PenjualanEntity(find);
  }

  @Patch(':id')
  async update(
    @Param() param: ParamIdDto,
    @Body() updatePenjualanDto: UpdatePenjualanDto,
    @User() user: any,
    @Req() req: Request,
  ): Promise<PenjualanEntity> {
    try {
      const existingPenjualan = await this.penjualanService.findOne(param.id);
      if (!existingPenjualan) {
        throw new BadRequestException('Penjualan not found.');
      }

      if (updatePenjualanDto.id_customer) {
        const customer = await this.customerService.findOne(
          updatePenjualanDto.id_customer,
        );
        if (!customer) {
          throw new BadRequestException('Customer not found.');
        }
      }

      const oldData = { ...existingPenjualan };

      const updatedPenjualan = await this.penjualanService.update(
        param.id,
        updatePenjualanDto,
      );
      const penjualanEntity = new PenjualanEntity(updatedPenjualan);

      await this.auditService.create({
        Url: req.url,
        ActionName: 'Update Penjualan',
        MenuName: 'Penjualan',
        DataBefore: JSON.stringify(oldData),
        DataAfter: JSON.stringify(penjualanEntity),
        UserName: user.name,
        IpAddress: req.ip,
        ActivityDate: new Date(),
        Browser: this.getBrowserFromUserAgent(req.headers['user-agent'] || ''),
        OS: this.getOSFromUserAgent(req.headers['user-agent'] || '', req),
        AppSource: 'Desktop',
        created_by: user.id,
        updated_by: user.id,
      });

      return penjualanEntity;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error('Penjualan Update Error:', error);
      throw new BadRequestException(
        error.message || 'Failed to update penjualan',
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
      const existingPenjualan = await this.penjualanService.findOne(param.id);
      if (!existingPenjualan) {
        throw new BadRequestException('Penjualan not found.');
      }

      await this.penjualanService.remove(param.id);

      await this.auditService.create({
        Url: req.url,
        ActionName: 'Delete Penjualan',
        MenuName: 'Penjualan',
        DataBefore: JSON.stringify(existingPenjualan),
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
      console.error('Penjualan Delete Error:', error);
      throw new BadRequestException(
        error.message || 'Failed to delete penjualan',
      );
    }
  }

  private getBrowserFromUserAgent(userAgent: string): string {
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    if (userAgent.includes('MSIE') || userAgent.includes('Trident/'))
      return 'Internet Explorer';
    return 'Unknown';
  }

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
