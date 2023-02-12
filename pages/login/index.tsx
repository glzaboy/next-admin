import Head from "next/head";
import React, { useEffect } from "react";

import styles from "./style/index.module.less";
import { LayoutNoMemu } from "@/components/Layout";
import LoginForm from "./form";
import { Typography, Grid } from "@arco-design/web-react";
import locale from "@/locale/login";
import useLocale from "@/utils/useLocale";

export default function Home() {
  const t = useLocale(locale);
  useEffect(() => {
    document.body.setAttribute("arco-theme", "light");
  }, []);
  return (
    <>
      <Head>
        <link
          rel="shortcut icon"
          type="image/x-icon"
          href="https://unpkg.byted-static.com/latest/byted/arco-config/assets/favicon.ico"
        />
        <title>{t["login.title"]}</title>
      </Head>
      <Grid.Row gutter={{ xs: 4, sm: 6, md: 12 }}>
        <Grid.Col md={12} xs={24} sm={24}>
          <div className={styles.content}>
            <div className={styles["content-inner"]}>
              <LoginForm />
            </div>
          </div>
        </Grid.Col>
        <Grid.Col md={12} xs={24} sm={24}>
          <div className={styles.content2}>
            <Typography.Title>欢迎您</Typography.Title>
            <Typography.Paragraph>
              你来到最具价值的知识社区，接下来的操作需要得到你的授权，请登录后再进行操作。
            </Typography.Paragraph>
          </div>
        </Grid.Col>
      </Grid.Row>
    </>
  );
}
Home.Layout = LayoutNoMemu;
