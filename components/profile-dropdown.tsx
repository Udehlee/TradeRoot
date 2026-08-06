"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { LogoutButton } from "@/app/dashboard/profile/logout";

interface ProfileMenuProps {
  user: {
    firstname: string;
    lastname: string;
    role: string;
  };
}

const ProfileDropDown = ({ user }: ProfileMenuProps) => {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger className="flex items-center gap-2 border border-gray-200 rounded-md px-3 py-2 hover:bg-gray-50 transition-colors">
        <span className="text-sm font-medium">
          {user.firstname}
        </span>

        {open ? (
          <ChevronUp className="h-4 w-4 text-gray-500" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-500" />
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            <p className="text-sm font-medium">
              {user.firstname} {user.lastname}
            </p>

            <p className="text-xs text-gray-500 font-normal capitalize">
              {user.role.toLowerCase()} account
            </p>
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem >
          <Link href="/dashboard/profile">
            Profile
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <div className="px-2 py-1.5">
          <LogoutButton />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileDropDown;