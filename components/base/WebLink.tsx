import Link from "next/link";
import { Link as ArcoLink, Popconfirm } from "@arco-design/web-react";
const WebLink = ({
  children,
  pathname,
  query,
  status,
  handleClick,
  confirmText,
}: {
  children: any;
  pathname?: string;
  query?: any;
  status?: "success" | "error" | "warning";
  handleClick?: () => void;
  confirmText?: string;
}) => {
  if (
    handleClick != undefined &&
    typeof handleClick == "function" &&
    !confirmText
  ) {
    return (
      <ArcoLink
        status={status}
        onClick={(e) => {
          e.preventDefault();
          handleClick();
        }}
      >
        {children}
      </ArcoLink>
    );
  } else if (pathname) {
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
  } else if (confirmText) {
    return (
      <>
        <Popconfirm
          focusLock
          icon={null}
          content={confirmText}
          onOk={handleClick}
          cancelButtonProps={{ style: { display: "none" } }}
        >
          <ArcoLink status={status}>{children}</ArcoLink>
        </Popconfirm>
      </>
    );
  } else {
    return <>{children}</>;
  }
};
export default WebLink;
