declare interface ILoginForm {
  phone_number: string;
  password: string;
}

declare interface ILoginResponse {
  user: IUser;
  refresh: string;
  access: string;
}

declare interface LoginInitialState {
  loginLoading: boolean;
  loginError: string;
  user: IUser;
  token: IToken;
}

declare interface IUser {
  id: number;
  account_type: string;
  username: string;
  first_name: string;
  last_name: string;
  other_name: string;
  gender: string;
  phone_number: string;
  email: string;
  address: string;
  city: string;
  state: string;
  country: string;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
}

declare interface IToken {
  refresh: string;
  access: string;
}
