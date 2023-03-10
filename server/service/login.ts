import { Login, LoginType, User } from "@prisma/client";
import prisma from "../prisma";
import { validPassword, verifyJwt } from "@/utils/password";
export type LoginParament = {
  user: string;
  password?: string;
  loginType: LoginType;
};
import type { NextApiRequest, NextApiResponse } from "next";
import type { apiResponse } from "@/server/dto/baseResponse";
export const login = (input: LoginParament): Promise<User | null> => {
  if (input.loginType == LoginType.PASSWORD) {
    return loginPassword(input);
  }
  return Promise.reject("不支持的登录");
};

const loginPassword = async (input: LoginParament): Promise<User | null> => {
  const login = await prisma?.login.findFirst({
    where: { accessName: input.user, type: "PASSWORD" },
  });
  if (!login) {
    throw new Error("登录失败");
  }
  if (validPassword(input.password || "", login.accessPwd || "")) {
    return await getUser(login.userId);
  }
  throw new Error("登录失败");
};

const getUser = async (userId: number): Promise<User | null> => {
  const login = await prisma?.user.findUnique({
    where: { id: userId },
  });
  if (login != null) {
    return login;
  } else {
    return null;
  }
};

export type loginCheckResult = {
  login: boolean;
  user: User | null;
} & apiResponse;

/**
 * 获取用户登录信息
 * 此方法只能用于服务端
 * @param req
 * @param _res
 * @returns
 */
export const getLoginUser = (
  req: NextApiRequest,
  _res?: NextApiResponse
): loginCheckResult => {
  var ret: loginCheckResult = { login: false, user: null };
  const cookieStr = req.cookies["auth"] ?? "";
  if (cookieStr != null && cookieStr != undefined && cookieStr.length > 0) {
    try {
      const verify: any = verifyJwt(cookieStr);
      if (verify) {
        ret.login = true;
        ret.code = 0;
        ret.user = { ...verify };
        return ret;
      }
    } catch (err) {
      console.error(err);
      ret.login = false;
      ret.user = {
        id: -1,
        name: "guest",
        avatar: "",
        createAt: new Date(),
        updatedAt: new Date(),
      };
    }
  }
  ret.login = false;
  ret.user = {
    id: -1,
    name: "guest",
    avatar: "",
    createAt: new Date(),
    updatedAt: new Date(),
  };
  if (_res && !!!ret.login) {
    _res.redirect("/login");
  }
  return ret;
};
