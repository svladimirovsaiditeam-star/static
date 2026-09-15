"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/actions";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, null);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form
        action={formAction}
        className="w-full max-w-sm rounded-lg border border-neutral-800 bg-neutral-900 p-8"
      >
        <h1 className="mb-6 text-lg font-medium text-neutral-100">Вход</h1>

        <label className="mb-1 block text-sm text-neutral-400">Пароль</label>
        <input
          type="password"
          name="password"
          autoFocus
          required
          className="mb-4 w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-neutral-100 outline-none focus:border-neutral-500"
        />

        {state?.error && (
          <p className="mb-4 text-sm text-red-400">{state.error}</p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-md bg-neutral-100 px-3 py-2 text-sm font-medium text-neutral-900 transition hover:bg-white disabled:opacity-50"
        >
          {pending ? "Входим…" : "Войти"}
        </button>
      </form>
    </div>
  );
}
