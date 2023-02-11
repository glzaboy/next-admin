import { useAppSelector } from "@/modules/store";
import { selectGlobal } from "@/modules/global";
import { LayoutNoMemu } from "@/components/Layout";
import { Button, Typography } from "@arco-design/web-react";
import { Calendar } from "@arco-design/web-react";
import Head from "next/head";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import type { Data } from "@/pages/api/post/get";
import { request } from "@/utils/request";

export default function Index({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const globalState = useAppSelector(selectGlobal);
  return (
    <>
      <Head>
        <link
          rel="shortcut icon"
          type="image/x-icon"
          href="https://unpkg.byted-static.com/latest/byted/arco-config/assets/favicon.ico"
        />
        <title>{data?.title}</title>
      </Head>
      <Typography.Title>{data?.title}</Typography.Title>
      <div
        dangerouslySetInnerHTML={{ __html: data?.content ?? "无内容" }}
      ></div>
    </>
  );
}

Index.Layout = LayoutNoMemu;
export const getServerSideProps: GetServerSideProps<{
  data?: Data;
}> = async (context) => {
  // Fetch data from external API
  if (typeof context.query.id === "string") {
    const id: number = parseInt(context.query.id || "0");
    return request<Data>("http://localhost:3000/api/post/get", {
      method: "get",
      params: { id },
    })
      .then((res) => {
        return { props: { data: res || {} } };
      })
      .catch((e) => {
        console.log(e);
        return { notFound: true };
      });
  } else {
    return {
      notFound: true,
    };
  }
};
