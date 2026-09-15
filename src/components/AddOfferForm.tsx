"use client";

import { useActionState, useRef, useState } from "react";
import { createOfferAction } from "@/app/actions";

const today = () => new Date().toISOString().slice(0, 10);

export function AddOfferForm() {
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(async (
    prev: { error: string } | null,
    formData: FormData
  ) => {
    const result = await createOfferAction(prev, formData);
    if (!result) {
      formRef.current?.reset();
      setOpen(false);
    }
    return result;
  }, null);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded-md bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-900 transition hover:bg-white"
      >
        + Добавить запуск
      </button>
    );
  }

  return (
    <form
      ref={formRef}
      action={formAction}
      className="mb-6 grid grid-cols-1 gap-3 rounded-lg border border-neutral-800 bg-neutral-900 p-4 sm:grid-cols-2 lg:grid-cols-5"
    >
      <div className="lg:col-span-2">
        <label className="mb-1 block text-xs text-neutral-400">Название оффера</label>
        <input
          name="name"
          required
          className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-neutral-500"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs text-neutral-400">Партнёрка</label>
        <select
          name="network"
          required
          className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-neutral-500"
        >
          <option value="leon">Leon</option>
          <option value="1xbet">1xBet</option>
        </select>
      </div>

      <div>
        <label className="mb-1 block text-xs text-neutral-400">Дата старта</label>
        <input
          type="date"
          name="start_date"
          defaultValue={today()}
          required
          className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-neutral-500"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs text-neutral-400">Ссылка на кабинет</label>
        <input
          name="cabinet_url"
          type="url"
          placeholder="https://…"
          className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-neutral-500"
        />
      </div>

      {state?.error && (
        <p className="text-sm text-red-400 lg:col-span-5">{state.error}</p>
      )}

      <div className="flex gap-2 lg:col-span-5">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-900 transition hover:bg-white disabled:opacity-50"
        >
          {pending ? "Добавляем…" : "Добавить"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-md border border-neutral-700 px-4 py-2 text-sm text-neutral-300 transition hover:bg-neutral-800"
        >
          Отмена
        </button>
      </div>
    </form>
  );
}
