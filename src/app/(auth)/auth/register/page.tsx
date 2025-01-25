"use client";

import React, { Suspense } from "react";
import {RegisterForm} from "@/components/auth/register-form";

const RegisterPage = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <RegisterForm/>
        </Suspense>
    );
};

export default RegisterPage;