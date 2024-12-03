// src/product/product.controller.ts
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
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductEntity } from './entities/product.entity';
import { transformEntity } from 'src/common/transformer/entity.transformer';
import { User } from 'src/common/decorator/currentuser.decorator';
import { AuditService } from 'src/audit/audit.service';
import { AccessTokenGuard } from '@backend/common/guards/access-token.guard';
import { RolesGuard } from '@backend/common/guards/roles.guard';
import { Roles } from '@backend/common/decorator/roles.decorator';
import { UserAkses } from '@backend/common/constants/enum';
import { ParamIdDto } from 'src/common/decorator/param-id.dto';
import { CategoryService } from 'src/category/category.service';
import { Public } from '@backend/common/decorator/guest.decorator';

@UseGuards(AccessTokenGuard, RolesGuard)
@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly auditService: AuditService,
    private readonly categoryService: CategoryService,
  ) {}

  @Post()
  @Roles(UserAkses.ADMIN)
  async create(
    @Body() createProductDto: CreateProductDto,
    @User() user: any,
    @Req() req: Request,
  ): Promise<ProductEntity> {
    try {
      const category = await this.categoryService.findOne(
        createProductDto.category_id,
      );
      if (!category) {
        throw new BadRequestException('Category not found.');
      }
      const create = await this.productService.create(createProductDto);
      const productEntity = new ProductEntity(create);

      // Catat audit
      await this.auditService.create({
        Url: req.url,
        ActionName: 'Create Product',
        MenuName: 'Product',
        DataBefore: '',
        DataAfter: JSON.stringify(productEntity),
        UserName: user.name,
        IpAddress: req.ip,
        ActivityDate: new Date(),
        Browser: this.getBrowserFromUserAgent(req.headers['user-agent'] || ''),
        OS: this.getOSFromUserAgent(req.headers['user-agent'] || '', req),
        AppSource: 'Desktop',
        created_by: user.id,
        updated_by: user.id,
      });

      return productEntity;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error('Product Creation Error:', error);
      throw new BadRequestException(
        error.message || 'Failed to create product',
      );
    }
  }

  @Public()
  @Get()
  async findAll(): Promise<ProductEntity[]> {
    const roles = await this.productService.findAll();
    return transformEntity(ProductEntity, roles);
  }

  @Public()
  @Get(':id')
  async findOne(@Param() param: ParamIdDto): Promise<ProductEntity> {
    const find = await this.productService.findOne(param.id);
    if (!find) throw new BadRequestException('Product not found.');

    return new ProductEntity(find);
  }

  @Patch(':id')
  @Roles(UserAkses.ADMIN)
  async update(
    @Param() param: ParamIdDto,
    @Body() updateProductDto: UpdateProductDto,
    @User() user: any,
    @Req() req: Request,
  ): Promise<ProductEntity> {
    try {
      const existingProduct = await this.productService.findOne(param.id);
      if (!existingProduct) {
        throw new BadRequestException('Product not found.');
      }

      if (updateProductDto.category_id) {
        const category = await this.categoryService.findOne(
          updateProductDto.category_id,
        );
        if (!category) {
          throw new BadRequestException('Category not found.');
        }
      }

      const oldData = { ...existingProduct };

      const updatedProduct = await this.productService.update(
        param.id,
        updateProductDto,
      );
      const productEntity = new ProductEntity(updatedProduct);

      await this.auditService.create({
        Url: req.url,
        ActionName: 'Update Product',
        MenuName: 'Product',
        DataBefore: JSON.stringify(oldData),
        DataAfter: JSON.stringify(productEntity),
        UserName: user.name,
        IpAddress: req.ip,
        ActivityDate: new Date(),
        Browser: this.getBrowserFromUserAgent(req.headers['user-agent'] || ''),
        OS: this.getOSFromUserAgent(req.headers['user-agent'] || '', req),
        AppSource: 'Desktop',
        created_by: user.id,
        updated_by: user.id,
      });

      return productEntity;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error('Product Update Error:', error);
      throw new BadRequestException(
        error.message || 'Failed to update product',
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
      const existingProduct = await this.productService.findOne(param.id);
      if (!existingProduct) {
        throw new BadRequestException('Product not found.');
      }

      await this.productService.remove(param.id);

      await this.auditService.create({
        Url: req.url,
        ActionName: 'Delete Product',
        MenuName: 'Product',
        DataBefore: JSON.stringify(existingProduct),
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
      console.error('Product Delete Error:', error);
      throw new BadRequestException(
        error.message || 'Failed to delete product',
      );
    }
  }

  @Public()
  @Get('get/all')
  async getAll(): Promise<ProductEntity[]> {
    const products = await this.productService.getAll();
    return transformEntity(ProductEntity, products);
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
