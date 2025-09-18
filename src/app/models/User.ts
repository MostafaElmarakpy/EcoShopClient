
export interface IUser {
    id: number;
    userName: string;
    email: string;
    token: string;
    refreshToken: string;
    // Add other user properties as needed
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
