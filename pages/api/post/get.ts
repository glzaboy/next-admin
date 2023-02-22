// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { apiResponse } from "@/server/dto/baseResponse";
import prisma from "@/server/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export type Data = {
  title?: string;
  content?: string;
  id?: number;
} & apiResponse;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // Prisma.Post;
  const { id } = req.query;
  if (typeof id == "string") {
    const post = await prisma.post.findUnique({
      where: { id: parseInt(id) },
      select: {
        title: true,
        postContent: { select: { content: true } },
        id: true,
      },
    });
    if (post) {
      res.status(200).json({
        title: post?.title,
        content: post?.postContent?.content,
        id: post?.id ? parseInt(post.id.toString()) : undefined,
        code: 0,
      });
    } else {
      res.status(404).send({ code: -1, msg: "error" });
    }
  } else {
    res.status(404).send({ code: -1, msg: "error" });
  }
}
