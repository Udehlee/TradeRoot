"use client"

import { authClient } from "@/app/lib/auth-client"
import { useRouter } from "next/navigation";
import { toast } from "sonner"
import { Button } from "@/components/ui/button"


export function LogoutButton() {
    const router = useRouter();

    async function handleLogout(){
        const { error } = await authClient.signOut();

        if (error) {
            toast.error(error.message || "failed to logout")

        }else{
            toast.success("logout successfully")
            router.push("/signin")
            
        }
    }

    return(

        <Button
         variant="destructive"
         onClick={handleLogout}>
            logout
        </Button>

    )
}