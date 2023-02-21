import { apiResponse } from "@/server/dto/baseResponse";
import prisma from "@/server/prisma";
import type { Category } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

export type Data = {
  categories?: Array<Category>;
  total?: number;
} & apiResponse;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { page, size }: { page: number; size: number } = req.body;
  const categories = await prisma.category.findMany({
    orderBy: [{ id: "desc" }],
    select: {
      id: true,
      cat: true,
      createAt: true,
      updatedAt: true,
    },
    take: size ?? 10,
    skip: ((page ?? 1) - 1) * (size ?? 10),
  });
  const total = await prisma.category.count();
  if (categories) {
    res.status(200).json({
      categories,
      total,
      code: 0,
    });
  } else {
    res.status(404).send({ code: -1, msg: "error" });
  }
}
