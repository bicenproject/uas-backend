import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IJwtConfig } from 'src/common/interfaces/config.interface';
import { UserService } from '@backend/user/user.service';

@Injectable()  
export class RefreshTokenStrategy extends PassportStrategy(  
  Strategy,  
  'jwt-refresh',  
) {  
  constructor(  
    private readonly configService: ConfigService,  
    private readonly userService: UserService 
  ) {  
    super({  
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),  
      secretOrKey: configService.get<IJwtConfig>('jwt').refresh_secret,  
      passReqToCallback: true,  
    });  
  }  

  async validate(req: Request, payload: any) {  
     console.log('Refresh Token Payload:', payload);  
    console.log('Request Headers:', req.headers);  

    const refreshToken = req.get('Authorization')?.replace('Bearer', '').trim();  
     const user = await this.userService.findOne(Number(payload.sub));  
    if (!user) {  
      throw new UnauthorizedException('User not found');  
    }  

    return {   
      ...payload,   
      refreshToken,  
      name: user.name,  
      email: user.email,
      role: user.akses?.role 
    };  
  }  
}