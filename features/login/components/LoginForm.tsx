import Image from "next/image";
import Link from "next/link";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import React from "react";

const LoginForm = () => {
  return (
    <div
      className={`border w-full flex flex-col gap-5 max-w-lg drop-shadow-md rounded-2xl py-10 px-3 md:px-10`}
    >
      <Image
        src={`/logofull.svg`}
        alt="food bank logo"
        width={400}
        height={300}
        className={`w-30 mx-auto`}
      />
      <h4 className={`text-primary text-center text-md`}>
        Buy, sell, and transport agricultural goods easily.
      </h4>
      <form className={`w-full flex flex-col gap-5 mb-5`} action="">
        <div className={`flex flex-col gap-1 w-full`}>
          <label className={`text-primary-neutral`}>Email</label>
          <InputText />
        </div>
        <div className={`flex flex-col gap-1 w-full`}>
          <label className={`text-primary-neutral`}>Password</label>
          <Password
            toggleMask={true}
            feedback={false}
            inputClassName={`w-full`}
          />
          <Link className={`text-primary self-end`} href={`/auth/register`}>
            Forgot Password?
          </Link>
        </div>
        <Button className={`flex primary justify-center`}>Login</Button>
      </form>
      <p className={`flex gap-2 items-center text-primary-neutral`}>
        New to Food Bank?{" "}
        <Link className={`text-primary`} href={`/auth/register`}>
          Sign Up
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;
