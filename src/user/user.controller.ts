import {  
  Controller,  
  Get,  
  Post,  
  Body,  
  Patch,  
  Param,  
  Delete,  
  BadRequestException,  
  UseGuards,  
  Req,  
} from '@nestjs/common';  
import { UserService } from './user.service';  
import { CreateUserDto } from './dto/create-user.dto';  
import { UpdateUserDto } from './dto/update-user.dto';  
import { UserEntity } from './entities/user.entity';  
import { RoleService } from 'src/role/role.service';  
import { ParamIdDto } from 'src/common/decorator/param-id.dto';  
import { transformEntity } from 'src/common/transformer/entity.transformer';  
import { AccessTokenGuard } from 'src/common/guards/access-token.guard';  
import { AuditService } from 'src/audit/audit.service';  
import { User } from 'src/common/decorator/currentuser.decorator';  
import { Request } from 'express';  
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { UserAkses } from '@backend/common/constants/enum';

@UseGuards(AccessTokenGuard, RolesGuard)  
@Controller('user')  
export class UserController {  
  constructor(  
    private readonly userService: UserService,  
    private readonly roleService: RoleService,  
    private readonly auditService: AuditService,  
  ) {}  

  @Post()  
  @Roles(UserAkses.ADMIN)
  async create(  
    @Body() createUserDto: CreateUserDto,  
    @User() user: any,  
    @Req() req: Request,  
  ): Promise<UserEntity> {  
    const findRole = await this.roleService.findOne(createUserDto.akses_user_id);  
    if (!findRole) throw new BadRequestException('Role not found.');  

    delete createUserDto.password_confirmation;
    const data = await this.userService.create(createUserDto);  

    await this.auditService.create({  
      Url: req.url,  
      ActionName: 'Create User',  
      MenuName: 'User',  
      DataBefore: '',  
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

    return transformEntity(UserEntity, data);  
  }  

  @Get()  
  @Roles(UserAkses.ADMIN)
  async findAll(): Promise<UserEntity[]> {  
    const data = await this.userService.findAll();
    return transformEntity(UserEntity, data);
  }  

  @Get(':id')  
  async findOne(@Param() param: ParamIdDto): Promise<UserEntity> {  
    const find = await this.userService.findOne(param.id);  
    if (!find) throw new BadRequestException('Data not found.');  

    return new UserEntity(find);  
  }  

  @Patch(':id')  
  async update(  
    @Param() param: ParamIdDto,  
    @Body() updateUserDto: UpdateUserDto,  
    @User() user: any,  
    @Req() req: Request,  
  ): Promise<UserEntity> {  
    const find = await this.userService.findOne(param.id);  
    if (!find) throw new BadRequestException('Data not found.');  

    const findRole = await this.roleService.findOne(updateUserDto.akses_user_id);  
    if (!findRole) throw new BadRequestException('Role not found.');  

    const findExistEmail = await this.userService.findByEmail(updateUserDto.email);  
    if (updateUserDto.email && findExistEmail && findExistEmail.id != find.id)  
      throw new BadRequestException('Email already exists.');  

    delete updateUserDto.password_confirmation; 
    const data = await this.userService.update(param.id, updateUserDto);  

    await this.auditService.create({  
      Url: req.url,  
      ActionName: 'Update User',  
      MenuName: 'User',  
      DataBefore: JSON.stringify(find),  
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

    return transformEntity(UserEntity, data);  
  }  

  @Delete(':id')  
  async remove(@Param() param: ParamIdDto, @User() user: any, @Req() req: Request): Promise<null> {  
    const find = await this.userService.findOne(param.id);  
    if (!find) throw new BadRequestException('Data not found');  

    await this.auditService.create({  
      Url: req.url,  
      ActionName: 'Delete User',  
      MenuName: 'User',  
      DataBefore: JSON.stringify(find),  
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

    return this.userService.remove(param.id);  
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