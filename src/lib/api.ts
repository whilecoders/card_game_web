import axios from "axios";
import { API_BASE_URL } from "./const";
import { getCookie, setCookie } from "cookies-next";
import { redirect } from "next/navigation";
import { toast } from "react-toastify";

export type ApiRespose = {
  status: boolean;
  data: any;
  message: string;
};

type argPayloadWithoutToken = {
  query: string;
  variables: {
    [key: string]: unknown;
  };
  headers?: {
    [key: string]: string;
  };
};

export const ApiCallWihtoutToken = async (
  args: argPayloadWithoutToken
): Promise<ApiRespose> => {
  try {
    const req = await axios.post(
      API_BASE_URL,
      { query: args.query, variables: args.variables },
      { headers: { ...args.headers } }
    );
    if (
      req.data.data == null ||
      req.data.data == undefined ||
      req.data.data == ""
    ) {
      if (
        req.data.errors[0].extensions.originalError == undefined ||
        req.data.errors[0].extensions.originalError == null
      )
        return { status: false, data: [], message: req.data.errors[0].message };
      const errorMessage = Array.isArray(
        req.data.errors[0].extensions.originalError.message
      )
        ? req.data.errors[0].extensions.originalError.message[0]
        : req.data.errors[0].extensions.originalError.message;
      return { status: false, data: [], message: errorMessage };
    }

    return { status: true, data: req.data.data, message: "" };
  } catch (e: unknown) {
    if (e instanceof Error) {
      return { status: false, data: [], message: e.toString() };
    } else {
      return { status: false, data: [], message: "Unknown error" };
    }
  }
};

const ApiCallWithToken = async (
  args: argPayloadWithoutToken & { token: string }
): Promise<ApiRespose> => {
  try {
    const req = await axios.post(
      API_BASE_URL,
      { query: args.query, variables: args.variables },
      { headers: { ...args.headers } }
    );
    if (
      req.data.data == null ||
      req.data.data == undefined ||
      req.data.data == ""
    ) {
      if (
        req.data.errors[0].extensions.originalError == undefined ||
        req.data.errors[0].extensions.originalError == null
      )
        return { status: false, data: [], message: req.data.errors[0].message };
      const errorMessage = Array.isArray(
        req.data.errors[0].extensions.originalError.message
      )
        ? req.data.errors[0].extensions.originalError.message[0]
        : req.data.errors[0].extensions.originalError.message;
      return { status: false, data: [], message: errorMessage };
    }

    return { status: true, data: req.data.data, message: "" };
  } catch (e: unknown) {
    if (e instanceof Error) {
      return { status: false, data: [], message: e.toString() };
    } else {
      return { status: false, data: [], message: "Unknown error" };
    }
  }
};

// export const ApiCall = async (args: {
//   query: string;
//   variables: {
//     [key: string]: unknown;
//   };
//   headers?: {
//     [key: string]: string;
//   };
// }): Promise<ApiRespose> => {
//   try {
//     const token = getCookie("access_token");
//     if (!token) {
//       //   toast.error("You have been logout");
//       redirect("/login");
//     }
//     const req = await axios.post(
//       API_BASE_URL,
//       { query: args.query, variables: args.variables },
//       { headers: { ...args.headers, Authorization: token } }
//     );
//     if (
//       req.data.data == null ||
//       req.data.data == undefined ||
//       req.data.data == ""
//     ) {
//       if (
//         req.data.errors[0].extensions.originalError == undefined ||
//         req.data.errors[0].extensions.originalError == null
//       )
//         return { status: false, data: [], message: req.data.errors[0].message };
//       const errorMessage = Array.isArray(
//         req.data.errors[0].extensions.originalError.message
//       )
//         ? req.data.errors[0].extensions.originalError.message[0]
//         : req.data.errors[0].extensions.originalError.message;
//       return { status: false, data: [], message: errorMessage };
//     }

//     return { status: true, data: req.data.data, message: "" };
//   } catch (e: unknown) {
//     if (e instanceof Error) {
//       return { status: false, data: [], message: e.toString() };
//     } else {
//       return { status: false, data: [], message: "Unknown error" };
//     }
//   }
// };

// export const ApiCall = async (args: {
//   query: string;
//   variables: {
//     [key: string]: unknown;
//   };
//   headers?: {
//     [key: string]: string;
//   };
// }): Promise<ApiRespose> => {
//   const token = getCookie("access_token");
//   if (!token) {
//     toast.error("You have been logout");
//     redirect("/login");
//   }

//   const api_response = await ApiCallBase({
//     query: args.query,
//     variables: args.variables,
//     headers: { ...args.headers },
//   });

//   return api_response;
// };

// 1---------------- login signin
// 2---------------- other apis

export async function ApiCall(args: argPayloadWithoutToken) {
  // step 1: Get access token
  const token = getCookie("access_token");
  const refresh_token = getCookie("refresh_token");

  // step 2: if not exist redirect to login
  if (!token) {
    redirect("/login");
  }

  // step 3: make api call with access token
  const response = await ApiCallWithToken({ ...args, token: token });

  // step 4: if token expires revalidate token (request for new token)
  if (
    response.message != "Invalid token payload" &&
    response.message != "'Error verifying token'"
  ) {
    return response;
  }

  if (!refresh_token) {
    redirect("/login");
  }
  const validateRefreshTokenResponse = await ApiCallWihtoutToken({
    query: `mutation Mutation($refreshToken: String!, $token: String!) {
  refreshAccessToken(refreshToken: $refreshToken, token: $token) {
  access_token,
  refresh_token  
  }
}`,
    variables: { refreshToken: refresh_token, token: token },
    headers: args.headers,
  });

  // step 5: if step 4 fail redirect to login
  if (!validateRefreshTokenResponse.data) redirect("/login");

  // step 6: if step 4 success save new token (refresh and access) on client
  const cookieOptions = { path: "/" };
  setCookie(
    "access_token",
    validateRefreshTokenResponse.data.access_token,
    cookieOptions
  );
  setCookie(
    "refresh_token",
    validateRefreshTokenResponse.data.refresh_token,
    cookieOptions
  );

  // step 7: Make api call with new token
  const revalidatedResponse = await ApiCallWithToken({ ...args, token: token });

  if (
    revalidatedResponse.message != "Invalid token payload" &&
    revalidatedResponse.message != "'Error verifying token'"
  ) {
    return revalidatedResponse;
  }

  redirect("/login");
}
