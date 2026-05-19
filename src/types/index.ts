export type QueryType = "general" | "support";

export interface ContactFormData {
  first_name: string;
  last_name: string;
  email: string;
  query_type: QueryType;
  message: string;
  consent: boolean;
  captchaToken?: string | null;
  captchaVersion?: "v2" | "v3";
}
