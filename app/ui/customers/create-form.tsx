// app/ui/customers/create-form.tsx

// Если вы используете клиентские хуки для обработки ошибок, вам понадобится 'use client';
"use client";
import Link from "next/link";
import { Button } from "@/app/ui/button";
// Импортируем наше серверное действие
import { createCustomer, State } from "@/app/lib/actions";
import { useActionState } from "react";

export default function CreateCustomerForm() {
  const initialState: State = { message: null, errors: {} };
  const [state, formAction] = useActionState(
    createCustomer as any,
    initialState
  );
  // action={createCustomer} автоматически привязывает форму к серверному действию
  return (
    <form action={formAction}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Поле для имени клиента */}

        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Enter Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Enter customer name"
            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            required
          />
        </div>

        {/* Поле для Email */}
        <div className="mb-4">
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            Enter Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter email address"
            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            required
          />
        </div>

        {/* Поле для URL изображения (простое текстовое поле для примера) */}
        <div className="mb-4">
          <label htmlFor="image_url" className="mb-2 block text-sm font-medium">
            Image URL
          </label>
          <input
            id="image_url"
            name="image_url"
            type="url"
            placeholder="https://example.com/image.jpg"
            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            required
          />
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/customers"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200">
          Cancel
        </Link>
        <Button type="submit">Create Customer</Button>
      </div>
    </form>
  );
}
