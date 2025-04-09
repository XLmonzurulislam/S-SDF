import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Link } from "wouter";
import { useAuth } from "@/lib/auth";
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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

export default function Login() {
  const { login, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setError(null);
    try {
      await login(values.username, values.password);
    } catch (err) {
      setError("Login failed. Please check your credentials.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-6">
          <div className="inline-block w-16 h-16 text-primary mb-2">
            <svg viewBox="0 0 36 36" fill="currentColor">
              <path d="M18 2.9C9.8 2.9 3.2 9.5 3.2 17.7C3.2 25 8.3 31.2 15.2 32.5V22.1H11.6V17.7H15.2V14.4C15.2 10.8 17.3 8.8 20.6 8.8C22.2 8.8 23.8 9.1 23.8 9.1V12.6H22C20.3 12.6 19.7 13.8 19.7 15V17.7H23.6L23 22.1H19.7V32.5C26.6 31.2 31.7 25 31.7 17.7C31.7 9.5 25.1 2.9 18 2.9Z"></path>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">SocialConnect</h1>
          <p className="text-gray-600 mt-1">Connect with friends and the world around you</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Enter your username and password to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="johndoe" {...field} />
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
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="•••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link href="/register">
                <a className="text-primary font-medium hover:underline">Register</a>
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
