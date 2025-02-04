"use client";

import React, { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";

const LoginPage = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <div className="flex flex-col items-center justify-center fit-content gap-4 mt-10">
                <LoginForm />
            </div>
        </Suspense>
    );
};

export default LoginPage;