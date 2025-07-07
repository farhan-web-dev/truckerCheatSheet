import React from "react";
import clsx from "clsx";

interface SwitchProps {
  checked: boolean;
  onChange?: () => void;
  disabled?: boolean;
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  disabled = false,
}) => {
  return (
    <button
      type="button"
      onClick={onChange}
      disabled={disabled}
      className={clsx(
        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none",
        {
          "bg-green-500": checked && !disabled,
          "bg-gray-400": !checked && !disabled,
          "bg-gray-600": disabled,
          "cursor-not-allowed": disabled,
        }
      )}
    >
      <span
        className={clsx(
          "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
          {
            "translate-x-6": checked,
            "translate-x-1": !checked,
          }
        )}
      />
    </button>
  );
};
