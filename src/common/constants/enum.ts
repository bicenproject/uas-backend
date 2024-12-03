export enum RoleType {  
  SUPERVISOR = 'supervisor',  
  ADMIN = 'admin',  
  KASIR = 'kasir',  
  GUEST = 'guest',
}

export enum UserAkses {  
  ADMIN = 1,  
  KASIR = 2,  
  SUPERVISOR = 3,  
  GUEST = 4,  
}  

export enum ColumnRole {
  id = 'id',
  name = 'name',
  type = 'type',
  description = 'description',
}

export enum ColumnAudit {
  id = 'id',
  url = 'Url',
  ActionName = 'ActionName',
  MenuName = 'MenuName',
  DataBefore = 'DataBefore',
  DataAfter = 'DataAfter',
  UserName = 'UserName',
  IpAddress = 'IpAddress',
  ActivityDate = 'ActivityDate',
  Browser = 'Browser',
  OS = 'OS',
  AppSource = 'AppSource',
}

export enum ColumnUser {
  id = 'id',
  role_id = 'role_id',
  region_id = 'region_id',
  vendor_id = 'vendor_id',
  name = 'name',
  email = 'email',
  npp = 'npp',
  dob = 'dob',
  phone = 'phone',
}

export enum StockMovementType {  
  INCOMING = 'INCOMING',  
  OUTGOING = 'OUTGOING',  
  ADJUSTMENT = 'ADJUSTMENT',  
  TRANSFER = 'TRANSFER'  
}