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
  var cat: Category = { ...req.body };
  if (cat.id > 0) {
    await prisma.category
      .findFirstOrThrow({ where: { id: cat.id } })
      .then((data) => {
        prisma.category
          .update({
            data: { cat: cat.cat },
            where: { id: cat.id },
          })
          .then((data) => {
            res.status(200).json({ code: 0, msg: "更新成功", category: data });
          });
      })
      .catch((err) => {
        console.error("查询出错{}" + err);
        res.status(200).json({ code: -1, msg: "" });
      });
  } else {
    var cat: Category = { ...req.body };
    console.log(cat);
    prisma.category
      .create({ data: { cat: cat.cat } })
      .then((_) => {
        res.status(200).json({ code: 0, msg: "", category: _ });
      })
      .catch((err) => {
        console.error(err);
        res.status(200).json({ code: -1, msg: "出错" + err });
      });
  }
}
