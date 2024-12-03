import { Expose } from 'class-transformer';

export class SigninEntity {
  constructor(partial: Partial<SigninEntity>) {
    Object.assign(this, partial);
  }
  @Expose()
  access_token: string;
  @Expose()
  refresh_token: string;
}

export interface AksesUser {  
  id_akses: number;  
  role: 'ADMIN' | 'SUPERVISOR' | 'USER';  
  code: string;  
  created_by: number | null;  
  updated_by: number | null;  
  created_at: Date;  
  updated_at: Date;  
  deleted_at: Date | null;  
}  

export interface User {  
  id: number;  
  akses_user_id: number | null;  
  name: string;  
  email: string;  
  password: string;  
  dob: Date | null;  
  phone: string | null;  
  created_by: number | null;  
  updated_by: number | null;  
  created_at: Date;  
  updated_at: Date;  
  deleted_at: Date | null;  
  akses?: AksesUser; // Relasi dengan akses_user  
}  