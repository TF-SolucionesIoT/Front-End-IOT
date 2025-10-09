import { PlaceHolderImages } from "@/lib/placeholder-images";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { CreditCard, LogOut, Settings, User } from "lucide-react";

export function UserNav() {
  const userAvatar = PlaceHolderImages.find((img) => img.id === "user-avatar-1");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            {userAvatar && (
              <AvatarImage
                src={userAvatar.imageUrl}
                alt="User avatar"
                data-ai-hint={userAvatar.imageHint}
              />
            )}
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Jane Doe</p>
            <p className="text-xs leading-none text-muted-foreground">
              jane.doe@example.com
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href="/app/settings/profile" passHref>
            <DropdownMenuItem>
              <User />
              Profile
            </DropdownMenuItem>
          </Link>
          <Link href="/app/settings/device" passHref>
            <DropdownMenuItem>
              <CreditCard />
              Device
            </DropdownMenuItem>
          </Link>
          <Link href="/app/settings/profile" passHref>
            <DropdownMenuItem>
              <Settings />
              Settings
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <Link href="/auth/login" passHref>
          <DropdownMenuItem>
            <LogOut />
            Log out
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
