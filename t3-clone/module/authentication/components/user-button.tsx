"use client";

import { useState, type ComponentProps } from "react";
import { User, LogOut, Settings, CreditCard, User as UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const avatarSizes = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
} as const;

interface UserButtonProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    createdAt?: Date | string | null;
  } | null;
  onLogout?: () => void;
  onSettings?: () => void;
  onProfile?: () => void;
  onBilling?: () => void;
  showBadge?: boolean;
  badgeText?: string;
  badgeVariant?: ComponentProps<typeof Badge>["variant"];
  size?: keyof typeof avatarSizes;
  showEmail?: boolean;
  showMemberSince?: boolean;
}

export default function UserButton({
  user,
  onLogout,
  onSettings,
  onProfile,
  onBilling,
  showBadge = false,
  badgeText = "Pro",
  badgeVariant = "default",
  size = "md",
  showEmail = true,
  showMemberSince = true,
}: UserButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

   const onSignOut = async()=>{
    await authClient.signOut({
      fetchOptions:{
        onSuccess:()=>{
          router.push("/sign-in")
        }
      }
    })
  }

  const handleLogout = async () => {
      setIsLoading(true);
      try {
        if (onLogout) {
          onLogout();
        } else {
          await onSignOut();
        }
      } catch (error) {
        console.error("Logout error:", error);
      } finally {
        setIsLoading(false);
      }
  };

  // Get user initials for avatar fallback
  const getUserInitials = (name?: string | null, email?: string | null) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (email) {
      return email.slice(0, 2).toUpperCase();
    }
    return "U";
  };

  // Format member since date
  const formatMemberSince = (date?: Date | string | null) => {
    if (!date) return "";
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      year: "numeric",
    }).format(new Date(date));
  };

  // Don't render if no user
  if (!user) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            className={`relative ${avatarSizes[size]} rounded-full p-0 hover:bg-accent`}
            disabled={isLoading}
          />
        }
      >
        <Avatar className={avatarSizes[size]}>
          <AvatarImage
            src={user.image || "https://res.cloudinary.com/dm3eahafo/image/upload/v1781419243/samples/canvas.jpg"}
            alt={user.name || "User avatar"}
          />
          <AvatarFallback className="bg-primary text-primary-foreground font-medium">
            {getUserInitials(user.name, user.email)}
          </AvatarFallback>
        </Avatar>
        {showBadge && (
          <Badge
            variant={badgeVariant}
            className="absolute -bottom-1 -right-1 h-5 px-1 text-xs"
          >
            {badgeText}
          </Badge>
        )}
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-64" align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={user.image || "https://res.cloudinary.com/dm3eahafo/image/upload/v1781419243/samples/canvas.jpg"}
                    alt={user.name || "User avatar"}
                  />
                  <AvatarFallback className="bg-primary text-primary-foreground font-medium text-lg">
                    {getUserInitials(user.name, user.email)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user.name || "User"}
                  </p>
                  {showEmail && user.email && (
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  )}
                  {showBadge && (
                    <Badge variant={badgeVariant} className="w-fit">
                      {badgeText}
                    </Badge>
                  )}
                </div>
              </div>
              {showMemberSince && (
                <p className="text-xs text-muted-foreground">
                  Member since {formatMemberSince(user.createdAt)}
                </p>
              )}
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator />
        
        {onProfile && (
          <DropdownMenuItem onClick={onProfile} className="cursor-pointer">
            <UserIcon className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>
        )}
        
        {onBilling && (
          <DropdownMenuItem onClick={onBilling} className="cursor-pointer">
            <CreditCard className="mr-2 h-4 w-4" />
            Billing
          </DropdownMenuItem>
        )}
        
        {onSettings && (
          <DropdownMenuItem onClick={onSettings} className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem
          onClick={handleLogout}
          disabled={isLoading}
          className="cursor-pointer focus:text-destructive" 
        >
          <LogOut className="mr-2 h-4 w-4" />
          {isLoading ? "Logging out..." : "Log out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}