const endpoint = "/api/telegram-test";

function reply(status, data) {
  return Response.json(data, {
    status,
    headers: { "cache-control": "no-store" },
  });
}

async function matchesCode(input, code) {
  if (input.length !== code.length) return false;
  const bytes = new TextEncoder();
  const [actual, expected] = await Promise.all(
    [input, code].map((value) => crypto.subtle.digest("SHA-256", bytes.encode(value))),
  );
  return crypto.subtle.timingSafeEqual(actual, expected);
}

async function sendTest(request, env, origin) {
  if (request.method !== "POST") return reply(405, { error: "method_not_allowed" });
  if (request.headers.get("origin") !== origin) return reply(403, { error: "invalid_origin" });
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID || !env.TELEGRAM_TEST_CODE) {
    return reply(503, { error: "integration_not_configured" });
  }

  const code = request.headers.get("x-telegram-test-code") ?? "";
  if (!(await matchesCode(code, env.TELEGRAM_TEST_CODE))) {
    return reply(403, { error: "invalid_code" });
  }

  try {
    const telegram = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      redirect: "manual",
      headers: { "content-type": "application/json" },
      signal: AbortSignal.timeout(10000),
      body: JSON.stringify({
        chat_id: env.TELEGRAM_CHAT_ID,
        text: "ТЕСТ · Заявка с сайта «Коммерческая недвижимость»\nОбъект: ТЦ «Силуэт»\nЦель: проверка доставки в Telegram\nДемонстрационная заявка",
      }),
    });
    const result = await telegram.json().catch(() => null);
    if (telegram.ok && result?.ok && result.result?.message_id) {
      return reply(200, { ok: true, messageId: result.result.message_id });
    }
    return reply(502, { error: "delivery_failed", upstreamStatus: telegram.status, telegramCode: result?.error_code ?? null });
  } catch (error) {
    return reply(502, { error: "delivery_failed", transportError: error?.name ?? "Error" });
  }
}

export default {
  fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === endpoint) return sendTest(request, env, url.origin);
    return env.ASSETS.fetch(request);
  },
};
