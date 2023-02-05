// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { apiResponse } from "@/server/dto/baseResponse";
import prisma from "@/server/prisma";
import { Category } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

export type Data = {
  categories?: Category[];
} & apiResponse;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // Prisma.Post;
  const categories = await prisma.category.findMany();
  if (categories) {
    console.log(categories);
    res.status(200).json({
      categories,
      code: 0,
    });
  } else {
    res.status(404).send({ code: -1, msg: "error" });
  }
}
