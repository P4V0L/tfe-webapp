"use client";

import React, { Suspense } from "react";
import {RegisterForm} from "@/components/auth/register-form";

const RegisterPage = () => {
    return (
        <Suspense fallback={<div>Cargando...</div>}>
            <div className="flex flex-col items-center justify-center fit-content gap-4 mt-10">
                <RegisterForm/>
            </div>
        </Suspense>
    );
};

export default RegisterPage;