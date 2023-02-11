// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { apiResponse } from "@/server/dto/baseResponse";
import { getLoginUser } from "@/server/service/login";
import { User } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

export type Data = {
  name?: User;
} & apiResponse;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const login = getLoginUser(req);
  if (login) {
    res.status(200).json(login);
  }
}
