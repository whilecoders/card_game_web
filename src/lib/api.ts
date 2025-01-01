import axios from "axios";
import { API_BASE_URL } from "./const";
import { getCookie } from "cookies-next";
import { redirect } from 'next/navigation'
import { toast } from "react-toastify";


export type ApiRespose = {
  status: boolean;
  data: any;
  message: string;
};

export const ApiCall = async (args: {
  query: string;
  variables: {
    [key: string]: unknown;
  };
  headers?: {
    [key: string]: string;
  };
}): Promise<ApiRespose> => {
  try {
    const token = getCookie('access_token')
    if (!token) {
      toast.error("You have been logout")
      redirect('/login')
    }
    // console.log(token);
    
    const req = await axios.post(
      API_BASE_URL,
      { query: args.query, variables: args.variables, },
      { headers: { ...args.headers, Authorization: token } }
    );
    if (req.data.data == null ||
      req.data.data == undefined ||
      req.data.data == "") {
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

export const ApiCallWithoutToken = async (args: {
  query: string;
  variables: {
    [key: string]: unknown;
  };
  headers?: {
    [key: string]: string;
  };
}): Promise<ApiRespose> => {
  try {
    const req = await axios.post(
      API_BASE_URL,
      { query: args.query, variables: args.variables, },
      { headers: { ...args.headers } }
    );
    if (req.data.data == null ||
      req.data.data == undefined ||
      req.data.data == "") {
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
