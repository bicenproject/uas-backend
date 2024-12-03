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
    Query  
  } from '@nestjs/common';  
  import { Request } from 'express';  
  import { CategoryService } from './category.service';  
  import { CreateCategoryDto } from './dto/create-category.dto';  
  import { UpdateCategoryDto } from './dto/update-category.dto';  
  import { CategoryEntity } from './entities/category.entity';  
  import { transformEntity } from 'src/common/transformer/entity.transformer';  
  import { User } from 'src/common/decorator/currentuser.decorator';  
  import { AuditService } from 'src/audit/audit.service';  
  import { AccessTokenGuard } from '@backend/common/guards/access-token.guard';  
  import { RolesGuard } from '@backend/common/guards/roles.guard';  
  import { Roles } from '@backend/common/decorator/roles.decorator';  
  import { UserAkses } from '@backend/common/constants/enum';  
  import { ParamIdDto } from 'src/common/decorator/param-id.dto';  
import { Public } from '@backend/common/decorator/guest.decorator';
  
  @UseGuards(AccessTokenGuard, RolesGuard)  
  @Controller('category')  
  export class CategoryController {  
    constructor(  
      private readonly categoryService: CategoryService,  
      private readonly auditService: AuditService,  
    ) {}  
  
    @Post()  
    @Roles(UserAkses.ADMIN)  
    async create(  
      @Body() createCategoryDto: CreateCategoryDto,  
      @User() user: any,  
      @Req() req: Request,  
    ): Promise<CategoryEntity> {  
      try {  
        if (!createCategoryDto.name) {  
          throw new BadRequestException('Category name is required.');  
        }  
  
        const existingCategory = await this.categoryService.findOneBy({  
          name: createCategoryDto.name,  
        });  
  
        if (existingCategory) {  
          throw new BadRequestException('Category name already exists.');  
        }  
  
        const create = await this.categoryService.create(createCategoryDto);  
        const categoryEntity = new CategoryEntity(create);  
  
        await this.auditService.create({  
          Url: req.url,  
          ActionName: 'Create Category',  
          MenuName: 'Category',  
          DataBefore: '',  
          DataAfter: JSON.stringify(categoryEntity),  
          UserName: user.name,  
          IpAddress: req.ip,  
          ActivityDate: new Date(),  
          Browser: this.getBrowserFromUserAgent(req.headers['user-agent'] || ''),  
          OS: this.getOSFromUserAgent(req.headers['user-agent'] || '', req),  
          AppSource: 'Desktop',  
          created_by: user.id,  
          updated_by: user.id,  
        });  
  
        return categoryEntity;  
      } catch (error) {  
        console.error('Category Creation Error:', error);  
  
        if (error instanceof BadRequestException) {  
          throw error;  
        }  
  
        throw new BadRequestException(  
          error.message || 'Failed to create category',  
        );  
      }  
    }  
  
    @Public()
    @Get()  
    async findAll(): Promise<CategoryEntity[]> {  
      const products = await this.categoryService.findAll();  
      return transformEntity(CategoryEntity, products);  
    }  
  
    @Get(':id')  
    async findOne(@Param() param: ParamIdDto): Promise<CategoryEntity> {  
      const find = await this.categoryService.findOne(param.id);  
      if (!find) throw new BadRequestException('Category not found.');  
  
      return new CategoryEntity(find);  
    }  
  
    @Patch(':id')  
    @Roles(UserAkses.ADMIN)  
    async update(  
      @Param() param: ParamIdDto,  
      @Body() updateCategoryDto: UpdateCategoryDto,  
      @User() user: any,  
      @Req() req: Request,  
    ): Promise<CategoryEntity> {  
      const existingCategory = await this.categoryService.findOne(param.id);  
      if (!existingCategory) {  
        throw new BadRequestException('Category not found.');  
      }  
  
      if (updateCategoryDto.name) {  
        const findExistName = await this.categoryService.findOneBy({  
          name: updateCategoryDto.name,  
        });  
        if (findExistName && findExistName.id !== existingCategory.id) {  
          throw new BadRequestException('Category name already exists.');  
        }  
      }  
  
      const oldData = { ...existingCategory };  
  
      const updatedCategory = await this.categoryService.update(  
        param.id,  
        updateCategoryDto  
      );  
      const categoryEntity = new CategoryEntity(updatedCategory);  
  
      await this.auditService.create({  
        Url: req.url,  
        ActionName: 'Update Category',  
        MenuName: 'Category',  
        DataBefore: JSON.stringify(oldData),  
        DataAfter: JSON.stringify(categoryEntity),  
        UserName: user.name,  
        IpAddress: req.ip,  
        ActivityDate: new Date(),  
        Browser: this.getBrowserFromUserAgent(req.headers['user-agent'] || ''),  
        OS: this.getOSFromUserAgent(req.headers['user-agent'] || '', req),  
        AppSource: 'Desktop',  
        created_by: user.id,  
        updated_by: user.id,  
      });  
  
      return categoryEntity;  
    }  
  
    @Delete(':id')  
    @Roles(UserAkses.ADMIN)  
    async remove(  
      @Param() param: ParamIdDto,  
      @User() user: any,  
      @Req() req: Request,  
    ): Promise<null> {  
      // Cek kategori yang akan dihapus  
      const existingCategory = await this.categoryService.findOne(param.id);  
      if (!existingCategory) {  
        throw new BadRequestException('Category not found.');  
      }  
  
 
      await this.categoryService.remove(param.id);  
  
      // Audit log  
      await this.auditService.create({  
        Url: req.url,  
        ActionName: 'Delete Category',  
        MenuName: 'Category',  
        DataBefore: JSON.stringify(existingCategory),  
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