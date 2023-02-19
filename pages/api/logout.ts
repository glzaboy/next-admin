// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { apiResponse } from "@/server/dto/baseResponse";
import { deleteCookie } from "@/server/utils/cookie";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<apiResponse>
) {
  deleteCookie(res, "auth", { path: "/", httpOnly: true });
  res.send({ code: 0, msg: "ok" });
}
