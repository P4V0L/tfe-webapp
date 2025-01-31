"use client"

import Link from "next/link";
import {Button} from "@/components/ui/button";
import {logout} from "@/actions/auth/logout";
import {useRouter} from "next/navigation";
import React, { Suspense } from "react";

const Logout = () => {
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.push('/');
    }

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <div className="flex flex-col items-center justify-center fit-content gap-4 mt-10">
                  <form action={handleLogout}>
                      <Button type="submit">
                          Logout
                      </Button>
                  </form>
            </div>
        </Suspense>
    );
}

export default Logout;