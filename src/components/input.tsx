import React, { forwardRef } from "react";
import { Input as AntInput } from "antd";
import type { InputProps } from "antd";
import type { TextAreaProps, InputRef } from "antd/es/input";
import type { TextAreaRef } from "antd/es/input/TextArea";

type CustomInputProps = {
  textarea?: boolean;
  textAreaProps?: TextAreaProps;
} & Omit<InputProps, "onChange" | "onResize"> & {
    onChange?: (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => void;
  };

const Input = forwardRef<InputRef | TextAreaRef, CustomInputProps>(
  (
    {
      type = "text",
      textarea = false,
      className,
      textAreaProps,
      onChange,
      name,
      value,
      onBlur,
      ...rest
    },
    ref,
  ) => {
    if (textarea) {
      return (
        <AntInput.TextArea
         ref={ref as React.ForwardedRef<TextAreaRef>}
          {...textAreaProps}
          onBlur={
            onBlur as unknown as React.FocusEventHandler<HTMLTextAreaElement>
          }
          name={name}
          value={value}
          onChange={onChange}
          className={className}
        />
      );
    }

    return (
      <AntInput
        ref={ref as React.ForwardedRef<InputRef>}
        {...rest}
        onBlur={onBlur as unknown as React.FocusEventHandler<HTMLInputElement>}
        name={name}
        value={value}
        type={type}
        onChange={onChange}
        className={className}
      />
    );
  },
);

export default Input;
