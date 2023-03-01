import Head from "next/head";
import { LayoutDefault } from "@/components/Layout";
import dynamic from "next/dynamic";
import { useState, useCallback, useEffect } from "react";
import {
  Button,
  Form,
  Input,
  Card,
  Select,
  Message,
} from "@arco-design/web-react";

import { requestMsg } from "@/utils/request";
import formLocale from "@/locale/form";
import postLocale from "@/locale/post";
import useLocale, { useLocaleName } from "@/utils/useLocale";

import type { Data as CatData } from "@/pages/api/post/categories/list";
const DynamicEditor = dynamic(() => import("@/components/Editor"), {
  ssr: false,
});
import { Category } from "@prisma/client";
import { useRouter } from "next/router";
import { Data as PostData } from "@/pages/api/post/get";
import { Data as EditData } from "@/pages/api/post/edit";

export default function Index() {
  const router = useRouter();
  const formL = useLocale(formLocale);
  const postL = useLocale(postLocale);
  const lang = useLocaleName();

  const [html, setHtml] = useState<string>("");
  const [id, setId] = useState<number>(0);
  const [form] = Form.useForm();

  const [categories, setCategories] = useState<Category[]>([]);
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
  useEffect(() => {
    fetchCatCallBack();
  }, [fetchCatCallBack]);
  useEffect(() => {
    if (id <= 0) {
      return;
    }
    console.log(id);
    requestMsg<PostData>("/api/post/get", {
      method: "get",
      params: { id },
      lang,
    }).then((res) => {
      form.setFieldValue("id", res.id);
      form.setFieldValue("title", res.title);
      form.setFieldValue("content", res.content);
      setHtml(res.content ?? "");
      var catMap: number[] = [];
      res.categories?.forEach((item, index) => {
        catMap.push(item.categoryId);
      });
      form.setFieldValue("categoryId", catMap);
    });
  }, [id, lang, form]);
  useEffect(() => {
    const { id: queryId } = router.query;
    if (typeof queryId != "string") {
      return;
    }
    if (parseInt(queryId) <= 0) {
      return;
    }
    setId(parseInt(queryId));
  }, [router.query]);

  function onSubmitClick() {
    form.setFieldValue("content", html);
    form
      .validate()
      .then((values) => {
        requestMsg<EditData>("/api/post/edit", {
          method: "post",
          data: values,
        })
          .then((res) => {
            if (id == 0) {
              setId(res.id);
            }
            Message.info("保存成功，您可以继续编辑");
          })
          .finally(() => {});
      })
      .catch((err) => {
        console.error(err);
      });
  }
  return (
    <>
      <Head>
        <link
          rel="shortcut icon"
          type="image/x-icon"
          href="https://unpkg.byted-static.com/latest/byted/arco-config/assets/favicon.ico"
        />
      </Head>
      <div>
        <Card>
          <Form layout="vertical" form={form}>
            <Form.Item label="ID" field="id" hidden={true}>
              <Input />
            </Form.Item>
            <Form.Item label={postL["post.title"]} field="title">
              <Input />
            </Form.Item>
            <Form.Item
              label={postL["post.category.field.name"]}
              field="categoryId"
            >
              <Select allowClear mode="multiple">
                {categories &&
                  categories.map((value, _index) => {
                    return (
                      <Select.Option value={value.id} key={value.id}>
                        {value.cat}
                      </Select.Option>
                    );
                  })}
              </Select>
            </Form.Item>
            <Form.Item field="content" hidden={true}>
              <Input />
            </Form.Item>
            <Form.Item>
              <DynamicEditor html={html} setHtml={setHtml}></DynamicEditor>
            </Form.Item>
            <Button type="primary" onClick={onSubmitClick}>
              {formL["save"]}
            </Button>
          </Form>
        </Card>
      </div>
    </>
  );
}
Index.Layout = LayoutDefault;
