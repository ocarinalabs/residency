"use client";

import { useEffect, useRef } from "react";

interface HiddenNuveqFormProps {
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
  onComplete?: () => void;
  visible?: boolean;
}

export function HiddenNuveqForm({
  formData,
  onComplete,
  visible = false,
}: HiddenNuveqFormProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const recaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";

  useEffect(() => {
    if (!formData || !iframeRef.current) return;

    console.log("🚀 Preparing to submit form to Nuveq with data:", formData);

    // Create an HTML page with reCAPTCHA that auto-submits
    const iframeDoc =
      iframeRef.current.contentDocument ||
      iframeRef.current.contentWindow?.document;
    if (!iframeDoc) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        ${recaptchaKey ? `<script src="https://www.google.com/recaptcha/api.js?render=${recaptchaKey}"></script>` : ""}
      </head>
      <body>
        <div style="padding: 20px; font-family: system-ui;">
          <p>${recaptchaKey ? "🔄 Loading reCAPTCHA..." : "📨 Submitting form..."}</p>
        </div>
        <form id="visitorForm" action="https://nuveq.cloud/modules/visitors/regv.php?keytoken=8zyCek2N9hS5u2jcS1aC4E6KzO0" method="POST">
          <input type="hidden" name="action" value="visitor_register" />
          <input type="hidden" name="name" value="${formData.fullName}" />
          <input type="hidden" name="email" value="${formData.email}" />
          <input type="hidden" name="id_passport_number" value="${formData.icPassport}" />
          <input type="hidden" name="phone" value="${formData.phoneNumber}" />
          <input type="hidden" name="visit_start_at" value="${formData.visitDate}T${formData.startTime}" />
          <input type="hidden" name="visit_end_at" value="${formData.visitDate}T23:59" />
          <input type="hidden" name="car_number" value="${formData.vehicleNumber || ""}" />
          <input type="hidden" name="reason_for_visit" value="${formData.reasonToVisit}" />
          <input type="hidden" name="site_id" value="224" />
          <input type="hidden" name="token" id="recaptchaToken" value="" />
        </form>
        
        <script>
          ${
            recaptchaKey
              ? `
          grecaptcha.ready(function() {
            document.querySelector('p').textContent = '🔐 Getting reCAPTCHA token...';
            grecaptcha.execute('${recaptchaKey}', {action: 'visitor_register'})
              .then(function(token) {
                console.log('Got reCAPTCHA token:', token.substring(0, 50) + '...');
                document.getElementById('recaptchaToken').value = token;
                document.querySelector('p').textContent = '📨 Submitting form with reCAPTCHA...';
                document.getElementById('visitorForm').submit();
              })
              .catch(function(error) {
                document.querySelector('p').textContent = '❌ reCAPTCHA failed: ' + error;
                console.error('reCAPTCHA error:', error);
              });
          });
          `
              : `
          // No reCAPTCHA key provided, submit directly
          document.getElementById('visitorForm').submit();
          `
          }
        </script>
      </body>
      </html>
    `;

    iframeDoc.open();
    iframeDoc.write(htmlContent);
    iframeDoc.close();

    console.log("📝 Iframe loaded with reCAPTCHA form");

    // Check for success
    const checkInterval = setInterval(() => {
      try {
        const bodyText = iframeDoc.body?.innerText || "";
        if (bodyText.includes("Thank you!")) {
          console.log("✅ Success detected!");
          clearInterval(checkInterval);
          onComplete?.();
        }
      } catch {
        console.log("🔒 Cross-origin - form submitted");
        clearInterval(checkInterval);
      }
    }, 1000);

    return () => clearInterval(checkInterval);
  }, [formData, onComplete, recaptchaKey]);

  if (!formData) return null;

  return (
    <>
      {visible && (
        <div style={{ marginTop: "16px" }}>
          <p style={{ fontSize: "14px", color: "#666", marginBottom: "8px" }}>
            📡 Nuveq Response Frame (below shows what Nuveq returns):
          </p>
        </div>
      )}

      {/* Iframe to receive the response */}
      <iframe
        ref={iframeRef}
        name="hiddenFrame"
        style={
          visible
            ? {
                width: "100%",
                height: "400px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                marginTop: "8px",
              }
            : { display: "none" }
        }
        title="Registration Frame"
        sandbox="allow-scripts allow-same-origin allow-forms"
      />
    </>
  );
}
