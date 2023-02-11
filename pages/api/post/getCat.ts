// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { apiResponse } from "@/server/dto/baseResponse";
import prisma from "@/server/prisma";
import { CategoriesOnPosts, Category, Post } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
// type posts = Array<{ post: Post }>;
type category = { post: Post };
export type apiCategory = {
  posts: category[];
  // posts: posts;
} & Category;

export type Data = {
  categories?: Array<apiCategory>;
} & apiResponse;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      cat: true,
      createAt: true,
      updatedAt: true,
      posts: { select: { post: true } },
    },
  });
  if (categories) {
    res.status(200).json({
      categories,
      code: 0,
    });
  } else {
    res.status(404).send({ code: -1, msg: "error" });
  }
}
