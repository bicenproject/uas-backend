import { HttpException, HttpStatus } from '@nestjs/common';  

export class ForbiddenAccessException extends HttpException {  
  constructor(message: string = 'Anda tidak memiliki akses') {  
    super(  
      {  
        statusCode: HttpStatus.FORBIDDEN,  
        message: message,  
        error: 'Forbidden Access'  
      },   
      HttpStatus.FORBIDDEN  
    );  
  }  
}  