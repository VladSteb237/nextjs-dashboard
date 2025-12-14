"use server";
import { z } from "zod";
import postgres from "postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

// const FormSchema = z.object({
//   id: z.string(),
//   customerId: z.string(),
//   amount: z.coerce.number(),
//   status: z.enum(["pending", "paid"]),
//   date: z.string(),
// });
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: "Please select a customer.",
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: "Please enter an amount greater than $0." }),
  status: z.enum(["pending", "paid"], {
    invalid_type_error: "Please select an invoice status.",
  }),
  date: z.string(),
});
const CustomerSchema = z.object({
  id: z.string(),
  name: z.string().min(2, { message: "Please enter a name." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  image_url: z.string().url({
    message:
      "Please enter a valid image URL. avatarko.ru and images.pexels.com are supported",
  }),
});

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

export type StateCustomer = {
  errors?: {
    name?: string[];
    email?: string[];
    image_url?: string[];
  };
  message?: string | null;
};

const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });
// Схема для создания (без id)
const CreateCustomer = CustomerSchema.omit({ id: true });
// Схема для обновления (включает id для идентификации записи)
const UpdateCustomer = CustomerSchema.omit({ id: true });

export async function createCustomer(
  prevState: StateCustomer,
  formData: FormData
) {
  // 1. Валидация данных формы с помощью Zod
  const validatedFields = CreateCustomer.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    image_url: formData.get("image_url"),
  });

  // Если валидация не пройдена, вернуть ошибку
  if (!validatedFields.success) {
    // В реальном приложении здесь обрабатываются ошибки валидации UI
    console.error(validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Customer.",
    };
  }

  const { name, email, image_url } = validatedFields.data;

  // 2. Вставка данных в базу данных
  try {
    await sql`
      INSERT INTO customers (name, email, image_url)
      VALUES (${name}, ${email}, ${image_url})
    `;
  } catch (error) {
    return {
      message: "Database Error: Failed to Create Customer.",
    };
  }
  // 3. Ревалидация кэша и перенаправление
  // Очищает кэш для страницы списка клиентов, чтобы новый клиент сразу появился
  revalidatePath("/dashboard/customers"), { cache: "no-store" };
  // Перенаправляет пользователя обратно на страницу клиентов
  redirect("/dashboard/customers");
}

export async function updateCustomer(
  id: string,
  prevState: StateCustomer,
  formData: FormData
) {
  // 1. Валидация данных формы
  const validatedFields = UpdateCustomer.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    image_url: formData.get("image_url"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Customer.",
    };
  }

  const { name, email, image_url } = validatedFields.data;

  // 2. Обновление данных в базе данных
  try {
    await sql`
      UPDATE customers
      SET name = name =${name}, email = ${email}, image_url = ${image_url}
      WHERE id = ${id}
    `;
  } catch (error) {
    return {
      message: "Database Error: Failed to Update Customer.",
    };
  }
  // 3. Ревалидация кэша и перенаправление
  revalidatePath("/dashboard/customers"), { cache: "no-store" };
  //revalidatePath(`/dashboard/customers/${id}/edit`); // Также ревалидируем текущую страницу
  redirect("/dashboard/customers");
}

export async function createInvoice(prevState: State, formData: FormData) {
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });
  //console.log(validatedFields);

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Invoice.",
    };
  }
  // Prepare data for insertion into the database
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split("T")[0];

  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (error) {
    // We'll also log the error to the console for now
    console.error(error);
    return {
      message: "Database Error: Failed to Create Invoice.",
    };
  }
  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

export async function updateInvoice(
  id: string,
  prevState: State,
  formData: FormData
) {
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Invoice.",
    };
  }
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  try {
    await sql`
        UPDATE invoices
        SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
        WHERE id = ${id}
      `;
  } catch (error) {
    // We'll also log the error to the console for now
    console.error(error);
    return { message: "Database Error: Failed to Update Invoice." };
  }
  revalidatePath("/dashboard/invoices"), { cache: "no-store" };
  redirect("/dashboard/invoices");
}

export async function deleteInvoice(id: string) {
  //throw new Error("Failed to Delete Invoice");
  await sql`DELETE FROM invoices WHERE id = ${id}`;
  revalidatePath("/dashboard/invoices");
}
export async function deleteCustomer(id: string) {
  await sql`DELETE FROM customers WHERE id = ${id}`;
  revalidatePath("/dashboard/customers");
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}
