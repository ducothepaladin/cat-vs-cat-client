import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { Link } from "react-router-dom";
import useRegister from "../../hooks/useRegister";

const registerSchema = z
  .object({
    name: z
      .string()
      .nonempty("Name is required")
      .min(2, { message: "Name must be at least 2 characters long" }),
    email: z.string().email().nonempty("Email is required"),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
    confirmPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
  })
  .refine((data) => data.confirmPassword === data.password, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export default function RegisterForm() {
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
  });

  const { mutate } = useRegister();

  const handleRegister = (data: z.infer<typeof registerSchema>) => {
    mutate({ name: data.name, email: data.email, password: data.password });
  };

  return (
    <div className="w-full h-lvh flex justify-center items-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleRegister)}
          className="w-full max-w-md p-8 bg-white shadow-2xl rounded-2xl space-y-6 transform transition-all duration-500 hover:scale-105 hover:shadow-3xl"
        >
          <h1 className="text-center text-4xl font-extrabold text-gray-800 tracking-tight">
            Create Account
          </h1>
          <p className="text-center text-gray-500 text-sm">
            Join us and boost your productivity!
          </p>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">
                  Name
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your name"
                    {...field}
                    className="border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your email"
                    type="email"
                    {...field}
                    className="border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">
                  Password
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your password"
                    {...field}
                    className="border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all"
                    type="password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">
                  Confirm Password
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Confirm your password"
                    type="password"
                    {...field}
                    className="border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:bg-gray-300 transition-all font-medium shadow-md hover:shadow-lg"
            disabled={!form.formState.isValid}
          >
            Sign Up
          </Button>

          <p className="text-center text-gray-600 text-sm">
            Already have an account?{" "}
            <Link
              to="/auth"
              className="text-blue-600 hover:underline font-medium transition-all"
            >
              Login
            </Link>
          </p>
          <p className="text-center text-gray-500 text-xs mt-4">
            © {new Date().getFullYear()} Productivity Bot. All rights reserved.
          </p>
        </form>
      </Form>
    </div>
  );
}
