import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { nextCookies } from "better-auth/next-js"
import prisma from "./prisma";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql"
    }),
    emailAndPassword: {
        enabled: true,
    },
    user: {
        additionalFields: {
            firstname: {
                type: "string",
                required: true,
                input: true,
            },
            lastname: {
                type: "string",
                required: true,
                input: true,
            },
            role: {
                type: "string",
                required: true,
                input: true,
                defaultValue: "BUYER",
            },
            phone: {
                type: "string",
                required: true,
                input: true,
            },
            businessName: {
                type: "string",
                required: false,
                input: true,
            },
            businessType: {
                type: "string",
                required: false,
                input: true,
            },
            category: {
                type: "string",
                required: false,
                input: true,
            },
            cacNumber: {
                type: "string",
                required: false,
                input: true,
            },
        },
    },
    plugins: [nextCookies()]
})