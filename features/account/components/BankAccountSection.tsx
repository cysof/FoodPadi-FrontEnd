//features/account/components/BankAccountSection.tsx

"use client";

import { useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Skeleton } from "primereact/skeleton";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { enqueueSnackbar } from "notistack";
import {
  useGetSubaccountQuery,
  useGetBanksQuery,
  useRegisterBankAccountMutation,
  useDeleteBankAccountMutation,
  IBank,
} from "../data/BankAccountApi";

const BankAccountSection = () => {
  const [selectedBank, setSelectedBank] = useState<IBank | null>(null);
  const [accountNumber, setAccountNumber] = useState("");

  const { data: subaccount, isLoading: loadingSubaccount } = useGetSubaccountQuery();
  const { data: banks, isLoading: loadingBanks } = useGetBanksQuery();
  const [registerBank, { isLoading: registering }] = useRegisterBankAccountMutation();
  const [deleteBank, { isLoading: deleting }] = useDeleteBankAccountMutation();

  const handleRegister = async () => {
    if (!selectedBank) {
      enqueueSnackbar("Please select a bank", { variant: "error" });
      return;
    }
    if (accountNumber.length !== 10) {
      enqueueSnackbar("Account number must be 10 digits", { variant: "error" });
      return;
    }

    try {
      await registerBank({
        bank_code: selectedBank.code,
        account_number: accountNumber,
      }).unwrap();
      enqueueSnackbar("Bank account registered successfully!", { variant: "success" });
      setSelectedBank(null);
      setAccountNumber("");
    } catch (error: any) {
      enqueueSnackbar(
        error?.data?.detail || error?.data?.non_field_errors?.[0] || "Failed to register bank account",
        { variant: "error" }
      );
    }
  };

  const handleDelete = () => {
    confirmDialog({
      message: "Are you sure you want to remove your bank account?",
      header: "Remove Bank Account",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      acceptLabel: "Yes, Remove",
      rejectLabel: "Cancel",
      accept: async () => {
        try {
          await deleteBank().unwrap();
          enqueueSnackbar("Bank account removed successfully", { variant: "success" });
        } catch (error: any) {
          enqueueSnackbar(
            error?.data?.detail || "Failed to remove bank account",
            { variant: "error" }
          );
        }
      },
    });
  };

  if (loadingSubaccount) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton width="100%" height="80px" />
        <Skeleton width="100%" height="50px" />
      </div>
    );
  }

  // Already has subaccount — show details
  if (subaccount) {
    return (
      <div className="flex flex-col gap-6">
        <ConfirmDialog />
        <div className="flex flex-col gap-1">
          <h3 className="font-square font-bold text-lg text-primary-black">
            Bank Account
          </h3>
          <p className="font-inter text-sm text-gray-500">
            Your bank account for receiving payments.
          </p>
        </div>

        <div className="flex flex-col gap-4 p-5 rounded-2xl border border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <i className="pi pi-check-circle text-green-500" />
            </div>
            <div>
              <p className="font-square font-medium text-primary-black">
                {subaccount.bank_name}
              </p>
              <p className="font-inter text-sm text-gray-500">
                Verified Account
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <p className="font-inter text-xs text-gray-400">Account Name</p>
              <p className="font-inter text-sm font-medium text-primary-black">
                {subaccount.account_name}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="font-inter text-xs text-gray-400">Account Number</p>
              <p className="font-inter text-sm font-medium text-primary-black">
                {subaccount.account_number}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="font-inter text-xs text-gray-400">Business Name</p>
              <p className="font-inter text-sm font-medium text-primary-black">
                {subaccount.business_name}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="font-inter text-xs text-gray-400">Status</p>
              <span className="text-xs text-white px-3 py-1 rounded-full bg-green-500 w-max">
                Verified
              </span>
            </div>
          </div>

          <Button
            label="Remove Bank Account"
            icon="pi pi-trash"
            className="p-button-outlined p-button-danger w-max"
            loading={deleting}
            onClick={handleDelete}
          />
        </div>
      </div>
    );
  }

  // No subaccount — show registration form
  return (
    <div className="flex flex-col gap-6">
      <ConfirmDialog />
      <div className="flex flex-col gap-1">
        <h3 className="font-square font-bold text-lg text-primary-black">
          Bank Account
        </h3>
        <p className="font-inter text-sm text-gray-500">
          Add your bank account to receive payments from orders.
        </p>
      </div>

      <div className="flex flex-col gap-4 p-5 rounded-2xl border border-yellow-200 bg-yellow-50">
        <div className="flex items-center gap-2">
          <i className="pi pi-exclamation-triangle text-yellow-500" />
          <p className="font-inter text-sm text-yellow-700">
            You need to add a bank account to receive payments.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="font-square font-medium text-primary-black">
            Select Bank
          </label>
          <Dropdown
            value={selectedBank}
            options={banks || []}
            onChange={(e) => setSelectedBank(e.value)}
            optionLabel="name"
            placeholder={loadingBanks ? "Loading banks..." : "Select your bank"}
            className="w-full"
            filter
            filterPlaceholder="Search bank..."
            disabled={loadingBanks}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-square font-medium text-primary-black">
            Account Number
          </label>
          <InputText
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            placeholder="Enter 10-digit account number"
            maxLength={10}
            keyfilter="int"
            className="w-full"
          />
          <small className="text-gray-400 font-inter">
            {accountNumber.length}/10 digits
          </small>
        </div>

        <Button
          label={registering ? "Verifying & Registering..." : "Register Bank Account"}
          icon="pi pi-bank"
          className="primary w-max"
          loading={registering}
          onClick={handleRegister}
          disabled={!selectedBank || accountNumber.length !== 10}
        />
      </div>
    </div>
  );
};

export default BankAccountSection;