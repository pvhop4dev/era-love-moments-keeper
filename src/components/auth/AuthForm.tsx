
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface FormData {
  name?: string;
  partnerName?: string;
  email: string;
  password: string;
  confirmPassword?: string;
  anniversaryDate?: string;
}

const AuthForm = () => {
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

    // Simulate login - In a real app, this would connect to authentication service
    setTimeout(() => {
      // For demo purposes, we'll just log in anyone
      localStorage.setItem("eralove-user", JSON.stringify({
        name: "Demo User",
        partnerName: "Demo Partner",
        email: formData.email,
        anniversaryDate: "2023-05-13"
      }));
      toast.success("Login successful!");
      navigate("/dashboard");
      setIsLoading(false);
    }, 1000);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      setIsLoading(false);
      return;
    }

    // Simulate registration - In a real app, this would connect to authentication service
    setTimeout(() => {
      localStorage.setItem("eralove-user", JSON.stringify({
        name: formData.name,
        partnerName: formData.partnerName,
        email: formData.email,
        anniversaryDate: formData.anniversaryDate
      }));
      toast.success("Registration successful!");
      navigate("/dashboard");
      setIsLoading(false);
    }, 1000);
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
                <Label htmlFor="partnerName">Partner's Name</Label>
                <Input
                  id="partnerName"
                  name="partnerName"
                  placeholder="Your partner's name"
                  required
                  value={formData.partnerName}
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
              <div className="space-y-2">
                <Label htmlFor="anniversaryDate">Anniversary Date</Label>
                <Input
                  id="anniversaryDate"
                  name="anniversaryDate"
                  type="date"
                  required
                  value={formData.anniversaryDate}
                  onChange={handleChange}
                />
              </div>
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
