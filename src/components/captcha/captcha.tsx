import { useState, useImperativeHandle, forwardRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import styles from "./captcha.module.css";
import { toast } from "react-toastify";

// Read variables with Vite's format
const googleCaptchaV2SiteKey = import.meta.env.VITE_V2_SITE_KEY;

interface CaptchaProps {
  onChange: (token: string | null, version: "v2" | "v3") => void;
  className?: string;
}

export interface CaptchaRef {
  executeFallback: () => void;
  executeV3: (actionName: string) => Promise<string | null>;
}

const Captcha = forwardRef<CaptchaRef, CaptchaProps>(
  ({ onChange, className = "" }, ref) => {
    const { executeRecaptcha } = useGoogleReCaptcha();
    const [showV2Fallback, setShowV2Fallback] = useState(false);

    // Expose control methods to App.tsx via ref
    useImperativeHandle(ref, () => ({
      executeFallback: () => {
        setShowV2Fallback(true);
      },
      executeV3: async (actionName: string) => {
        if (!executeRecaptcha || showV2Fallback) return null;
        try {
          const token = await executeRecaptcha(actionName);
          if (token) {
            onChange(token, "v3");
            return token;
          }
          return null;
        } catch (error) {
         
          toast.warn(
            "Automated security check failed. Please verify using the checkbox below.",
          );
          setShowV2Fallback(true);
          return null;
        }
      },
    }));

    const handleV2Change = (value: string | null) => {
      onChange(value, "v2");
    };

    // If v3 is operating silently in the background, don't render anything.
    if (!showV2Fallback) return null;

    return (
      <div className={`${styles.container} ${className}`}>
        <ReCAPTCHA
          sitekey={googleCaptchaV2SiteKey || ""}
          onChange={handleV2Change}
        />
      </div>
    );
  },
);

Captcha.displayName = "Captcha";
export default Captcha;
