// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { login } from "@/server/service/login";
import type { LoginParament } from "@/server/service/login";
export type Data = {
  msg: string;
  status: string;
};
import { signJwt } from "@/utils/password";
import { setCookie } from "@/server/utils/cookie";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { loginType, userName, password } = req.body;
  const loginP: LoginParament = { user: userName, loginType, password };
  const loginUser = await login(loginP);
  if (loginUser != null) {
    setCookie(
      res,
      "auth",
      signJwt({
        id: loginUser?.id,
        avatar: loginUser?.avatar,
        name: loginUser?.name,
      }),
      { path: "/", maxAge: 2592000 }
    );
    res.status(200).json({ status: "ok", msg: "" });
  } else {
    res.status(200).json({ status: "fail", msg: "登录失败" });
  }
}
