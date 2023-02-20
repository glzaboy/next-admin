import Link from "next/link";
import { Link as ArcoLink } from "@arco-design/web-react";
const WebLink = ({
  children,
  pathname,
  query,
  status,
  handleClick,
}: {
  children: any;
  pathname?: string;
  query?: any;
  status?: "success" | "error" | "warning";
  handleClick?: () => void;
}) => {
  if (handleClick != undefined && typeof handleClick == "function") {
    return (
      <ArcoLink
        status={status}
        onClick={() => {
          handleClick();
        }}
      >
        {children}
      </ArcoLink>
    );
  } else {
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
  }
};
export default WebLink;
