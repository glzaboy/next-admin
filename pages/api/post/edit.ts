// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { apiResponse } from "@/server/dto/baseResponse";
import prisma from "@/server/prisma";
import { getLoginUser } from "@/server/service/login";
import type { NextApiRequest, NextApiResponse } from "next";
import type { CategoriesOnPosts } from "@prisma/client";

export type Data = {
  id?: number;
} & apiResponse;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // Prisma.Post;
  const user = getLoginUser(req, res);

  const {
    id,
    categoryId,
    content,
    title,
  }: { id?: number; categoryId?: number[]; content: string; title: string } =
    req.body;
  console.log(req.body);
  console.log(typeof categoryId);
  if (id) {
    prisma.$transaction(async (tx) => {
      const post = await tx.post.update({
        where: { id: id },
        data: {
          title: title,
          author: { connect: { id: user.user?.id || 0 } },
          postContent: { update: { content: content } },
        },
      });
      console.log("delete");
      await tx.categoriesOnPosts.deleteMany({
        where: {
          postId: id,
        },
      });
      console.log("delete end");
      const catMap: Array<CategoriesOnPosts> = [];
      categoryId?.forEach((item, index) => {
        console.log(item);
        catMap.push({
          postId: post.id,
          categoryId: item,
          assignedAt: new Date(),
        });
      });
      await tx.categoriesOnPosts.createMany({
        data: catMap,
      });
      console.log("create end");
      res.status(200).send({ code: 0, msg: "处理成功" });
    });
  } else {
    prisma.$transaction(async (tx) => {
      const post = await tx.post.create({
        data: {
          title: title,
          authorId: user.user?.id || 0,
          postContent: { create: { content: content } },
        },
      });
      if (!post) {
        throw new Error("create error");
      }
      await tx.categoriesOnPosts.deleteMany({
        where: {
          postId: post.id,
        },
      });
      const catMap: Array<CategoriesOnPosts> = [];
      categoryId?.forEach((item, index) => {
        console.log(item);
        catMap.push({
          postId: post.id,
          categoryId: item,
          assignedAt: new Date(),
        });
      });
      console.log(catMap);
      await tx.categoriesOnPosts.createMany({
        data: catMap,
      });
      res.status(200).send({ code: 0, msg: "处理成功" });
    });
  }
}
