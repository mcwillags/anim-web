import * as React from "react";

export const useDiffThrottling = (initialValue = 0, updateDiff: number = 100) => {
  const [value, setValue] = React.useState(initialValue);
  const prevValue = React.useRef(initialValue);

  const update = React.useCallback(
    (updated: number) => {
      const diff = updated - prevValue.current;

      if (diff >= updateDiff) {
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
