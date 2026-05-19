const content = [
  {
    label: "First Name",
    name: "first_name",
    message: "This field is required",
    required: true,
    labelClassName: "form-label",
    placeholder: "e.g. John",
    rules: [{ required: true, message: "This field is required" }],
  },
  {
    label: "Last Name",
    name: "last_name",
    message: "This field is required",
    required: true,
    labelClassName: "form-label",
    placeholder: "e.g. Doe",
    rules: [{ required: true, message: "This field is required" }],
  },
  {
    label: "Email Address",
    name: "email",
    required: true,
    labelClassName: "form-label",
    placeholder: "e.g. john.doe@example.com",
    // COMBINED VALIDATION: Required check + Custom bulletproof Regex
    rules: [
      {
        required: true,
        message: "Please enter your email address",
      },
      {
        pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        message: "Please enter a valid email address (e.g. name@domain.com)",
      },
    ],
  },
];

const queryOptions = [
  { label: "General Enquiry", value: "general" },
  { label: "Support Request", value: "support" },
];

export { content, queryOptions };
