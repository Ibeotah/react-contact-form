import { useMutation } from "@tanstack/react-query";
import { supabase } from "@lib/supabaseClient";
import { toast } from "react-toastify";
import { type ContactFormData } from "../types";

export const useContactMutation = (onSuccessCallback?: () => void) => {
  return useMutation({
    mutationFn: async (formData: ContactFormData) => {
      const dbPayload = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        query_type: formData.query_type,
        message: formData.message,
        consent: formData.consent,
      };

      const { data, error } = await supabase
        .from("contact_form")
        .insert([dbPayload]);

      // If there is an error, we throw it so React Query's onError can catch it
      // Passing both the message and the unique PG error code if available
      if (error) {
        const customError = new Error(error.message);
        (customError as any).code = error.code; // Capture Postgres error code (e.g., '23505')
        throw customError;
      }
      return data;
    },

    onSuccess: () => {
      console.log("Data synced with Supabase!");
      toast.success(
        "Message Sent! Thanks for completing the form, we'll be in touch soon!",
        {
          position: "top-center",
          autoClose: 5000,
          theme: "light",
        },
      );

      if (onSuccessCallback) {
        onSuccessCallback();
      }
    },

    onError: (error: any) => {
      // Postgres code '23505' indicates a unique constraint violation (duplicate data)
      if (
        error.code === "23505" ||
        error.message?.toLowerCase().includes("unique constraint")
      ) {
        toast.error("Your details have already been sent!", {
          position: "top-center",
          autoClose: 5000,
          theme: "light",
        });
      } else {
        // Fallback for all other database errors (network issues, schema errors, etc.)
        toast.error(
          `Submission failed: ${error.message || "Something went wrong"}`,
          {
            position: "top-center",
            autoClose: 5000,
            theme: "light",
          },
        );
      }
    },
  });
};
