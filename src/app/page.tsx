'use client'

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { logout } from "@/actions/auth/logout";
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.push('/');
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
            <Link href="/auth/login" passHref>
                <Button>
                    Go to Login
                </Button>
            </Link>
            <Link href="/auth/register" passHref>
                <Button>
                    Go to Register
                </Button>
            </Link>
            <form action={handleLogout}>
                <Button type="submit">
                    Logout
                </Button>
            </form>
        </div>
    );
}

