import { SetMetadata } from '@nestjs/common';  
import { UserAkses } from '../constants/enum';

export const ROLES_KEY = 'roles';  

export const Roles = (...roles: UserAkses[]) =>   
  SetMetadata(ROLES_KEY, roles);  