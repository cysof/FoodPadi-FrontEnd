// features/account/types/account.types.ts

declare interface IUpdateProfileForm {
  first_name: string;
  last_name: string;
  other_name: string | null;
  username: string;
  email: string;
  phone_number: string;
  gender: string;
  address_line: string;
  city: string;
  state: number | null;
  lga: number | null;
  country: string;
}

declare interface IUpdateProfileResponse {
  message: string;
  user: IUser;
}

declare interface IChangePasswordForm {
  old_password: string;
  new_password: string;
  confirm_new_password: string;
}

declare interface IChangePasswordInput {
  old_password: string;
  new_password: string;
}

declare interface IChangePasswordResponse {
  message: string;
}

declare interface IAccountInitialState {
  // Get profile
  getProfileLoading: boolean;
  getProfileError: string;

  // Update profile
  updateProfileLoading: boolean;
  updateProfileError: string;

  // Change password
  changePasswordLoading: boolean;
  changePasswordError: string;
}
