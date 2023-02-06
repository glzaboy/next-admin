import Link from "next/link";
import { Link as ArcoLink } from "@arco-design/web-react";
const WebLink = ({
  children,
  pathname,
  query,
  status,
}: {
  children: any;
  pathname: string;
  query: any;
  status?: "success" | "error" | "warning";
}) => {
  return (
    <Link
      href={{
        pathname,
        query,
      }}
    >
      <ArcoLink status={status}>{children}</ArcoLink>
    </Link>
  );
};
export default WebLink;
