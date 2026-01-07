export async function POST(request: Request) {
  const keytoken = process.env.NUVEQ_KEYTOKEN;

  if (!keytoken) {
    return Response.json(
      { success: false, error: "Server configuration error" },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();

    const response = await fetch(
      "https://nuveq.cloud/api/v2/visitor/register",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Origin: "https://nuveq.cloud",
          Referer: `https://nuveq.cloud/visitor/register?keytoken=${keytoken}`,
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15",
        },
        body: JSON.stringify({ ...body, keytoken }),
      }
    );

    const responseText = await response.text();

    let data: Record<string, unknown> = { message: responseText };
    try {
      data = JSON.parse(responseText);
      // biome-ignore lint/suspicious/noEmptyBlockStatements: Fallback to raw text if JSON parse fails
    } catch {}

    return Response.json(
      {
        success: response.status === 201 || response.ok,
        status: response.status,
        data,
      },
      { status: response.status === 201 ? 201 : response.status }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
