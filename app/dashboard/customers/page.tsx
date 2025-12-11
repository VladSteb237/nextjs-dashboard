// app/dashboard/customers/page.tsx

import { Metadata } from "next";
import { Suspense } from "react";
// Импортируем ваш компонент таблицы UI
import CustomersTable from "@/app/ui/customers/table";
// Импортируем функции для работы с данными и типы
import { fetchCustomersPages } from "@/app/lib/data";
import Search from "@/app/ui/search";
import { lusitana } from "@/app/ui/fonts";
import { InvoicesTableSkeleton } from "@/app/ui/skeletons"; // Пример скелетона
import { CreateCustomers } from "@/app/ui/customers/buttons";
import Pagination from "@/app/ui/customers/pagination";

export const metadata: Metadata = {
  title: "Customers",
};

// Страница является Server Component по умолчанию
export default async function Page(props: {
  searchParams?: Promise<{ query?: string; page?: string }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchCustomersPages(query);

  return (
    <div className="w-full">
      <h1 className={`${lusitana.className} mb-8 text-xl md:text-2xl`}>
        Customers
      </h1>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search customers..." />
        <CreateCustomers />
      </div>
      {/* Оборачиваем таблицу в Suspense для лучшего UX во время загрузки */}
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        {/* Передаем уже загруженные данные в ваш компонент CustomersTable */}
        <CustomersTable query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
