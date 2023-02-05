import { useAppSelector, useAppDispatch } from "@/modules/store";
import { selectGlobal } from "@/modules/global";
import { LayoutNoMemu } from "@/components/Layout";
import { Card, Grid, List, Link as WEBLINK } from "@arco-design/web-react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { Menu } from "@arco-design/web-react";
const MenuItem = Menu.Item;
import { Carousel } from "@arco-design/web-react";
import Link from "next/link";
import { CategoryList } from "@/components/Cateroy/List/Index";
import { request } from "@/utils/request";
import type { Data as ApiCategoryList } from "@/page/api/post/getCat";
const imageSrc = [
  "//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/cd7a1aaea8e1c5e3d26fe2591e561798.png~tplv-uwbnlip3yd-webp.webp",
  "//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/6480dbc69be1b5de95010289787d64f1.png~tplv-uwbnlip3yd-webp.webp",
  "//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/0265a04fddbd77a19602a15d9d55d797.png~tplv-uwbnlip3yd-webp.webp",
  "//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/24e0dd27418d2291b65db1b21aa62254.png~tplv-uwbnlip3yd-webp.webp",
];
type Data = {
  categories: Array<{ id: number }>;
};
export default function Home({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const globalState = useAppSelector(selectGlobal);
  console.log(data);
  return (
    <>
      <Head>
        <link
          rel="shortcut icon"
          type="image/x-icon"
          href="https://unpkg.byted-static.com/latest/byted/arco-config/assets/favicon.ico"
        />
        <title>Microtf</title>
      </Head>
      <Menu mode="horizontal" defaultSelectedKeys={["1"]}>
        <MenuItem key="0" style={{ padding: 0, marginRight: 38 }} disabled>
          <div
            style={{
              width: 80,
              height: 30,
              borderRadius: 2,
              background: "var(--color-fill-3)",
              cursor: "pointer",
            }}
          />
        </MenuItem>
        <MenuItem key="/">首页</MenuItem>
        <MenuItem key="/post">文章</MenuItem>
        <MenuItem key="/tools">工具</MenuItem>
      </Menu>
      <Grid.Row gutter={16}>
        <Grid.Col xxl={8} xl={8} lg={12} md={12} xs={24} sm={24}>
          <div>你好欢迎光临</div>
        </Grid.Col>
        <Grid.Col xxl={8} xl={8} lg={12} md={12} xs={24} sm={24}>
          <Carousel style={{ width: "100%", height: "240" }}>
            {imageSrc.map((src, index) => (
              <div key={index}>
                <img src={src} style={{ width: "100%" }} />
              </div>
            ))}
          </Carousel>
        </Grid.Col>
        <Grid.Col xxl={8} xl={8} lg={12} md={12} xs={24} sm={24}>
          <Carousel style={{ width: "100%", height: "240" }}>
            {imageSrc.map((src, index) => (
              <div key={index}>
                <img src={src} style={{ width: "100%" }} />
              </div>
            ))}
          </Carousel>
        </Grid.Col>
        <Grid.Col xxl={8} xl={8} lg={12} md={12} xs={24} sm={24}>
          <CategoryList id={13}></CategoryList>
          <Card title="网络">
            <List style={{ width: "100%" }}>
              <List.Item>
                <Link href="/abc">
                  <WEBLINK type="success">妻子的</WEBLINK>
                </Link>
              </List.Item>
            </List>
          </Card>
        </Grid.Col>
      </Grid.Row>
    </>
  );
}
Home.Layout = LayoutNoMemu;
export const getServerSideProps: GetServerSideProps<{
  data?: Data;
}> = async (context) => {
  // Fetch data from external API
  return request<ApiCategoryList>("/api/post/getCat", {
    method: "get",
  })
    .then((result) => {
      console.log(result);
      return { props: { data: result } };
    })
    .catch((err) => {
      console.error(err);
    });
};
