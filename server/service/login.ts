import type { Login, LoginType, User } from "@prisma/client";
import prisma from "../prisma";
import { encodePassword, validPassword, verifyJwt } from "@/utils/password";
export type LoginParament = {
  user: string;
  password?: string;
  loginType: LoginType;
};
import type { NextApiRequest, NextApiResponse } from "next";
import type { NextRequest } from "next/server";
import type { apiResponse } from "@/server/dto/baseResponse";
export const login = (input: LoginParament) => {
  // switch(input.loginType){
  //     case:LoginType.PASSWORD
  return loginPassword(input);
  //     break;

  // }
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
    const verify: any = verifyJwt(cookieStr);
    if (verify) {
      ret.login = true;
      ret.code = 0;
      ret.user = { ...verify };
      return ret;
    }
  }
  ret.login = false;
  ret.user = { id: -1, name: "guest", avatar: "" };
  if (_res && !!!ret.login) {
    _res.redirect("/login");
  }
  return ret;
};
