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
import { transformEntity } from 'src/common/transformer/entity.transformer';
import { User } from 'src/common/decorator/currentuser.decorator';
import { AuditService } from 'src/audit/audit.service';
import { AccessTokenGuard } from '@backend/common/guards/access-token.guard';
import { RolesGuard } from '@backend/common/guards/roles.guard';
import { Roles } from '@backend/common/decorator/roles.decorator';
import { UserAkses } from '@backend/common/constants/enum';
import { ParamIdDto } from 'src/common/decorator/param-id.dto';
import { Public } from '@backend/common/decorator/guest.decorator';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomerEntity } from './entity/product.entity';

@UseGuards(AccessTokenGuard, RolesGuard)
@Controller('customer')
export class CustomerController {
  constructor(
    private readonly CustomerService: CustomerService,
    private readonly auditService: AuditService,
  ) {}

  @Post()
  @Roles(UserAkses.ADMIN)
  async create(
    @Body() createCustomerDto: CreateCustomerDto,
    @User() user: any,
    @Req() req: Request,
  ): Promise<CustomerEntity> {
    try {
      const create = await this.CustomerService.create(createCustomerDto);
      const customerEntity = new CustomerEntity(create);

      // Catat audit
      await this.auditService.create({
        Url: req.url,
        ActionName: 'Create Customer',
        MenuName: 'Customer',
        DataBefore: '',
        DataAfter: JSON.stringify(customerEntity),
        UserName: user.name,
        IpAddress: req.ip,
        ActivityDate: new Date(),
        Browser: this.getBrowserFromUserAgent(req.headers['user-agent'] || ''),
        OS: this.getOSFromUserAgent(req.headers['user-agent'] || '', req),
        AppSource: 'Desktop',
        created_by: user.id,
        updated_by: user.id,
      });

      return customerEntity;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error('Customer Creation Error:', error);
      throw new BadRequestException(
        error.message || 'Failed to create Customer',
      );
    }
  }

  @Public()
  @Get()
  async findAll(): Promise<CustomerEntity[]> {
    const roles = await this.CustomerService.findAll();
    return transformEntity(CustomerEntity, roles);
  }

  @Public()
  @Get(':id')
  async findOne(@Param() param: ParamIdDto): Promise<CustomerEntity> {
    const find = await this.CustomerService.findOne(param.id);
    if (!find) throw new BadRequestException('Customer not found.');

    return new CustomerEntity(find);
  }

  @Patch(':id')
  @Roles(UserAkses.ADMIN)
  async update(
    @Param() param: ParamIdDto,
    @Body() updateCustomerDto: UpdateCustomerDto,
    @User() user: any,
    @Req() req: Request,
  ): Promise<CustomerEntity> {
    try {
      const existingCustomer = await this.CustomerService.findOne(param.id);
      if (!existingCustomer) {
        throw new BadRequestException('Customer not found.');
      }

      const oldData = { ...existingCustomer };

      const updatedCustomer = await this.CustomerService.update(
        param.id,
        updateCustomerDto,
      );
      const customerEntity = new CustomerEntity(updatedCustomer);

      await this.auditService.create({
        Url: req.url,
        ActionName: 'Update Customer',
        MenuName: 'Customer',
        DataBefore: JSON.stringify(oldData),
        DataAfter: JSON.stringify(customerEntity),
        UserName: user.name,
        IpAddress: req.ip,
        ActivityDate: new Date(),
        Browser: this.getBrowserFromUserAgent(req.headers['user-agent'] || ''),
        OS: this.getOSFromUserAgent(req.headers['user-agent'] || '', req),
        AppSource: 'Desktop',
        created_by: user.id,
        updated_by: user.id,
      });

      return customerEntity;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error('Customer Update Error:', error);
      throw new BadRequestException(
        error.message || 'Failed to update Customer',
      );
    }
  }

  @Delete(':id')
  @Roles(UserAkses.ADMIN)
  async remove(
    @Param() param: ParamIdDto,
    @User() user: any,
    @Req() req: Request,
  ): Promise<null> {
    try {
      const existingCustomer = await this.CustomerService.findOne(param.id);
      if (!existingCustomer) {
        throw new BadRequestException('Customer not found.');
      }

      await this.CustomerService.remove(param.id);

      await this.auditService.create({
        Url: req.url,
        ActionName: 'Delete Customer',
        MenuName: 'Customer',
        DataBefore: JSON.stringify(existingCustomer),
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
      console.error('Customer Delete Error:', error);
      throw new BadRequestException(
        error.message || 'Failed to delete Customer',
      );
    }
  }

  @Public()
  @Get('get/all')
  async getAll(): Promise<CustomerEntity[]> {
    const Customers = await this.CustomerService.getAll();
    return transformEntity(CustomerEntity, Customers);
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
