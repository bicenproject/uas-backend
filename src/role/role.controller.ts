// role.controller.ts
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ParamIdDto } from 'src/common/decorator/param-id.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleEntity } from './entities/role.entity';
import { RoleService } from './role.service';
import { AccessTokenGuard } from 'src/common/guards/access-token.guard';
import { Prisma } from '@prisma/client';
import { User } from 'src/common/decorator/currentuser.decorator';
import { AuditService } from 'src/audit/audit.service';
import { Request } from 'express';
import { transformEntity } from 'src/common/transformer/entity.transformer';
import { Roles } from 'src/common/decorator/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UserAkses } from '@backend/common/constants/enum';

@UseGuards(AccessTokenGuard, RolesGuard)
@Controller('role')
@Roles(UserAkses.ADMIN)
export class RoleController {
  constructor(
    private readonly roleService: RoleService,
    private readonly auditService: AuditService,
  ) {}

  @Post()
  async create(
    @Body() createRoleDto: CreateRoleDto,
    @User() user: any,
    @Req() req: Request,
  ): Promise<RoleEntity> {
    try {
      const role = await this.roleService.create(createRoleDto);

      await this.auditService.create({
        Url: req.url,
        ActionName: 'Create Role',
        MenuName: 'Role',
        DataBefore: '',
        DataAfter: JSON.stringify(role),
        UserName: user.name,
        IpAddress: req.ip,
        ActivityDate: new Date(),
        Browser: this.getBrowserFromUserAgent(req.headers['user-agent'] || ''),
        OS: this.getOSFromUserAgent(req.headers['user-agent'] || '', req),
        AppSource: 'Desktop',
        created_by: user.id,
        updated_by: user.id,
      });

      
      return new RoleEntity(role);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(
            'Role with this name or code already exists',
          );
        }
      }
      throw new InternalServerErrorException('Failed to create role');
    }
  }

  @Get()  
  async findAll(): Promise<RoleEntity[]> {  
    const roles = await this.roleService.findAll();  
    return transformEntity(RoleEntity, roles);  
  }  

  @Get(':id_akses')
  async findOne(@Param() param: ParamIdDto): Promise<RoleEntity> {
    const find = await this.roleService.findOne(param.id);
    if (!find) throw new BadRequestException('Data not found');

    return new RoleEntity(find);
  }

  @Patch(':id_akses')
  async update(
    @Param() param: ParamIdDto,
    @Body() updateRoleDto: UpdateRoleDto,
    @User() user: any,
    @Req() req: Request,
  ): Promise<RoleEntity> {
    const oldData = await this.roleService.findOne(Number(param.id));
    
    const find = await this.roleService.findOne(+param.id);
    if (!find) throw new BadRequestException('Data not found.');

    const findExistCode = await this.roleService.findOneBy({
      code: updateRoleDto.code,
    });
    if (findExistCode && findExistCode.id_akses != find.id_akses)
      throw new BadRequestException('Code already exist.');

    const data = await this.roleService.update(+param.id, updateRoleDto);

    await this.auditService.create({
      Url: req.url,
      ActionName: 'Update Role',
      MenuName: 'Role',
      DataBefore: JSON.stringify(oldData),
      DataAfter: JSON.stringify(data),
      UserName: user.name,
      IpAddress: req.ip,
      ActivityDate: new Date(),
      Browser: this.getBrowserFromUserAgent(req.headers['user-agent'] || ''),
      OS: this.getOSFromUserAgent(req.headers['user-agent'] || '', req),
      AppSource: 'Desktop',
      created_by: user.id,
      updated_by: user.id,
    });


    return new RoleEntity(data);
  }

  @Delete(':id_akses')
  async remove(@Param() param: ParamIdDto, @User() user: any,
  @Req() req: Request,): Promise<null> {
    const find = await this.roleService.findOne(+param.id);
    if (!find) throw new BadRequestException('Data not found.');

    const oldData = await this.roleService.findOne(Number(param.id));

    await this.auditService.create({
      Url: req.url,
      ActionName: 'Delete Role',
      MenuName: 'Role',
      DataBefore: JSON.stringify(oldData),
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

    return await this.roleService.remove(+param.id);
  }

  private getBrowserFromUserAgent(userAgent: string): string {
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    return 'Unknown';
  }

  private getOSFromUserAgent(userAgent: string, request: Request): string {
    const testOS = request.headers['x-test-os'];
    if (/PostmanRuntime/i.test(userAgent))
      return 'Postman (Testing Environment)';
    if (testOS) return testOS as string;
    if (userAgent.includes('Win')) return 'Windows';
    if (userAgent.includes('Mac')) return 'MacOS';
    if (userAgent.includes('Linux')) return 'Linux';
    return 'Unknown';
  }
}
