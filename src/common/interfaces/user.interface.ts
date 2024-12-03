import { RoleType } from "../constants/enum";

export interface AksesUser {  
    id_akses: number;  
    role: RoleType;  
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
    akses?: AksesUser | null;  
  }  