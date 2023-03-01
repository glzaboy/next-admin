import { apiResponse } from "@/server/dto/baseResponse";
import prisma from "@/server/prisma";
import type { Category, Post } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

export type Data = {
  post?: Array<Post>;
  total?: number;
} & apiResponse;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const {
    page,
    size,
    catId: categoryId,
  }: { page: number; size: number; catId?: number } = req.body;
  const post = await prisma.post.findMany({
    orderBy: [{ id: "desc" }],
    where: {
      categories: {
        some: {
          categoryId: categoryId,
        },
      },
      // categories: {},
    },
    take: size ?? 10,
    skip: ((page ?? 1) - 1) * (size ?? 10),
  });
  const total = await prisma.post.count({
    where: {
      categories: {
        some: {
          categoryId: categoryId,
        },
      },
    },
  });
  if (post) {
    res.status(200).json({
      post,
      total,
      code: 0,
    });
  } else {
    res.status(404).send({ code: -1, msg: "error" });
  }
}
