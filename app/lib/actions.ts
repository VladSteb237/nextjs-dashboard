"use server";
import { z } from "zod";
import postgres from "postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

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
  // image_url: z.string().url({
  //   message:
  //     "Please enter a valid image URL. avatarko.ru and images.pexels.com are supported",
  // }),
  imageFile: z.any().optional(),
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
    //image_url?: string[];
    imageFile?: string[];
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
  formData: FormData,
) {
  // 1. Валидация данных формы с помощью Zod
  const validatedFields = CreateCustomer.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    //image_url: formData.get("image_url"),
    imageFile: formData.get("image") as File,
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

  const { name, email } = validatedFields.data;
  const imageFile = formData.get("image") as File;

  // 2. Вставка данных в базу данных
  try {
    // 1️⃣ Превращаем File в Buffer
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    // 2️⃣ Загружаем в Cloudinary
    const uploadResult = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "customers" }, (error, result) => {
          if (error) reject(error);
          resolve(result);
        })
        .end(buffer);
    });
    const image_url = uploadResult.secure_url;
    const image_public_id = uploadResult.public_id;

    await sql`
      INSERT INTO customers (name, email, image_url, image_public_id)
      VALUES (${name}, ${email}, ${image_url}, ${image_public_id})
    `;
  } catch (error) {
    return {
      message: "Database Error: Failed to Create Customer.",
    };
  }
  // 3. Ревалидация кэша и перенаправление
  // Очищает кэш для страницы списка клиентов, чтобы новый клиент сразу появился
  (revalidatePath("/dashboard/customers"), { cache: "no-store" });
  // Перенаправляет пользователя обратно на страницу клиентов
  redirect("/dashboard/customers");
}

export async function updateCustomer(
  id: string,
  prevState: StateCustomer,
  formData: FormData,
) {
  // 1. Валидация данных формы
  const validatedFields = UpdateCustomer.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    imageFile: formData.get("image") as File,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Customer.",
    };
  }

  const { name, email, imageFile } = validatedFields.data;

  // 2. Обновление данных в базе данных
  try {
    // 1️⃣ Получаем текущего клиента
    const existingCustomer = await sql`
      SELECT image_public_id FROM customers WHERE id = ${id}
    `;

    let image_url = null;
    let image_public_id = null;

    // 2️⃣ Если пользователь загрузил новое фото
    if (imageFile && imageFile.size > 0) {
      // удалить старое
      if (existingCustomer[0]?.image_public_id) {
        await cloudinary.uploader.destroy(existingCustomer[0].image_public_id);
      }
      // загрузить новое
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadResult: any = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "customers" }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          })
          .end(buffer);
      });
      image_url = uploadResult.secure_url;
      image_public_id = uploadResult.public_id;
    } else {
      // если фото не меняли — оставить старое
      image_url = undefined;
      image_public_id = undefined;
    }
    // 3️⃣ Обновление БД
    if (image_url) {
      await sql`
        UPDATE customers
        SET name = ${name},
            email = ${email},
            image_url = ${image_url},
            image_public_id = ${image_public_id}
        WHERE id = ${id}
      `;
    } else {
      await sql`
        UPDATE customers
        SET name = ${name},
            email = ${email}
        WHERE id = ${id}
      `;
    }
  } catch (error) {
    return {
      message: "Database Error: Failed to Update Customer.",
    };
  }
  // 3. Ревалидация кэша и перенаправление
  (revalidatePath("/dashboard/customers"), { cache: "no-store" });
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
  formData: FormData,
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
  (revalidatePath("/dashboard/invoices"), { cache: "no-store" });
  redirect("/dashboard/invoices");
}

//////////////////////////////////Delete Invoice////////////////////////
export async function deleteInvoice(id: string) {
  //throw new Error("Failed to Delete Invoice");
  await sql`DELETE FROM invoices WHERE id = ${id}`;
  revalidatePath("/dashboard/invoices");
}

///////////////////////////////////Delete Customer///////////////////////
export async function deleteCustomer(id: string) {
  try {
    // 1️⃣ Получаем public_id
    const customer = await sql`
      SELECT image_public_id FROM customers WHERE id = ${id}
    `;

    if (customer.length && customer[0].image_public_id) {
      // 2️⃣ Удаляем фото из Cloudinary
      await cloudinary.uploader.destroy(customer[0].image_public_id);
    }

    // 1️⃣ Удаляем все invoices клиента
    await sql`
      DELETE FROM invoices WHERE customer_id = ${id}
    `;

    // 3️⃣ Удаляем запись из Neon
    await sql`
      DELETE FROM customers WHERE id = ${id}
    `;

    revalidatePath("/dashboard/customers");
  } catch (error) {
    console.error("Delete failed:", error);
    throw new Error("Failed to delete customer.");
  }
}
//////////////////////////////////Authentication Action///////////////////////
export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
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
///////////////////////////////////End of Actions////////////////////////////
