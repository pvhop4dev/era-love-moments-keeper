import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DateInput } from "@/components/ui/date-input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import Eri from "@/components/mascot/Eri";
import authService from "@/services/auth.service";
import { useAuth } from "@/contexts/AuthContext";
import { AxiosError } from "axios";

interface FormData {
  name?: string;
  partnerName?: string;
  email: string;
  password: string;
  confirmPassword?: string;
  anniversaryDate?: string;
  dateOfBirth?: string;
  gender?: "male" | "female" | "other";
}

interface AuthFormProps {
  defaultTab?: "login" | "register";
}

const AuthForm = ({ defaultTab = "login" }: AuthFormProps) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    partnerName: "",
    email: "",
    password: "",
    confirmPassword: "",
    anniversaryDate: "",
    dateOfBirth: "",
    gender: undefined,
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState(defaultTab);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleGenderChange = (value: string) => {
    setFormData({
      ...formData,
      gender: value as "male" | "female" | "other",
    });
  };


  const handleTabChange = (value: string) => {
    if (value === "login" || value === "register") {
      setCurrentTab(value);
    }
  };


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authService.login({
        email: formData.email,
        password: formData.password,
      });
      
      // Update auth context
      authLogin(response.user, response.accessToken);
      
      toast.success(t('loginSuccess'));
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      
      if (error instanceof AxiosError) {
        const message = error.response?.data?.message || error.response?.data?.error;
        if (error.response?.status === 401) {
          toast.error(message || t('invalidPassword'));
        } else {
          toast.error(message || t('loginError'));
        }
      } else {
        toast.error(t('loginError'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate fields
    if (!formData.name || !formData.dateOfBirth || !formData.gender) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error(t('passwordMismatch'));
      return;
    }
    
    setIsLoading(true);

    try {
      const userData = await authService.register({
        name: formData.name || "",
        email: formData.email,
        password: formData.password,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
      });
      
      // Login after successful registration
      const loginResponse = await authService.login({
        email: formData.email,
        password: formData.password,
      });
      
      // Update auth context
      authLogin(loginResponse.user, loginResponse.accessToken);
      
      toast.success(t('registrationSuccess'));
      navigate("/dashboard");
    } catch (error) {
      console.error("Registration error:", error);
      
      if (error instanceof AxiosError) {
        const message = error.response?.data?.message || error.response?.data?.error;
        if (error.response?.status === 409) {
          toast.error(message || t('emailExists'));
        } else {
          toast.error(message || t('registrationError'));
        }
      } else {
        toast.error(t('registrationError'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getEriMessage = () => {
    if (currentTab === "login") {
      return "Welcome back! I'm so excited to see you again. Let's continue your love journey together! 💕";
    } else {
      return "Hi there! I'm Eri, your love messenger! Let's start by getting to know you better. Please fill in your information to begin! ✨";
    }
  };

  return (
    <div className="space-y-4">
      <Eri 
        message={getEriMessage()}
        size="medium"
        className="justify-center"
      />
      
      <Tabs defaultValue={defaultTab} className="w-[400px] max-w-full" onValueChange={handleTabChange}>
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
              <CardTitle className="text-xl text-center text-love-700">
                Start Your Love Journey
              </CardTitle>
              <CardDescription className="text-center">
                Tell us about yourself to begin
              </CardDescription>
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
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <DateInput
                    id="dateOfBirth"
                    name="dateOfBirth"
                    required
                    value={formData.dateOfBirth}
                    onChange={(value) => setFormData({ ...formData, dateOfBirth: value })}
                  />
                </div>
                <div className="space-y-3">
                  <Label>Gender</Label>
                  <RadioGroup value={formData.gender} onValueChange={handleGenderChange}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male">Male</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female">Female</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="other" />
                      <Label htmlFor="other">Other</Label>
                    </div>
                  </RadioGroup>
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
                <p className="text-sm text-muted-foreground text-center">
                  You'll be able to set your avatar after registration
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit" 
                  className="w-full love-button" 
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuthForm;
