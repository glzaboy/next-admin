import { useEffect, useRef, useState } from "react";

/**
 * 定时回调
 * @param timeOut 超时时间 单位秒
 * @param fn 回调方法
 */
export const useTimeOut = (timeOut: number, fn: () => void) => {
  const timer = useRef<NodeJS.Timeout>();
  useEffect(() => {
    timer.current = setTimeout(() => {
      fn();
    }, timeOut * 1000);
    return () => {
      console.log("tick timer destroy");
      clearTimeout(timer.current);
    };
  }, []);
};
/**
 * 周期性回调
 * @param timeInterVal 定时时间
 * @param fn 回调
 */
export const useTimeInterVal = (timeInterVal: number, fn: () => void) => {
  const timer = useRef<NodeJS.Timeout>();

  useEffect(() => {
    console.log("use Effect start", timer);
    startTimer(timeInterVal, fn);
    console.log("use Effect startID", timer);
    return () => {
      stopTimer();
    };
  }, []);
  const stopTimer = () => {
    if (timer) {
      clearInterval(timer.current);
      timer.current = undefined;
      console.log("clear Timer Id", timer);
    }
    return undefined;
  };
  const startTimer = (timeInterVal: number, fn: () => void) => {
    console.log("startTimer", timer);
    if (timer.current) {
      console.error("timer already running.");
    } else {
      timer.current = setInterval(() => {
        fn();
      }, timeInterVal * 1000);
    }
  };

  return { startTimer, stopTimer };
};

/**
 * countDown
 * @param duration 时间秒
 * @returns
 */
export const useCountdown = (duration: number) => {
  const [countdown, setCountdown] = useState(0);
  const [isSetup, toggleSetup] = useState(false);
  const timer = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isSetup) {
      setCountdown(duration);
      timer.current = setInterval(() => {
        setCountdown((current) => current - 1);
      }, 1000);
    } else clearInterval(timer.current as NodeJS.Timeout);
  }, [isSetup]);

  useEffect(() => {
    if (countdown === 0) {
      toggleSetup(false);
    }
  }, [countdown]);

  useEffect(() => () => clearInterval(timer.current as NodeJS.Timeout), []);

  function setupCountdown() {
    toggleSetup(true);
  }

  return { countdown, setupCountdown };
};
