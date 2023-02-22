import { LayoutDefault } from "@/components/Layout";
import Head from "next/head";
import {
  Grid,
  List,
  Card,
  Space,
  Modal,
  Form,
  Input,
  Message,
} from "@arco-design/web-react";
import locale from "@/locale/post";
import useLocale, { useLocaleName } from "@/utils/useLocale";
import styles from "@/pages/post/style/index.module.less";
import { useCallback, useEffect, useState } from "react";
import type { Category } from "@prisma/client";
import { requestMsg } from "@/utils/request";
import type { Data } from "@/pages/api/post/categories/list";
import { IconPlus } from "@arco-design/web-react/icon";
import cs from "classnames";
import WebLink from "@/components/base/WebLink";
import type { Data as EditData } from "@/pages/api/post/categories/edit";
import { useMediaQuery } from "react-responsive";

export default function Index() {
  const isSmallScreen = useMediaQuery({ maxWidth: 767 });
  const t = useLocale(locale);
  const lang = useLocaleName();
  const [data, setData] = useState<Category[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const fetchDataCallBack = useCallback(() => {
    console.log("xxx");
    const fetchData = (page: number, size: number) => {
      requestMsg<Data>("/api/post/categories/list", {
        method: "post",
        data: { page, size },
        lang,
      }).then((res) => {
        setData(res.categories || []);
        setTotal(res.total || 0);
      });
    };
    if (page > 0) {
      fetchData(page, 10);
    }
  }, [lang, page]);
  useEffect(() => {
    setPage(1);
  }, []);
  useEffect(() => {
    fetchDataCallBack();
  }, [fetchDataCallBack]);
  const [form] = Form.useForm();
  const editForm = (item: Category) => {
    form.setFieldsValue(item);
    console.log(item);
    setVisible(true);
  };
  const handleOk = () => {
    form
      .validate()
      .then((values) => {
        requestMsg<EditData>("/api/post/categories/edit", {
          method: "post",
          data: values,
        }).then((data) => {
          console.log(data);
          Message.info("操作成功");
          setVisible(false);
          fetchDataCallBack();
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const handleDelete = (id: number) => {
    requestMsg<EditData>("/api/post/categories/delete", {
      method: "post",
      data: { id },
    })
      .then((data) => {
        console.log(data);
        Message.info("操作成功");
        setVisible(false);
        fetchDataCallBack();
        // fetchData(page, 10);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const [visible, setVisible] = useState(false);

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
      <Modal
        title={t["post.edit.Title"]}
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={handleOk}
        style={{
          width: isSmallScreen ? "100%" : "520px",
          height: isSmallScreen ? "100%" : "auto",
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="id" field="id" hidden={true}>
            <Input placeholder="please enter your username..." />
          </Form.Item>
          <Form.Item label={t["post.category.field.name"]} field="cat">
            <Input placeholder={t["post.category.field.name"]} />
          </Form.Item>
          <Form.Item
            label={t["post.category.field.createTime"]}
            field="createAt"
          >
            <Input placeholder={t["post.category.field.createTime"]} readOnly />
          </Form.Item>
          <Form.Item
            label={t["post.category.field.updateTime"]}
            field="updatedAt"
          >
            <Input placeholder={t["post.category.field.updateTime"]} readOnly />
          </Form.Item>
        </Form>
      </Modal>
      <Card>
        <Grid.Row gutter={{ xs: 4, sm: 6, md: 12 }}>
          <Grid.Col span={24}>
            <div
              className={cs(styles["line_action"], styles["main_background"])}
            >
              <Space />
              <Space>
                <WebLink
                  handleClick={() =>
                    editForm({
                      cat: "",
                      id: 0,
                      createAt: new Date(),
                      updatedAt: new Date(),
                    })
                  }
                >
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
                      // fetchData(page, size);
                      setPage(page);
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
                              {t["post.edit"]}
                            </WebLink>
                            <WebLink
                              status="warning"
                              confirmText={t["post.delete.confirm"]}
                              handleClick={() => {
                                handleDelete(item.id);
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
