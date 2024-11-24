import * as React from "react";
import { RefObject } from "react";

export const useOnClickOutside = <T extends HTMLElement = HTMLElement>(
  ref: RefObject<T | undefined>,
  callback: () => void,
) => {
  const handleClick = React.useCallback(
    (event: MouseEvent) => {
      if (!ref.current || !event.target) return;

      if (!ref.current.contains(event.target as Node)) callback();
    },
    [callback],
  );

  React.useLayoutEffect(() => {
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [handleClick]);
};
