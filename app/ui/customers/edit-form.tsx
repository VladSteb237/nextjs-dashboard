// app/ui/customers/edit-form.tsx
"use client";
import { CustomerForm } from "@/app/lib/definitions"; // Ваш тип данных клиента
import { updateCustomer, State } from "@/app/lib/actions"; // Серверное действие
import Link from "next/link";
import { Button } from "@/app/ui/button";
import { useActionState } from "react";

export default function EditCustomerForm({
  customer,
}: {
  customer: CustomerForm;
}) {
  const initialState: State = { message: null, errors: {} };
  // Привязываем ID клиента к нашему Server Action с помощью bind()
  // Это создает новый action, который уже знает, какой ID нужно обновить.
  const updateCustomerWithId = updateCustomer.bind(null, customer.id);
  const [state, formAction] = useActionState(
    updateCustomerWithId as any,
    initialState
  );

  // Используем привязанный action в атрибуте формы
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
            // Используем defaultValue для предзаполнения
            defaultValue={customer.name}
            placeholder="Enter customer name"
            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
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
            defaultValue={customer.email}
            placeholder="Enter email address"
            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
          />
        </div>

        {/* Поле для URL изображения */}
        <div className="mb-4">
          <label htmlFor="image_url" className="mb-2 block text-sm font-medium">
            Image URL
          </label>
          <input
            id="image_url"
            name="image_url"
            type="url"
            defaultValue={customer.image_url}
            placeholder="https://example.com/image.jpg"
            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
          />
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/customers"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200">
          Cancel
        </Link>
        <Button type="submit">Edit Customer</Button>
      </div>
    </form>
  );
}
