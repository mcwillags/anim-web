import * as React from "react";

const MIN_DIFF_TO_UPDATE = 100;

export const usePointerThrottling = (initialValue = 0) => {
  const [value, setValue] = React.useState(initialValue);
  const prevValue = React.useRef(initialValue);

  const update = React.useCallback(
    (updated: number) => {
      const diff = updated - prevValue.current;

      if (diff >= MIN_DIFF_TO_UPDATE) {
        setValue(updated);
        prevValue.current = updated;
      }
    },
    [setValue],
  );

  const reset = React.useCallback(() => {
    prevValue.current = 0;
    setValue(0);
  }, [setValue]);

  return [value, update, reset] as const;
};
