declare interface IRegisterForm {
  account_type: string;
  username: string;
  first_name: string;
  last_name: string;
  other_name: string;
  gender: string;
  phone_number: string;
  email: string;
  address_line: string;  // was "address" — backend field is address_line
  city: string;
  state: number | null;  // was string — backend expects an ID (integer FK)
  lga: number | null;    // was optional — make it required to match backend
  country: string;
  password: string;
  password_confirm: string;
}

declare interface RegisterInitialState {
  registerLoading: boolean;
  registerError: string;
}