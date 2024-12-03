import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RoleType, UserSession } from '@prisma/client';
import { IJwtConfig } from 'src/common/interfaces/config.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { hash } from 'bcrypt';
import { UserSessionDto } from './dto/user-session.dto';
 
@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  hashData(data: string): Promise<string> {
    return hash(data, 12);
  }

  async getTokens(userId: number, email: string, name: string, role: RoleType) {  
    const [access_token, refresh_token] = await Promise.all([  
      this.jwtService.signAsync(  
        {  
          sub: userId,  
          email,  
          name,  
          role  
        },  
        {  
          secret: this.configService.get('jwt.secret'),  
          expiresIn: '7d'  
        }  
      ),  
      this.jwtService.signAsync(  
        {  
          sub: userId,  
          email,  
          name,  
          role  
        },  
        {  
          secret: this.configService.get('jwt.refresh_secret'),  
          expiresIn: '7d'  
        }  
      )  
    ]);  

    return { access_token, refresh_token };  
  }  

  modifyUserSession(userSessionDto: UserSessionDto): Promise<UserSession> {
    return this.prismaService.userSession.upsert({
      where: {
        user_id_identifier: {
          user_id: userSessionDto.user_id,
          identifier: userSessionDto.identifier,
        },
      },
      create: {
        ...userSessionDto,
      },
      update: {
        ...userSessionDto,
      },
    });
  }
}
