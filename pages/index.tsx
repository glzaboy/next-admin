import { useAppSelector, useAppDispatch } from "@/modules/store";
import { selectGlobal } from "@/modules/global";
import { LayoutDefault } from "@/components/Layout";
import { Button } from "@arco-design/web-react";
import { Calendar } from "@arco-design/web-react";
import Head from "next/head";
export default function Home() {
  const globalState = useAppSelector(selectGlobal);
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
