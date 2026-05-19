import { Form as AntForm } from "antd";
import type { FormProps } from "antd";
import type { ReactNode } from "react";

export default function Form({
  layout = "vertical",
  size = "large",
  autoComplete = "off",
  children,
  requiredMark = true,
  ...rest
}: Readonly<FormProps & { children: ReactNode }>) {
  return (
    <AntForm
      autoComplete={autoComplete}
      size={size}
      layout={layout}
      requiredMark={requiredMark}
      {...rest}>
      {children}
    </AntForm>
  );
}

export const FormItem = AntForm.Item;
