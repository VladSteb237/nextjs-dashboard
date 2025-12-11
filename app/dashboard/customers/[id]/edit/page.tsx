import Form from "@/app/ui/customers/edit-form";
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
// Вам понадобится функция fetchCustomerById в app/lib/data.ts
import { fetchCustomerById } from "@/app/lib/data";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Customer",
};

const EditCustomers = async (props: { params: Promise<{ id: string }> }) => {
  const params = await props.params;
  const id = params.id;
  const customer = await fetchCustomerById(id);

  if (!customer) {
    notFound();
  }
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Customers", href: "/dashboard/customers" },
          {
            label: "Edit Customer",
            href: `/dashboard/customers/${id}/edit`,
            active: true,
          },
        ]}
      />
      {/* Передаем данные клиента в форму редактирования */}
      {/* Также передаем action updateCustomer, привязанный к конкретному ID */}
      <Form customer={customer} />
    </main>
  );
};

export default EditCustomers;
