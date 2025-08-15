"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { LogOut, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function GoogleAuth() {
  const { data: session, status } = useSession();
  const { toast } = useToast();

  const handleSignIn = async () => {
    try {
      await signIn("google", { 
        callbackUrl: "/discover",
        redirect: true 
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Sign in failed",
        description: "Please try again.",
      });
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut({ 
        callbackUrl: "/",
        redirect: true 
      });
      toast({
        title: "Signed out successfully",
        description: "Your data is secure. See you next time!",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Sign out failed",
        description: "Please try again.",
      });
    }
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (session) {
    return (
      <div className="flex items-center gap-4 p-4 bg-card rounded-lg border">
        <Avatar className="h-10 w-10">
          <AvatarImage src={session.user?.image || ""} alt={session.user?.name || ""} />
          <AvatarFallback>
            <User className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="font-medium text-sm">{session.user?.name}</p>
          <p className="text-xs text-muted-foreground">{session.user?.email}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleSignOut}
          className="gap-2"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-primary-foreground">Welcome to Buzz App Uganda</h2>
        <p className="text-muted-foreground">
          Sign in with Google to discover the hottest nightlife spots
        </p>
      </div>
      
      <Button
        onClick={handleSignIn}
        className="w-full gap-3 bg-white text-gray-900 hover:bg-gray-100 border border-gray-300"
        size="lg"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Continue with Google
      </Button>
      
      <p className="text-xs text-center text-muted-foreground">
        🔒 Your data is secure and protected. We only use your Google account for authentication.
      </p>
    </div>
  );
}
