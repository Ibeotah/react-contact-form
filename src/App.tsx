import { useContactMutation } from "@hooks/useContactMutation";
import Form, { FormItem } from "@components/form";
import { useForm } from "antd/es/form/Form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRef, useState } from "react";
import Input from "@components/input";
import { Radio, Checkbox, Button, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { type ContactFormData } from "./types";
import { content, queryOptions } from "@constants/constants";
import Captcha, { type CaptchaRef } from "@components/captcha/captcha";

const antIcon = (
  <LoadingOutlined
    style={{ fontSize: 18, color: "#ffffff", marginRight: "8px" }}
    spin
  />
);
function App() {
  const [form] = useForm();
  const captchaRef = useRef<CaptchaRef>(null);

  // Track state only to manage form blockages or backend validation failures
  const [captchaState, setCaptchaState] = useState<{
    token: string | null;
    version: "v2" | "v3";
    isV2Active: boolean;
  }>({ token: null, version: "v3", isV2Active: false });

  const { mutate, isPending } = useContactMutation(() => {
    form.resetFields();
    setCaptchaState({ token: null, version: "v3", isV2Active: true });
  });

  const handleCaptchaChange = (token: string | null, version: "v2" | "v3") => {
    setCaptchaState((prev) => ({
      ...prev,
      token,
      version,
      isV2Active: version === "v2" || prev.isV2Active,
    }));
  };

  const handleFinish = async (values: ContactFormData) => {
    // 1. If v2 fallback is already on screen, validate its token manually before submitting
    if (captchaState.isV2Active) {
      if (!captchaState.token) {
        toast.error("Please complete the security checkbox validation.");
        return;
      }
      mutate({
        ...values,
        captchaToken: captchaState.token,
        captchaVersion: "v2",
      });
      return;
    }

    // 2. Otherwise, execute modern v3 validation in the background
    if (captchaRef.current) {
      const v3Token = await captchaRef.current.executeV3("contact_form_submit");

      if (v3Token) {
        mutate({ ...values, captchaToken: v3Token, captchaVersion: "v3" });
      } else {
        // v3 failed or timed out, shift view interface to require checkbox validation
        setCaptchaState((prev) => ({ ...prev, isV2Active: true }));
        captchaRef.current.executeFallback();
      }
    }
  };

  return (
    <>
      <ToastContainer />

      <Form form={form} onFinish={handleFinish} className='form'>
        <h1 className='contact'>Contact Us</h1>
        <div className='form-item-input'>
          {content.map((item) => (
            <FormItem
              name={item.name}
              key={item.name}
              label={<p className={item.labelClassName}>{item.label}</p>}
              rules={
                item.rules
              } /* Reads the advanced validation array flawlessly */
            >
              <Input
                variant='outlined'
                className='input'
                placeholder={item.placeholder}
              />
            </FormItem>
          ))}
        </div>
        {/* 3. NEW: Query Type Section                                */}
        <FormItem
          name='query_type'
          label={<p className='form-label'>Query Type</p>}
          rules={[{ required: true, message: "Please select a query type" }]}>
          <Radio.Group className='query-radio-group'>
            {queryOptions.map((option) => (
              <Radio
                key={option.value}
                value={option.value}
                className='custom-radio-button'>
                {option.label}
              </Radio>
            ))}
          </Radio.Group>
        </FormItem>

        {/* message */}
        <FormItem
          name='message'
          label={<p className='form-label'>Message</p>}
          rules={[{ required: true, message: "This field is required" }]}>
          <Input
            variant='outlined'
            className='input'
            textarea={true}
            textAreaProps={{
              // Forces the box to naturally rest at 4 text rows tall
              autoSize: { minRows: 4, maxRows: 6 },
            }}
          />
        </FormItem>

        {/*  Consent Checkbox Section                          */}
        {/* ========================================================= */}
        <FormItem
          name='consent'
          valuePropName='checked' /* CRITICAL for Antd checkboxes to store true/false properly */
          rules={[
            {
              validator: (_, value) =>
                value
                  ? Promise.resolve()
                  : Promise.reject(
                      new Error(
                        "To submit this form, please consent to being contacted",
                      ),
                    ),
            },
          ]}>
          <Checkbox className='custom-consent-checkbox'>
            {/* change the color of the asterisk */}I consent to being contacted
            by the team <span className='asterisk'>*</span>
          </Checkbox>
        </FormItem>

        {/* Recaptcha */}

        <Captcha
          ref={captchaRef}
          onChange={handleCaptchaChange}
          className='captcha-layout-spacing'
        />
        {/* ========================================================= */}
        {/* 3. NEW: Antd Submit Button                                */}
        {/* ========================================================= */}
        <FormItem shouldUpdate noStyle>
          {() => {
            //  Extract error arrays to check if any field has validation error
            const hasErrors = form
              .getFieldsError()
              .some(({ errors }) => errors.length > 0);

            //  Keep track of missing essential fields from your data fields

            const values = form.getFieldsValue();

            const isMissingRequiredFields =
              !values.first_name?.trim() ||
              !values.last_name?.trim() ||
              !values.email?.trim() ||
              !values.query_type ||
              !values.message?.trim() ||
              !values.consent;

            // Button is disabled if: loading, there are validation errors, fields haven't been touched, or data is missing
            const isSubmitDisabled =
              isPending || hasErrors || isMissingRequiredFields;

            return (
              <Button
                type='primary'
                htmlType='submit'
                block
                className='submit-btn'
                disabled={isSubmitDisabled}>
                {isPending ? (
                  <span>
                    <Spin indicator={antIcon} /> Submitting...
                  </span>
                ) : (
                  "Submit"
                )}
              </Button>
            );
          }}
        </FormItem>
      </Form>
    </>
  );
}

export default App;
