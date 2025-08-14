"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Smartphone, Code2, Eye } from "lucide-react";

export default function PassDebugPage() {
  const [loading, setLoading] = useState(false);
  const [htmlContent, setHtmlContent] = useState("");
  const [displayMode, setDisplayMode] = useState<"raw" | "preview">("raw");
  const token = "x412Ac1QwRBLV4JB1yrx03PCAJu5jo7T5C7ZSn2Cb";
  const passUrl = `https://nuveq.cloud/modules/visitors/visitor_pass.php?keyToken=${token}`;

  const fetchWithMobileUA = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/mobile-fetch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: passUrl }),
      });

      const data = await response.json();
      if (data.html) {
        setHtmlContent(data.html);
        console.log("Fetched HTML:", data.html.substring(0, 500));

        // Try to find door control elements
        const parser = new DOMParser();
        const doc = parser.parseFromString(data.html, "text/html");

        // Look for buttons, forms, links with door-related text
        const buttons = doc.querySelectorAll(
          'button, input[type="button"], input[type="submit"], a'
        );
        console.log("Found buttons/links:", buttons.length);

        buttons.forEach((btn, i) => {
          const text = btn.textContent || btn.getAttribute("value") || "";
          if (
            text.toLowerCase().includes("door") ||
            text.toLowerCase().includes("emergency") ||
            text.toLowerCase().includes("entrance") ||
            text.toLowerCase().includes("open") ||
            text.toLowerCase().includes("close")
          ) {
            console.log(`Door control ${i}:`, {
              tag: btn.tagName,
              text: text,
              onclick: btn.getAttribute("onclick"),
              href: btn.getAttribute("href"),
              id: btn.id,
              class: btn.className,
            });
          }
        });

        // Look for forms
        const forms = doc.querySelectorAll("form");
        forms.forEach((form, i) => {
          console.log(`Form ${i}:`, {
            action: form.action,
            method: form.method,
            id: form.id,
          });
        });
      }
    } catch (error) {
      console.error("Error fetching:", error);
      setHtmlContent(`Error: ${error}`);
    }
    setLoading(false);
  };

  const extractDoorControls = () => {
    if (!htmlContent) return null;

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");

    // Extract all potential door control elements
    const controls: Record<string, string | null>[] = [];

    // Find all clickable elements
    doc
      .querySelectorAll(
        'button, input[type="button"], a, div[onclick], span[onclick]'
      )
      .forEach((el) => {
        const text = el.textContent || el.getAttribute("value") || "";
        const onclick = el.getAttribute("onclick") || "";
        const href = el.getAttribute("href") || "";

        if (text || onclick || href) {
          controls.push({
            type: el.tagName.toLowerCase(),
            text: text.trim(),
            onclick: onclick,
            href: href,
            id: el.id,
            class: el.className,
            name: el.getAttribute("name"),
          });
        }
      });

    return controls;
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-4">Visitor Pass Debug Tool</h1>

        <div className="mb-4 p-4 bg-muted rounded-lg">
          <p className="text-sm font-mono">Token: {token}</p>
          <p className="text-sm font-mono">URL: {passUrl}</p>
        </div>

        <div className="flex gap-4 mb-6">
          <Button onClick={fetchWithMobileUA} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Fetching...
              </>
            ) : (
              <>
                <Smartphone className="mr-2 h-4 w-4" />
                Fetch with Mobile UA
              </>
            )}
          </Button>

          <Button
            variant="outline"
            onClick={() =>
              setDisplayMode(displayMode === "raw" ? "preview" : "raw")
            }
            disabled={!htmlContent}
          >
            {displayMode === "raw" ? (
              <>
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </>
            ) : (
              <>
                <Code2 className="mr-2 h-4 w-4" />
                Raw HTML
              </>
            )}
          </Button>
        </div>

        {htmlContent && (
          <>
            {/* Door Controls Analysis */}
            <div className="mb-6 p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">🚪 Door Controls Found:</h3>
              <div className="space-y-2 max-h-60 overflow-auto">
                {extractDoorControls()?.map((control, i) => (
                  <div
                    key={i}
                    className="text-xs font-mono p-2 bg-muted rounded"
                  >
                    <div>
                      {control.type}: &quot;{control.text}&quot;
                    </div>
                    {control.onclick && <div>onclick: {control.onclick}</div>}
                    {control.href && <div>href: {control.href}</div>}
                    {control.id && <div>id: {control.id}</div>}
                    {control.class && <div>class: {control.class}</div>}
                  </div>
                ))}
              </div>
            </div>

            {/* HTML Display */}
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-muted px-4 py-2 flex items-center justify-between">
                <span className="text-sm font-semibold">
                  {displayMode === "raw" ? "Raw HTML" : "Preview"}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => navigator.clipboard.writeText(htmlContent)}
                >
                  Copy
                </Button>
              </div>

              {displayMode === "raw" ? (
                <pre className="p-4 text-xs overflow-auto max-h-96 bg-black text-green-400">
                  {htmlContent}
                </pre>
              ) : (
                <div
                  className="p-4 max-h-96 overflow-auto"
                  dangerouslySetInnerHTML={{ __html: htmlContent }}
                />
              )}
            </div>
          </>
        )}

        {/* Instructions */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
          <p className="text-sm font-semibold mb-2">🔍 Debug Instructions:</p>
          <ol className="text-sm space-y-1 text-muted-foreground">
            <li>
              1. Click &quot;Fetch with Mobile UA&quot; to get the mobile
              version
            </li>
            <li>2. Check console for door control elements</li>
            <li>3. Look for onclick handlers or form actions</li>
            <li>4. Copy the HTML to analyze offline</li>
          </ol>
        </div>
      </Card>
    </div>
  );
}
