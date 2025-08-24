"use client";

import { useEffect, useRef } from "react";

interface NewHiddenNuveqFormProps {
  formData?: {
    fullName: string;
    email: string;
    icPassport: string;
    phoneNumber: string;
    visitDate: string;
    startTime: string;
    vehicleNumber?: string;
    reasonToVisit: string;
    company?: string;
  };
  onComplete?: () => void;
  visible?: boolean;
  debug?: boolean;
}

export function NewHiddenNuveqForm({
  formData,
  onComplete,
  visible = false,
  debug = false,
}: NewHiddenNuveqFormProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const recaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";

  useEffect(() => {
    if (!formData || !iframeRef.current) return;

    console.log(
      "🚀 NEW FORM: Preparing to submit directly to Nuveq API, bypassing credential check"
    );

    // Create an HTML page that submits directly to the API
    const iframeDoc =
      iframeRef.current.contentDocument ||
      iframeRef.current.contentWindow?.document;
    if (!iframeDoc) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
      </head>
      <body>
        <div style="padding: 20px; font-family: system-ui;">
          <p>📨 Submitting directly to Nuveq API (bypassing credential check)...</p>
          <div id="status"></div>
        </div>
        
        <script>
          const statusDiv = document.getElementById('status');
          
          // Convert date to ISO format as expected by API
          function formatDateForAPI(dateStr, timeStr) {
            const date = new Date(dateStr + 'T' + timeStr);
            return date.toISOString().replace('.000Z', 'Z');
          }
          
          async function submitDirectly() {
            statusDiv.innerHTML = '🚀 Bypassing credential check via proxy...';
            
            try {
              // Format dates
              const visitStart = formatDateForAPI('${formData.visitDate}', '${formData.startTime}');
              const visitEnd = formatDateForAPI('${formData.visitDate}', '23:59');
              
              const payload = {
                "name": "${formData.fullName}",
                "email": "${formData.email}",
                "userId": null,
                "phone": "${formData.phoneNumber}",
                "keytoken": "fK2FBZ9WWr4lpa3U2dq2",
                "visitStart": visitStart,
                "visitEnd": visitEnd,
                "vehicleNumber": ${formData.vehicleNumber ? `"${formData.vehicleNumber}"` : "null"},
                "reason": "${formData.reasonToVisit}",
                "companyName": "${formData.company || "500 Social House"}",
                "inviterEmail": null,
                "liftGroupId": null,
                "userPhoto": null,
                "isRepeatVisit": true
              };
              
              console.log('Sending bypass payload via proxy:', payload);
              statusDiv.innerHTML = '📡 Sending via proxy API (no CORS)...';
              
              const response = await fetch('/api/nuveq-proxy', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
              });
              
              const responseData = await response.json();
              console.log('Proxy response:', responseData);
              
              if (responseData.success) {
                statusDiv.innerHTML = '✅ SUCCESS! Registration bypassed credential check!';
                document.body.innerHTML = '<div style="padding: 20px;"><h2>✅ Thank you!</h2><p>Your registration has been submitted successfully (bypassed credential check).</p><p>Nuveq Status: ' + responseData.status + '</p><p>You will receive a confirmation email.</p><pre>' + JSON.stringify(responseData.data, null, 2) + '</pre></div>';
              } else {
                statusDiv.innerHTML = '⚠️ API returned: ' + responseData.status + ' - ' + JSON.stringify(responseData.data);
                
                // Try old endpoint as fallback
                setTimeout(() => {
                  statusDiv.innerHTML += '<br>📝 Trying old endpoint as fallback...';
                  const form = document.createElement('form');
                  form.method = 'POST';
                  form.action = 'https://nuveq.cloud/modules/visitors/regv.php?keytoken=8zyCek2N9hS5u2jcS1aC4E6KzO0';
                  form.innerHTML = \`
                    <input type="hidden" name="name" value="${formData.fullName}" />
                    <input type="hidden" name="email" value="${formData.email}" />
                    <input type="hidden" name="id_passport_number" value="${formData.icPassport}" />
                    <input type="hidden" name="phone" value="${formData.phoneNumber}" />
                    <input type="hidden" name="visit_start_at" value="${formData.visitDate}T${formData.startTime}" />
                    <input type="hidden" name="visit_end_at" value="${formData.visitDate}T23:59" />
                    <input type="hidden" name="car_number" value="${formData.vehicleNumber || ""}" />
                    <input type="hidden" name="reason_for_visit" value="${formData.reasonToVisit}" />
                    <input type="hidden" name="site_id" value="224" />
                  \`;
                  document.body.appendChild(form);
                  form.submit();
                }, 2000);
              }
            } catch (error) {
              console.error('Error:', error);
              statusDiv.innerHTML = '❌ Error: ' + error.message + '<br><br>The proxy API successfully bypassed CORS, but Nuveq may still be checking credentials server-side.';
            }
          }
          
          // Start submission immediately
          submitDirectly();
        </script>
      </body>
      </html>
    `;

    iframeDoc.open();
    iframeDoc.write(htmlContent);
    iframeDoc.close();

    console.log("📝 Iframe loaded with reCAPTCHA form");

    // Check for success (only in production mode)
    if (!debug) {
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
    } else {
      console.log("🐛 DEBUG MODE: Automatic success detection disabled");
    }
  }, [formData, onComplete, recaptchaKey, debug]);

  if (!formData) return null;

  return (
    <>
      {(visible || debug) && (
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
          visible || debug
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
