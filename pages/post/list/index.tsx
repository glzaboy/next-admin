import { LayoutDefault } from "@/components/Layout";
import Head from "next/head";
import { Grid, List, Card, Space, Form, Select } from "@arco-design/web-react";
import locale from "@/locale/post";
import useLocale, { useLocaleName } from "@/utils/useLocale";
import styles from "@/pages/post/style/index.module.less";
import { useCallback, useEffect, useState } from "react";
import type { Post, Category } from "@prisma/client";
import { requestMsg } from "@/utils/request";
import type { Data } from "@/pages/api/post/list";
import { IconPlus } from "@arco-design/web-react/icon";
import cs from "classnames";
import WebLink from "@/components/base/WebLink";
import type { Data as CatData } from "@/pages/api/post/categories/list";
import type { Data as EditData } from "@/pages/api/post/categories/edit";

export default function Index() {
  const t = useLocale(locale);
  const lang = useLocaleName();
  const [data, setData] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [catId, setCatId] = useState<number>(0);

  const fetchCatCallBack = useCallback(() => {
    const fetchCatData = (page: number, size: number) => {
      requestMsg<CatData>("/api/post/categories/list", {
        method: "post",
        data: { page, size, catId: 1 },
        lang,
      }).then((res) => {
        setCategories(res.categories || []);
      });
    };
    fetchCatData(1, 100);
  }, [lang]);

  const fetchDataCallBack = useCallback(() => {
    const fetchData = (page: number, size: number, catId: number) => {
      requestMsg<Data>("/api/post/list", {
        method: "post",
        data: { page, size, catId },
        lang,
      }).then((res) => {
        setData(res.post || []);
        setTotal(res.total || 0);
      });
    };
    if (page > 0) {
      fetchData(page, 10, catId);
    }
  }, [page, catId, lang]);
  useEffect(() => {
    fetchCatCallBack();
  }, [fetchCatCallBack]);
  useEffect(() => {
    fetchDataCallBack();
  }, [fetchDataCallBack]);
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
              <Space>
                <Select
                  placeholder={t["post.list.catSel"]}
                  style={{ width: "250px" }}
                  allowClear
                  onChange={(value, option) => {
                    console.log(option);
                    console.log(value);
                    setCatId(value);
                    setPage(1);
                  }}
                >
                  {categories &&
                    categories.map((value, _index) => {
                      return (
                        <Select.Option value={value.id} key={value.id}>
                          {value.cat}
                        </Select.Option>
                      );
                    })}
                </Select>
              </Space>
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
                      setPage(page);
                    },
                    showJumper: true,
                    pageSize: 10,
                    current: page,
                    // current: { page },
                  }}
                  dataSource={data}
                  render={(item, index) => {
                    return (
                      <List.Item key={index}>
                        <div className={styles["line"]}>
                          <Space>{item.title}</Space>
                          <Space>
                            <WebLink
                              pathname="/post/category/edit/"
                              handleClick={() => {
                                // editForm(item);
                              }}
                            >
                              {t["post.edit"]}
                            </WebLink>
                            <WebLink
                              status="warning"
                              confirmText={t["post.category.delete.confirm"]}
                              handleClick={() => {
                                // handleDelete(item.id);
                              }}
                            >
                              {t["post.delete"]}
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
