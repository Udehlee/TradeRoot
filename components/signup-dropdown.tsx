"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/app/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function SignupDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(buttonVariants({ variant: "default" }))}
      >
        Sign Up
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem >
          <Link href="/signup/buyer" className="w-full cursor-pointer">
            Buyer
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem >
          <Link href="/signup/supplier" className="w-full cursor-pointer">
            Supplier
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}