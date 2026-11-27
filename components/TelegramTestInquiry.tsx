'use client';

import { useState, type FormEvent } from 'react';

export default function TelegramTestInquiry() {
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');

  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const code = String(new FormData(event.currentTarget).get('code') ?? '').trim();
    setBusy(true);
    setStatus('');

    try {
      const response = await fetch('/api/telegram-test', {
        method: 'POST',
        headers: { 'x-telegram-test-code': code },
      });
      const result = await response.json();
      if (response.ok && result.ok) {
        setStatus('Тестовая заявка доставлена в Telegram.');
      } else {
        setStatus(result.error === 'invalid_code'
          ? 'Проверьте код для теста.'
          : 'Доставка не подтверждена. Проверьте группу Telegram.');
      }
    } catch {
      setStatus('Доставка не подтверждена. Проверьте группу Telegram.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={send}>
      <p>Тестовый режим. В Telegram отправятся демонстрационные данные.</p>
      <label>Код для теста
        <input name="code" type="password" required maxLength={64} autoComplete="off" />
      </label>
      <button type="submit" className="button" disabled={busy}>
        {busy ? 'Отправляем…' : 'Отправить тестовую заявку'}
      </button>
      <p role="status" aria-live="polite">{status}</p>
    </form>
  );
}
