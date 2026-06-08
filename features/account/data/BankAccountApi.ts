//features/account/data/BankAccountApi.ts

import { FetchAPI } from "@/store/FetchAPI";

export interface ISubaccount {
  id: number;
  subaccount_code: string;
  business_name: string;
  bank_name: string;
  account_number: string;
  account_name: string;
  is_verified: boolean;
  created_at: string;
}

export interface IBank {
  id: number;
  name: string;
  code: string;
  slug: string;
}

export interface IRegisterBankInput {
  bank_code: string;
  account_number: string;
}

const BankAccountApi = FetchAPI.injectEndpoints({
  endpoints: (build) => ({
    getSubaccount: build.query<ISubaccount, void>({
      query: () => ({
        url: `payment/subaccount/`,
        method: "GET",
      }),
      providesTags: ["profile"],
    }),
    getBanks: build.query<IBank[], void>({
      query: () => ({
        url: `payment/banks/`,
        method: "GET",
      }),
    }),
    registerBankAccount: build.mutation<ISubaccount, IRegisterBankInput>({
      query: (data) => ({
        url: `payment/subaccount/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["profile"],
    }),
    deleteBankAccount: build.mutation<void, void>({
      query: () => ({
        url: `payment/subaccount/`,
        method: "DELETE",
      }),
      invalidatesTags: ["profile"],
    }),
  }),
});

export const {
  useGetSubaccountQuery,
  useGetBanksQuery,
  useRegisterBankAccountMutation,
  useDeleteBankAccountMutation,
} = BankAccountApi;