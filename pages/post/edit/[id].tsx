import Head from "next/head";
import { LayoutDefault } from "@/components/Layout";

export default function Index() {
  return (
    <>
      <Head>
        <link
          rel="shortcut icon"
          type="image/x-icon"
          href="https://unpkg.byted-static.com/latest/byted/arco-config/assets/favicon.ico"
        />
      </Head>
      <div>完善中</div>
    </>
  );
}
Index.Layout = LayoutDefault;
