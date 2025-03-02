"use client";
import { PasswordInput } from "@/components/forms/inputfileds/passwordinput";
import { TaxtInput } from "@/components/forms/inputfileds/textinput";
// import { ApiCall, ApiCallWithoutToken } from "@/lib/api";
import { onFormError } from "@/lib/methods";
import { LoginForm, LoginSchema } from "@/schema/login";
import { poppins } from "@/utils/fonts";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { Button } from "antd";
import { getCookie, setCookie } from "cookies-next";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { ApiCall, ApiCallWihtoutToken } from "@/lib/api";
import { useRouter } from "@/i18n/routing";

export default function Page() {
  const methods = useForm<LoginForm>({
    resolver: valibotResolver(LoginSchema),
  });

  const {
    handleSubmit,
    register,
    watch,
    formState: { errors },
  } = methods;

  const router = useRouter();

  // Check if user is already login?
  useEffect(() => {
    const init = async () => {
      const userJSON = (await getCookie("user")) ?? "{}";
      const user = JSON.parse(userJSON);

      if (Object.keys(user).length > 0) {
        router.replace("/dashboard/user-management");
      }
    };

    init();
  }, []);

  const onSubmit: SubmitHandler<LoginForm> = async (data) => {
    // Api call to login user
    const response = await ApiCallWihtoutToken({
      query: `query SignInAdmin($signInCredential:SignInCredential!) {
        signInAdmin(signInCredential: $signInCredential) {
        access_token,
          refresh_token,
          user {
            id,
            email,
            phone_number
          }
        }
      }`,

      variables: {
        signInCredential: {
          username: data.username.trim(),
          password: data.password.trim(),
        },
      },
      router: router,
    });

    // check for error
    if (response.status == false) {
      toast.error(response.message);

      return;
    }

    const { access_token, refresh_token, user } = response.data.signInAdmin;

    // save in cookie
    const cookieOptions = { path: "/" };
    setCookie("access_token", access_token, cookieOptions);
    setCookie("refresh_token", refresh_token, cookieOptions);
    setCookie("user", JSON.stringify(user), cookieOptions);
    setCookie("id", user.id, cookieOptions);
    toast.success("Login Successful!");
    router.replace("/dashboard/user-management");
  };

  return (
    <div className="bg-gray-200 grid place-items-center w-full h-screen">
      <div className="bg-white p-8 rounded-md shadow-sm">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit, onFormError)}>
            <div className="flex flex-col gap-4 rounded-md w-80">
              <h2 className={`text-2xl ${poppins} text-center  font-semibold`}>
                Login
              </h2>

              <div>
                <span className="text-sm">username</span>
                <TaxtInput<LoginForm>
                  name="username"
                  placeholder="Enter Username"
                  required
                />
              </div>
              <div>
                <span className="text-sm">Password</span>
                <PasswordInput<LoginForm>
                  name="password"
                  placeholder="Enter Password"
                  required
                />
              </div>
              <div className="h-full"></div>
              <Button type="primary" htmlType="submit">
                Login
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
