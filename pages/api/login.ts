// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { login } from "@/server/service/login";
import type { LoginParament } from "@/server/service/login";
import { signJwt } from "@/utils/password";
import { setCookie } from "@/server/utils/cookie";
import { apiResponse } from "@/server/dto/baseResponse";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<apiResponse>
) {
  const { type, userName, password } = req.body;
  const loginP: LoginParament = { user: userName, loginType: type, password };
  login(loginP)
    .then((loginUser) => {
      setCookie(
        res,
        "auth",
        signJwt({
          id: loginUser?.id,
          avatar: loginUser?.avatar,
          name: loginUser?.name,
        }),
        { path: "/", maxAge: 2592000, httpOnly: true }
      );
      res.status(200).json({ code: 0, msg: "" });
    })
    .catch((error: Error) => {
      console.error(error);
      res.status(200).json({ code: -1, msg: "失败" + error.message });
    });
}
