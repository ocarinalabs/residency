import { v } from "convex/values";
import { action } from "./_generated/server";

// Nuveq API configuration
const NUVEQ_BASE_URL = "https://nuveq.cloud/modules/visitors";
const NUVEQ_KEY_TOKEN = "8zyCek2N9hS5u2jcS1aC4E6KzO0";

export const registerVisitor = action({
  args: {
    fullName: v.string(),
    email: v.string(),
    icPassport: v.string(),
    phoneNumber: v.string(),
    visitDate: v.string(),
    startTime: v.string(),
    vehicleNumber: v.optional(v.string()),
    reasonToVisit: v.string(),
    recaptchaToken: v.optional(v.string()),
  },
  handler: async (_, args) => {
    console.log("Registration attempt:", args);

    try {
      // First, fetch the form page to get any required tokens
      const formPageUrl = `${NUVEQ_BASE_URL}/regv.php?keytoken=${NUVEQ_KEY_TOKEN}`;
      const formPageResponse = await fetch(formPageUrl, {
        method: "GET",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15",
        },
      });

      const formPageHtml = await formPageResponse.text();
      console.log("Looking for token in form page...");

      // Try to extract token from the form page
      // Look for patterns like: name="token" value="..." or token: "..."
      const tokenMatch = formPageHtml.match(/name="token"\s+value="([^"]+)"/);
      const token = tokenMatch ? tokenMatch[1] : "";
      console.log(
        "Found token:",
        token ? `Yes (length: ${token.length})` : "No"
      );

      // Also look for site_id
      const siteIdMatch = formPageHtml.match(
        /name="site_id"\s+value="([^"]+)"/
      );
      const siteId = siteIdMatch ? siteIdMatch[1] : "224";
      console.log("Site ID:", siteId);

      // Get cookies from the response
      const cookies = formPageResponse.headers.get("set-cookie");
      console.log("Cookies from form page:", cookies);

      // Create form data to match Nuveq's exact format and order
      const formData = new FormData();

      // First two fields must be action and token
      formData.append("action", "visitor_register");

      // Use reCAPTCHA token if provided, otherwise use the token from the form
      const finalToken = args.recaptchaToken || token;
      if (finalToken) {
        formData.append("token", finalToken);
        console.log(
          "Using token type:",
          args.recaptchaToken ? "reCAPTCHA" : "form token"
        );
        console.log("Token length:", finalToken.length);
      }

      // Then the rest of the fields in exact order
      formData.append("name", args.fullName);
      formData.append("email", args.email);
      formData.append("id_passport_number", args.icPassport);
      formData.append("phone", args.phoneNumber);

      // Format dates as YYYY-MM-DDTHH:mm
      const visitDateTime = `${args.visitDate}T${args.startTime}`;
      const endDateTime = `${args.visitDate}T23:59`;
      formData.append("visit_start_at", visitDateTime);
      formData.append("visit_end_at", endDateTime);

      formData.append("car_number", args.vehicleNumber || "");
      formData.append("reason_for_visit", args.reasonToVisit);

      // Add empty image field (required but can be empty)
      formData.append("image", new Blob([]), "");

      formData.append("site_id", siteId);

      const requestUrl = `${NUVEQ_BASE_URL}/regv.php?keytoken=${NUVEQ_KEY_TOKEN}`;
      console.log("Making request to:", requestUrl);
      console.log("Sending with token:", token ? "Yes" : "No");
      console.log(
        "Using session cookie:",
        cookies ? cookies.split(";")[0] : "None"
      );

      // Make request to Nuveq API with multipart/form-data
      // Include cookies if we got them
      const headers: Record<string, string> = {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15",
        Origin: "https://nuveq.cloud",
        Referer: formPageUrl,
      };

      if (cookies) {
        headers["Cookie"] = cookies.split(";")[0]; // Use the session cookie
      }

      const response = await fetch(requestUrl, {
        method: "POST",
        headers,
        body: formData, // FormData automatically sets multipart/form-data header
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(
          `Registration failed: ${response.statusText} - ${errorText}`
        );
      }

      const result = await response.text();
      console.log("Response text:", result.substring(0, 500));

      // Check if registration was successful - look for the exact success message
      const isSuccess =
        (result.includes("Thank you!") &&
          result.includes("for submited your visitor detail")) ||
        result.includes("please check your email for visitor detail");

      // Also check if we got the form back (which means failure)
      const gotFormBack =
        result.includes("Visitor Self Register") ||
        result.includes("<form") ||
        result.includes('name="name"');

      if (isSuccess && !gotFormBack) {
        console.log("Registration successful!");
        return {
          success: true,
          visitorToken: null,
          passUrl: null,
          message:
            "Registration successful! Please check your email for visitor details.",
        };
      }

      // If we still got the form page back, registration failed
      if (gotFormBack) {
        console.log("Registration failed - form was returned");
        console.log(
          "Note: reCAPTCHA tokens are domain-locked. Token generated on your domain won't work on Nuveq's backend."
        );
        return {
          success: false,
          error:
            "Registration failed. reCAPTCHA validation failed (tokens are domain-locked).",
        };
      }

      return {
        success: false,
        error: "Unexpected response from server",
      };
    } catch (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Registration failed",
      };
    }
  },
});
