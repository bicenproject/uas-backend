
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { UserService } from 'src/user/user.service';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IJwtConfig } from 'src/common/interfaces/config.interface';
import { RoleType } from '@backend/common/constants/enum';

type JwtPayload = {
  sub: string;
  id: number;
  name: string;
  email: string;
  role: RoleType;  
};
@Injectable()  
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {  
  constructor(  
    private readonly configService: ConfigService,  
    private readonly userService: UserService,  
  ) {  
    super({  
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),  
      secretOrKey: configService.get<IJwtConfig>('jwt').secret,  
    });  
  }  

  async validate(payload: JwtPayload) {  
    const user = await this.userService.findOne(Number(payload.sub));  

    if (!user) {  
      throw new UnauthorizedException();  
    }  

    return {  
      id: user.id,  
      email: user.email,  
      name: user.name,  
      role: user.akses?.role 
    };  
  }  
}