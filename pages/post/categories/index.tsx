import { LayoutDefault } from "@/components/Layout";
import Head from "next/head";
import { Grid, List, Pagination } from "@arco-design/web-react";
import locale from "@/locale/post";
import useLocale from "@/utils/useLocale";
import styles from "./style/index.module.less";
import { useEffect, useState } from "react";
import { Category } from "@prisma/client";
import { requestMsg } from "@/utils/request";
import type { Data } from "@/pages/api/post/categories/list";

export default function Index() {
  const t = useLocale(locale);
  const [data, setData] = useState<Category[]>([]);
  const [total, setTotal] = useState<number>(0);
  const fetchData = (page: number, size: number) => {
    requestMsg<Data>("/api/post/categories/list", {
      method: "post",
      data: { page, size },
    }).then((res) => {
      setData(res.categories || []);
      setTotal(res.total || 0);
    });
  };
  useEffect(() => {
    fetchData(1, 10);
  }, []);
  return (
    <>
      <Head>
        <link
          rel="shortcut icon"
          type="image/x-icon"
          href="https://unpkg.byted-static.com/latest/byted/arco-config/assets/favicon.ico"
        />
        <title>{t["post.category.title"]}</title>
      </Head>
      <Grid.Row gutter={{ xs: 4, sm: 6, md: 12 }}>
        <Grid.Col md={12} xs={24} sm={24}>
          <div className={styles.content2}>
            <List
              pagination={{
                total,
                showTotal: true,
                onChange: (page, size) => {
                  fetchData(page, size);
                },
                showJumper: true,
              }}
              dataSource={data}
              render={(item, index) => {
                return <List.Item key={index}>{item.cat}</List.Item>;
              }}
            ></List>
          </div>
        </Grid.Col>
      </Grid.Row>
    </>
  );
}
Index.Layout = LayoutDefault;
