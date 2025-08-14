"use client";

import { useEffect, useRef, useCallback } from "react";

interface VisitorRegistrationIframeProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  formData?: {
    fullName: string;
    email: string;
    icPassport: string;
    phoneNumber: string;
    visitDate: string;
    startTime: string;
    vehicleNumber?: string;
    reasonToVisit: string;
  };
}

export function VisitorRegistrationIframe({
  onSuccess,
  onError,
  formData,
}: VisitorRegistrationIframeProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const recaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";

  useEffect(() => {
    if (!formData || !iframeRef.current) return;

    const handleMessage = (event: MessageEvent) => {
      // Listen for messages from the iframe
      if (event.origin !== "https://nuveq.cloud") return;

      // Check if registration was successful
      if (event.data?.success) {
        onSuccess?.();
      } else if (event.data?.error) {
        onError?.(event.data.error);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onSuccess, onError, formData]);

  const submitForm = useCallback(() => {
    if (!formData || !iframeRef.current) return;

    // Create a form in the iframe's document
    const iframeDoc =
      iframeRef.current.contentDocument ||
      iframeRef.current.contentWindow?.document;
    if (!iframeDoc) {
      onError?.("Could not access iframe");
      return;
    }

    // Build the form HTML with Nuveq's exact structure
    const formHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        ${recaptchaKey ? `<script src="https://www.google.com/recaptcha/api.js?render=${recaptchaKey}"></script>` : ""}
      </head>
      <body>
        <form id="regForm" action="https://nuveq.cloud/modules/visitors/regv.php?keytoken=8zyCek2N9hS5u2jcS1aC4E6KzO0" method="POST">
          <input type="hidden" name="action" value="visitor_register">
          <input type="hidden" name="name" value="${formData.fullName}">
          <input type="hidden" name="email" value="${formData.email}">
          <input type="hidden" name="id_passport_number" value="${formData.icPassport}">
          <input type="hidden" name="phone" value="${formData.phoneNumber}">
          <input type="hidden" name="visit_start_at" value="${formData.visitDate}T${formData.startTime}">
          <input type="hidden" name="visit_end_at" value="${formData.visitDate}T23:59">
          <input type="hidden" name="car_number" value="${formData.vehicleNumber || ""}">
          <input type="hidden" name="reason_for_visit" value="${formData.reasonToVisit}">
          <input type="hidden" name="site_id" value="224">
        </form>
        
        <script>
          ${
            recaptchaKey
              ? `
          // Wait for reCAPTCHA to load
          grecaptcha.ready(function() {
            grecaptcha.execute('${recaptchaKey}', {action: 'visitor_register'})
              .then(function(token) {
                // Add token to form
                const tokenInput = document.createElement('input');
                tokenInput.type = 'hidden';
                tokenInput.name = 'token';
                tokenInput.value = token;
                document.getElementById('regForm').appendChild(tokenInput);
                
                // Submit the form
                document.getElementById('regForm').submit();
              })
              .catch(function(error) {
                // Send error message to parent
                window.parent.postMessage({ error: 'reCAPTCHA failed' }, '*');
              });
          });
          `
              : `
          // No reCAPTCHA key provided, submit directly
          document.getElementById('regForm').submit();
          `
          }
          
          // Check for success message
          setInterval(function() {
            if (document.body.innerHTML.includes('Thank you!') && 
                document.body.innerHTML.includes('please check your email')) {
              window.parent.postMessage({ success: true }, '*');
            }
          }, 500);
        </script>
      </body>
      </html>
    `;

    iframeDoc.open();
    iframeDoc.write(formHtml);
    iframeDoc.close();
  }, [formData, onError, recaptchaKey]);

  // Submit when formData is provided
  useEffect(() => {
    if (formData) {
      submitForm();
    }
  }, [formData, submitForm]);

  return (
    <iframe
      ref={iframeRef}
      style={{ display: "none" }}
      sandbox="allow-scripts allow-same-origin allow-forms"
      title="Hidden Registration Frame"
    />
  );
}
