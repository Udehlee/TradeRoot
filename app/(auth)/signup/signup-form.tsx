"use client";

import { PasswordInput } from "@/components/password-input";
import { Button } from "@/components/ui/button";
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/app/lib/auth-client";
import { passwordSchema } from "@/app/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const baseSchema = z.object({
  firstname: z.string().min(1, { message: "First name is required" }),
  lastname: z.string().min(1, { message: "Last name is required" }),
  email: z.email({ message: "Please enter a valid email" }),
  phone: z.string().min(1, { message: "Phone number is required" }),
  password: passwordSchema,
  passwordConfirmation: z.string().min(1, { message: "Please confirm password" }),
});

const buyerSchema = baseSchema
  .extend({
    businessName: z.string().optional(),
    businessType: z.string().optional(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  });

const supplierSchema = baseSchema
  .extend({
    businessName: z.string().min(1, { message: "Business name is required" }),
    category: z.string().min(1, { message: "Category is required" }),
    cacNumber: z.string().optional(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  });

function getSchema(role: "BUYER" | "SUPPLIER") {
  return role === "BUYER" ? buyerSchema : supplierSchema;
}

type BuyerValues = z.infer<typeof buyerSchema>;
type SupplierValues = z.infer<typeof supplierSchema>;
type SignUpValues = BuyerValues & Partial<SupplierValues>;

interface SignUpFormProps {
  role: "BUYER" | "SUPPLIER";
}

export function SignUpForm({ role }: SignUpFormProps) {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<SignUpValues>({
    resolver: zodResolver(getSchema(role)),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      phone: "",
      password: "",
      passwordConfirmation: "",
      businessName: "",
      businessType: "",
      category: "",
      cacNumber: "",
    },
  });

 async function onSubmit(values: SignUpValues) {
  setError(null);

  const {
    email, password, firstname, lastname, phone,
    businessName, businessType, category, cacNumber,
  } = values;

  const { error } = await authClient.signUp.email({
    email,
    password,
    name: `${firstname} ${lastname}`,
    callbackURL: "/dashboard",
    firstname,
    lastname,
    phone,
    role,
    businessName: businessName ?? "",
    ...(role === "BUYER"
      ? { businessType: businessType ?? "" }
      : { category: category ?? "", cacNumber: cacNumber ?? "" }),
  });

  if (error) {
    setError(error.message || "Something went wrong");
  } else {
    toast.success("Signed up successfully");
    router.push("/dashboard");
  }
}

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">
          Sign Up as {role === "BUYER" ? "Buyer" : "Supplier"}
        </CardTitle>
        <CardDescription className="text-xs md:text-sm">
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="your@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="080..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="businessName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Business Name{" "}
                    {role === "BUYER" && (
                      <span className="text-muted-foreground">(optional)</span>
                    )}
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Your business name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {role === "BUYER" && (
              <FormField
                control={form.control}
                name="businessType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Business Type <span className="text-muted-foreground">(optional)</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Retailer, Restaurant, Manufacturer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {role === "SUPPLIER" && (
              <>
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Agro-commodities, Electronics" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cacNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        CAC Registration Number{" "}
                        <span className="text-muted-foreground">(optional)</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="RC123456" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput autoComplete="new-password" placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="passwordConfirmation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <PasswordInput autoComplete="new-password" placeholder="Confirm password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && (
              <div role="alert" className="text-sm text-red-600">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Creating account..." : "Create an account"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <div className="flex w-full justify-center border-t pt-4">
          <p className="text-muted-foreground text-center text-xs">
            Already have an account?{" "}
            <Link href="/sign-in" className="underline">
              Sign in
            </Link>
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}