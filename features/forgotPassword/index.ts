// features/forgotPassword/index.ts

// Components
export { default as ForgotPasswordForm } from "./components/ForgotPasswordForm";

// API
export { 
  useForgotPasswordMutation,        // ← was useRequestPasswordResetMutation
  useConfirmPasswordResetMutation,
} from "./data/ForgotPasswordApi";
// Types
export type {
  IForgotPasswordInput,
  IConfirmPasswordResetInput,
  IPasswordResetResponse,
} from "./data/ForgotPasswordApi";