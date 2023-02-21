import { LayoutDefault } from "@/components/Layout";
import Head from "next/head";
import { Grid, List, Card, Space, Form } from "@arco-design/web-react";
import locale from "@/locale/post";
import useLocale, { useLocaleName } from "@/utils/useLocale";
import styles from "@/pages/post/style/index.module.less";
import { useEffect, useState } from "react";
import type { Category } from "@prisma/client";
import { requestMsg } from "@/utils/request";
import type { Data } from "@/pages/api/post/categories/list";
import { IconPlus } from "@arco-design/web-react/icon";
import cs from "classnames";
import WebLink from "@/components/base/WebLink";
import type { Data as EditData } from "@/pages/api/post/categories/edit";

export default function Index() {
  const t = useLocale(locale);
  const lang = useLocaleName();
  const [data, setData] = useState<Category[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const fetchData = (page: number, size: number) => {
    requestMsg<Data>("/api/post/list", {
      method: "post",
      data: { page, size },
      lang,
    }).then((res) => {
      setData(res.categories || []);
      setTotal(res.total || 0);
      setPage(page);
    });
  };
  useEffect(() => {
    fetchData(1, 10);
  }, [fetchData]);
  const [form] = Form.useForm();
  return (
    <>
      <Head>
        <link
          rel="shortcut icon"
          type="image/x-icon"
          href="https://unpkg.byted-static.com/latest/byted/arco-config/assets/favicon.ico"
        />
        <title>{t["post.list"]}</title>
      </Head>
      <Card>
        <Grid.Row gutter={{ xs: 4, sm: 6, md: 12 }}>
          <Grid.Col span={24}>
            <div
              className={cs(styles["line_action"], styles["main_background"])}
            >
              <Space />
              <Space>
                <WebLink pathname="/post/edit/0">
                  <IconPlus />
                  {t["post.new"]}
                </WebLink>
              </Space>
            </div>
          </Grid.Col>
          <Grid.Col md={24} xs={24} sm={24}>
            <div className={styles.content}>
              <Card>
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
                    return (
                      <List.Item key={index}>
                        <div className={styles["line"]}>
                          <Space>{item.cat}</Space>
                          <Space>
                            <WebLink
                              pathname="/post/category/edit/"
                              handleClick={() => {
                                editForm(item);
                              }}
                            >
                              {t["post.category.edit"]}
                            </WebLink>
                            <WebLink
                              status="warning"
                              confirmText={t["post.category.delete.confirm"]}
                              handleClick={() => {
                                handleDelete(item.id);
                              }}
                            >
                              {t["post.category.delete"]}
                            </WebLink>
                          </Space>
                        </div>
                      </List.Item>
                    );
                  }}
                ></List>
              </Card>
            </div>
          </Grid.Col>
        </Grid.Row>
      </Card>
    </>
  );
}
Index.Layout = LayoutDefault;
