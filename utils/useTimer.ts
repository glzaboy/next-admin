import { useEffect, useRef, useState } from "react";

export const useTimeOut = (time: number, fn: () => void) => {
  const [timeOut, setTime] = useState(time);
  useEffect(() => {
    const timer = window.setTimeout(() => {
      fn();
    }, timeOut * 1000);
    return () => {
      console.log("time destory");
      clearTimeout(timer);
    };
  }, [timeOut]);
};
export const useTimeInterVal = (time: number, fn: () => void) => {
  const [timeOut, setTime] = useState(time);
  useEffect(() => {
    const timer = window.setInterval(() => {
      fn();
    }, 1000);
    return () => {
      console.log("time destory");
      clearInterval(timer);
    };
  }, [timeOut]);
};

// export default useCountDown;
