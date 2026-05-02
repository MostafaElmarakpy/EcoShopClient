export interface IUser {
    id: string;
    displayName: string;
    userName: string;
    email: string;
    token?: string;
    isActive?: boolean;
    refreshToken?: string;
    roles?: string[];
}

export interface IRegister {
  name: string;
  email: string;
  password: string;
  rePassword: string;
}

export interface ILogin {
  email: string;
  password: string;
}

