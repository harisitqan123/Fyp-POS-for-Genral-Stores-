"use client";

import { useState } from "react";
import { useFormik, FormikHelpers } from "formik";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import { loginSchema } from "@/schemas/loginSchema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Define TypeScript types for the form values
interface LoginFormValues {
  username: string;
  password: string;
}

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const initialValues: LoginFormValues = {
    username: "",
    password: "",
  };

  const onSubmit = async (
    values: LoginFormValues,
    actions: FormikHelpers<LoginFormValues>
  ) => {
    setLoading(true);
    console.log("Form submitted with values:", values);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        username: values.username,
        password: values.password,
      });

      if (res?.error) {
        toast.warning(res.error);
      } else {
        toast.success("Login successful!");
        router.push("/dashboard");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      actions.setSubmitting(false);
    }
  };

  const formik = useFormik<LoginFormValues>({
    initialValues,
    validationSchema: loginSchema,
    onSubmit,
  });

  return (
    <Card className="w-full max-w-sm shadow-xl">
      <CardHeader>
        <CardTitle className="text-center text-xl">Login</CardTitle>
      </CardHeader>
      <CardContent>
        {/* ✅ FIX: Use formik.handleSubmit directly here */}
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <Input
              id="username"
              name="username"
              placeholder="Username"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.username && formik.errors.username && (
              <p className="text-sm text-red-500 mt-1">
                {formik.errors.username}
              </p>
            )}
          </div>

          <div>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-sm text-red-500 mt-1">
                {formik.errors.password}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
