
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Lock, LogIn, Mail, Phone, User, UserPlus } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

const formSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

// For demo purposes - in real app, this should be in a secure backend
const DEMO_USER = {
  username: "admin",
  password: "admin123",
  phone: "123456"
};

// login schema
const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

// Registration form schema
const registerSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email format"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string().min(1, "Confirm password is required"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// OTP verification schema
const otpSchema = z.object({
  otp: z.string().min(6, "OTP must be 6 digits"),
});


const LoginPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("login");
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [registrationData, setRegistrationData] = useState<any>(null);
  
  // Login form
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
    },
  });

  // OTP form
  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const handleLogin = (values: z.infer<typeof loginSchema>) => {
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

  const handleRegister = (values: z.infer<typeof registerSchema>) => {
    // In a real app, this would send the registration data to a backend
    setRegistrationData(values);
    setShowOtpVerification(true);
    
    toast({
      title: "Verification code sent",
      description: "Please check your phone for the OTP. (Use 123456 for demo)",
    });
  };

  const handleVerifyOTP = (values: z.infer<typeof otpSchema>) => {
    // For demo purposes, we'll check if OTP is "123456"
    if (values.otp === DEMO_USER.phone) {
      // In a real app, this would create a new user in the database
      toast({
        title: "Registration successful!",
        description: "You can now login with your credentials.",
      });
      setShowOtpVerification(false);
      setActiveTab("login");
      
      // Pre-fill login form with the registered email
      loginForm.setValue("username", registrationData.email);
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Invalid OTP. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-xl">
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
      {showOtpVerification ? (
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-center">Verify your phone number</h2>
              <p className="text-center text-sm text-muted-foreground">
                We've sent a 6-digit verification code to your phone
              </p>
              
              <Form {...otpForm}>
                <form onSubmit={otpForm.handleSubmit(handleVerifyOTP)} className="space-y-4">
                  <FormField
                    control={otpForm.control}
                    name="otp"
                    render={({ field }) => (
                      <FormItem className="flex flex-col items-center space-y-3">
                        <FormControl>
                          <InputOTP maxLength={6} {...field}>
                            <InputOTPGroup>
                              <InputOTPSlot index={0} />
                              <InputOTPSlot index={1} />
                              <InputOTPSlot index={2} />
                              <InputOTPSlot index={3} />
                              <InputOTPSlot index={4} />
                              <InputOTPSlot index={5} />
                            </InputOTPGroup>
                          </InputOTP>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex gap-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setShowOtpVerification(false)}
                    >
                      Back
                    </Button>
                    <Button type="submit" className="w-full">
                      Verify & Register
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                placeholder="Username or Email" 
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
                      control={loginForm.control}
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
                    <Button type="submit" className="w-full">
                      Sign In
                    </Button>
                  </form>
                </Form>
              </TabsContent>
              
              <TabsContent value="register">
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
                    <FormField
                      control={registerForm.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                placeholder="Full Name" 
                                {...field}
                                className="pl-10"
                              />
                                                            <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                type="email" 
                                placeholder="Email" 
                                {...field}
                                className="pl-10"
                              />
                              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                placeholder="Phone Number" 
                                {...field}
                                className="pl-10"
                              />
                              <Phone className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
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
                    <FormField
                      control={registerForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                type="password" 
                                placeholder="Confirm Password" 
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
                    <Button type="submit" className="w-full">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Register
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          )}
      </CardContent>
    </Card>
  </div>
  );
};

export default LoginPage;