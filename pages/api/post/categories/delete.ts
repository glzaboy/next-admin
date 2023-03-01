import { apiResponse } from "@/server/dto/baseResponse";
import prisma from "@/server/prisma";
import type { Category } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

export type Data = {
  category?: Category;
} & apiResponse;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  console.log(req.body);
  var { id }: { id: number } = { ...req.body };
  if (id > 0) {
    await prisma.category
      .delete({ where: { id: id } })
      .then((data) => {
        res.status(200).json({ code: 0, msg: "更新成功", category: data });
      })
      .catch((err) => {
        console.error("查询出错{}" + err);
        res
          .status(200)
          .json({ code: -1, msg: "删除失败：可能可能有内容无法删除" });
      });
  } else {
    res.status(200).json({ code: -1, msg: "出错类目不存在" });
  }
}
