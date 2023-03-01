import { LayoutDefault } from "@/components/Layout";
import { Button } from "@arco-design/web-react";
import { Calendar } from "@arco-design/web-react";
import Head from "next/head";
export default function Home() {
  return (
    <>
      <Head>
        <link
          rel="shortcut icon"
          type="image/x-icon"
          href="https://unpkg.byted-static.com/latest/byted/arco-config/assets/favicon.ico"
        />
      </Head>
      <Button type="primary">Index</Button>
      <Calendar></Calendar>
    </>
  );
}

Home.Layout = LayoutDefault;
