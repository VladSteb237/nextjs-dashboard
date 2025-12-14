export const dynamic = "force-dynamic";
export const revalidate = 0;
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import Form from "@/app/ui/customers/create-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Customers",
};

const CreateCustomers = () => {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Customers", href: "/dashboard/customers" },
          {
            label: "Create Customer",
            href: "/dashboard/customers/create",
            active: true,
          },
        ]}
      />
      {/* Передаем серверное действие в компонент формы */}
      <Form />
    </main>
  );
};

export default CreateCustomers;
