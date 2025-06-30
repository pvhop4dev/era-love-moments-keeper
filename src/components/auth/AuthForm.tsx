import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { useLanguage } from "@/contexts/LanguageContext";
import Eri from "@/components/mascot/Eri";
import AvatarSelector from "@/components/auth/AvatarSelector";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface FormData {
  name?: string;
  partnerName?: string;
  email: string;
  password: string;
  confirmPassword?: string;
  anniversaryDate?: string;
  dateOfBirth?: string;
  gender?: "male" | "female" | "other";
  avatar?: string;
}

interface User {
  id: string;
  name: string;
  partnerName?: string;
  email: string;
  passwordHash: string;
  anniversaryDate?: string;
  dateOfBirth?: string;
  gender?: "male" | "female" | "other";
  avatar?: string;
  createdAt: string;
}

interface AuthFormProps {
  defaultTab?: "login" | "register";
}

const AuthForm = ({ defaultTab = "login" }: AuthFormProps) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    partnerName: "",
    email: "",
    password: "",
    confirmPassword: "",
    anniversaryDate: "",
    dateOfBirth: "",
    gender: undefined,
    avatar: "",
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState(defaultTab);
  const [registerStep, setRegisterStep] = useState(1);

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

  const handleAvatarChange = (avatar: string) => {
    setFormData({
      ...formData,
      avatar,
    });
  };

  const handleTabChange = (value: string) => {
    if (value === "login" || value === "register") {
      setCurrentTab(value);
      setRegisterStep(1); // Reset to step 1 when switching tabs
    }
  };

  const handleNextStep = () => {
    // Validate step 1 fields
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword || !formData.dateOfBirth || !formData.gender) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error(t('passwordMismatch'));
      return;
    }

    setRegisterStep(2);
  };

  const handlePrevStep = () => {
    setRegisterStep(1);
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
        anniversaryDate: user.anniversaryDate || "",
        dateOfBirth: user.dateOfBirth || ""
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
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        avatar: formData.avatar,
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
        anniversaryDate: "",
        dateOfBirth: newUser.dateOfBirth || "",
        gender: newUser.gender,
        avatar: newUser.avatar
      }));
      
      toast.success(t('registrationSuccess'));
      navigate("/dashboard");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(t('registrationError'));
    }
    
    setIsLoading(false);
  };

  const getEriMessage = () => {
    if (currentTab === "login") {
      return "Welcome back! I'm so excited to see you again. Let's continue your love journey together! 💕";
    } else {
      if (registerStep === 1) {
        return "Hi there! I'm Eri, your love messenger! Let's start by getting to know you better. Please fill in your basic information! ✨";
      } else {
        return "Great! Now let's choose your avatar. Pick one that represents you best, or upload your own photo! 🎨";
      }
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
                Start Your Love Journey {registerStep === 2 && "- Choose Avatar"}
              </CardTitle>
              <CardDescription className="text-center">
                {registerStep === 1 
                  ? "Step 1 of 2: Tell us about yourself"
                  : "Step 2 of 2: Choose your avatar"
                }
              </CardDescription>
            </CardHeader>

            {registerStep === 1 ? (
              <form onSubmit={(e) => { e.preventDefault(); handleNextStep(); }}>
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
                    <Input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      required
                      value={formData.dateOfBirth}
                      onChange={handleChange}
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
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full love-button">
                    Next Step
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </form>
            ) : (
              <form onSubmit={handleRegister}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Choose Your Avatar</Label>
                    <AvatarSelector onAvatarChange={handleAvatarChange} selectedAvatar={formData.avatar} />
                  </div>
                  <p className="text-sm text-muted-foreground text-center">
                    Partner name and anniversary date can be set after connecting with your partner.
                  </p>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handlePrevStep}
                    className="flex-1"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1 love-button" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating account..." : "Complete Registration"}
                  </Button>
                </CardFooter>
              </form>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuthForm;
