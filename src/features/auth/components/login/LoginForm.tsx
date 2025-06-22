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
import useLogin from "../../hooks/useLogin";

const loginSchema = z
    .object({
        email: z.string().email().nonempty("Email is required"),
        password: z
            .string()
            .min(8, { message: "Password must be at least 8 characters long" }),
    });

export default function LoginForm() {
    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
    });

    const {mutate} = useLogin();


    const handleLogin = (data: z.infer<typeof loginSchema>) => {
        mutate({...data});
    }

    return (
        <div className="w-full h-lvh flex justify-center items-center">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleLogin)} className="w-full max-w-md p-8 bg-white shadow-2xl rounded-2xl space-y-6 transform transition-all duration-500 hover:scale-105 hover:shadow-3xl">
                    <h1 className="text-center text-4xl font-extrabold text-gray-800 tracking-tight">
                        Welcome Back
                    </h1>
                    <p className="text-center text-gray-500 text-sm">
                        Please login to your account
                    </p>
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-700 font-medium">Email</FormLabel>
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
                                <FormLabel className="text-gray-700 font-medium">Password</FormLabel>
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

                    <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:bg-gray-300 transition-all font-medium shadow-md hover:shadow-lg"
                        disabled={!form.formState.isValid}
                    >
                        Login
                    </Button>

                    <p className="text-center text-gray-600 text-sm">
                        Don't have an account?{" "}
                        <Link
                            to="/auth/register"
                            className="text-blue-600 hover:underline font-medium transition-all"
                        >
                            Register
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
