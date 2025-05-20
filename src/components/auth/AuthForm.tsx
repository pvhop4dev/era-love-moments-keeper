import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { useLanguage } from "@/contexts/LanguageContext";

interface FormData {
  name?: string;
  partnerName?: string;
  email: string;
  password: string;
  confirmPassword?: string;
  anniversaryDate?: string;
}

interface User {
  id: string;
  name: string;
  partnerName?: string;
  email: string;
  passwordHash: string; // In a real app, this would be a hashed password
  anniversaryDate?: string;
  createdAt: string;
}

const AuthForm = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    partnerName: "",
    email: "",
    password: "",
    confirmPassword: "",
    anniversaryDate: "",
  });
  
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Get users from storage
      const users: User[] = JSON.parse(localStorage.getItem("eralove-users") || "[]");
      
      // Find user by email
      const user = users.find(u => u.email.toLowerCase() === formData.email.toLowerCase());
      
      if (!user) {
        toast.error(t('userNotFound'));
        setIsLoading(false);
        return;
      }
      
      // In a real app, we would hash and compare passwords
      if (user.passwordHash !== formData.password) {
        toast.error(t('invalidPassword'));
        setIsLoading(false);
        return;
      }
      
      // Store current user
      localStorage.setItem("eralove-user", JSON.stringify({
        name: user.name,
        partnerName: user.partnerName || "",
        email: user.email,
        anniversaryDate: user.anniversaryDate || ""
      }));
      
      toast.success(t('loginSuccess'));
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      toast.error(t('loginError'));
    }
    
    setIsLoading(false);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate password match
      if (formData.password !== formData.confirmPassword) {
        toast.error(t('passwordMismatch'));
        setIsLoading(false);
        return;
      }
      
      // Get existing users
      const users: User[] = JSON.parse(localStorage.getItem("eralove-users") || "[]");
      
      // Check if email already exists
      if (users.some(u => u.email.toLowerCase() === formData.email.toLowerCase())) {
        toast.error(t('emailExists'));
        setIsLoading(false);
        return;
      }
      
      // Create new user
      const newUser: User = {
        id: uuidv4(),
        name: formData.name || "",
        email: formData.email,
        passwordHash: formData.password, // In a real app, this would be hashed
        createdAt: new Date().toISOString()
      };
      
      // Add to users collection
      users.push(newUser);
      localStorage.setItem("eralove-users", JSON.stringify(users));
      
      // Set as current user
      localStorage.setItem("eralove-user", JSON.stringify({
        name: newUser.name,
        partnerName: "",
        email: newUser.email,
        anniversaryDate: ""
      }));
      
      toast.success(t('registrationSuccess'));
      navigate("/dashboard");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(t('registrationError'));
    }
    
    setIsLoading(false);
  };

  return (
    <Tabs defaultValue="login" className="w-[400px] max-w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="register">Register</TabsTrigger>
      </TabsList>
      
      <TabsContent value="login">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-center text-love-700">Welcome Back</CardTitle>
            <CardDescription className="text-center">Enter your credentials to access your love journey</CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full love-button" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </TabsContent>
      
      <TabsContent value="register">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-center text-love-700">Start Your Love Journey</CardTitle>
            <CardDescription className="text-center">Create an account to keep track of your special moments</CardDescription>
          </CardHeader>
          <form onSubmit={handleRegister}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Your name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-register">Email</Label>
                <Input
                  id="email-register"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-register">Password</Label>
                <Input
                  id="password-register"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Partner name and anniversary date can be set after connecting with your partner.
              </p>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full love-button" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Register"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default AuthForm;
