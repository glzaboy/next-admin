import Head from "next/head";
import React, { useEffect } from "react";
import locale from "@/locale/login";

import styles from "./style/index.module.less";
import useLocale from "@/utils/useLocale";
import { LayoutNoMemu } from "@/components/Layout";
import LoginForm from "./form";
import { Grid } from "@arco-design/web-react";

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
      </Head>
      <Grid.Row>
        <Grid.Col md={12} xs={24} sm={24}>
          <div className={styles.content}>
            <div className={styles["content-inner"]}>
              <LoginForm />
            </div>
          </div>
        </Grid.Col>
        <Grid.Col md={12} xs={24} sm={24}></Grid.Col>
      </Grid.Row>
    </>
  );
}
Home.Layout = LayoutNoMemu;
