import { useAppSelector, useAppDispatch } from "@/modules/store";
import { selectGlobal } from "@/modules/global";
import { LayoutDefault, LayoutNoMemu } from "@/components/Layout";
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
        <title>th</title>
      </Head>
      <Button type="primary">Index</Button>
      <Calendar
        dateRender={(current) => {
          console.log(current);

          return (
            <>
              <div class="arco-calendar-date-value">
                <div class="arco-calendar-date-circle">
                  {current.format("DD")}
                </div>
              </div>
              <div class="arco-calendar-date-content">23456789</div>
            </>
          );
        }}
      ></Calendar>
    </>
  );
}

Home.Layout = LayoutNoMemu;
