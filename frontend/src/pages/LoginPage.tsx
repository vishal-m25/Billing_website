
import React from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Lock, LogIn } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

// For demo purposes - in real app, this should be in a secure backend
const DEMO_USER = {
  username: "admin",
  password: "admin123"
};

const LoginPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (values.username === DEMO_USER.username && values.password === DEMO_USER.password) {
      localStorage.setItem("isAuthenticated", "true");
      navigate("/home");
      toast({
        title: "Welcome back!",
        description: "Successfully logged in.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Invalid credentials. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-300 via-white to-blue-300 px-4 py-10">
      <Card className="w-[460px] shadow-2xl z-10 bg-white/90 backdrop-blur-md border border-gray-200">
      <CardHeader className="space-y-1 text-center">
      <CardTitle className="text-3xl font-bold tracking-tight">
          Balakumar Automobiles
        </CardTitle>
        {/* <CardTitle className="text-3xl font-bold tracking-tight">
          AutoParts Manager
        </CardTitle> */}
        <CardDescription>
          Enter your credentials to access the system
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        placeholder="Username" 
                        {...field}
                        className="pl-10"
                      />
                      <LogIn className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    </div>
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
                  <FormControl>
                    <div className="relative">
                      <Input 
                        type="password" 
                        placeholder="Password" 
                        {...field}
                        className="pl-10"
                      />
                      <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full text-lg py-2.5">
              Sign In
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  </div>
  );
};

export default LoginPage;