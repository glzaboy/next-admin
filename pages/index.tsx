import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
const inter = Inter({ subsets: ["latin"] });

import { useAppSelector, useAppDispatch } from "../modules/store";
import { selectGlobal, switchScreen, switchTheme } from "../modules/global";
import { LayoutDefault } from "../components/Layout";
import { Button } from "@arco-design/web-react";
export default function Home() {
  const globalState = useAppSelector(selectGlobal);
  const dispatch = useAppDispatch();
  return (
    <>
      <Button type="primary">Index</Button>
    </>
  );
}

Home.Layout = LayoutDefault;
