declare interface IRegisterForm {
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
  password: string;
  password_confirm: string;
}

declare interface RegisterInitialState {
  registerLoading: boolean;
  registerError: string;
}
