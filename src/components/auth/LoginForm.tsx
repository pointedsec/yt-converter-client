"use client"
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { GetUser, Login } from "@/utils/api";
import { LoginResponse } from "../../types/AuthTypes";
import { useState } from "react";
import { ErrorType } from "../../types/Error";
import ErrorAlert from "../global/ErrorAlert"
import { Loader } from "lucide-react";
import { setStorage } from "@/lib/storage";
import { UseUserStore } from "@/store/userStore";

const LoginSchema = z.object({
  username: z.string().min(2).max(50),
  password: z.string().min(5),
})


export default function LoginForm() {
  const setUser = UseUserStore((state) => state.setUser);
  const [error, setError] = useState<ErrorType | null>(null)
  const [loading, setLoading] = useState(false)
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })
  async function onSubmit(values: z.infer<typeof LoginSchema>) {
    setError(null)
    setLoading(true)
    const response = await Login({ username: values.username, password: values.password })
    if (!response.error) {
      // Store JWT in Local Storage
      const loginResponse = response as LoginResponse
      setStorage("token", loginResponse.token)

      // Retrieve the user using the JWT token and store it with zustand
      const user = GetUser()
      const userData = await user;
      if ('id' in userData) {
        setUser(userData);
      }
      // Redirect to home page
      window.location.href = "/"
      setLoading(false) // If the redirect doesn't works
    }
    // Clean form
    setError(response as ErrorType)
    console.log(response as ErrorType)
    form.reset()
    setLoading(false)
  }

  return (
    <>
      {error !== null && <div className="mb-5"><ErrorAlert message={error.error} /></div>}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="admin" {...field} />
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
                  <Input type="password" placeholder="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={loading} type="submit">
            {loading && <Loader className="animate-spin"></Loader>}
            Login
          </Button>
        </form>
      </Form>
    </>
  )
}