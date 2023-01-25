import type { Login, LoginType, User } from "@prisma/client";
import prisma from "../prisma";
import { encodePassword, validPassword } from "@/utils/password";
export type LoginParament = {
  user: string;
  password?: string;
  loginType: LoginType;
};
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
  console.log(login.accessPwd);
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
