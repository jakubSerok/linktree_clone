"use server"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { signIn } from "@/auth"

const registerSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    username: z.string().min(3, "Username must be at least 3 characters")
})

const loginSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters")
})

export async function registerUser(
    prevState: { error?: string; success?: string } | null,
    formData: FormData
) {
    try {
        const email = formData.get("email") as string
        const password = formData.get("password") as string
        const username = formData.get("username") as string

        const validatedFields = registerSchema.safeParse({
            email,
            password,
            username
        })

        if (!validatedFields.success) {
            return { error:  "Invalid data provided!" }
        }

        const existingUser = await db.user.findUnique({ where: { email } })
        if (existingUser) return { error: "Email already in use" }

        const hashedPassword = await bcrypt.hash(password, 10)

        await db.user.create({
            data: {
                email,
                username,
                password: hashedPassword,
            }
        })

        return { 
            success: "Account created successfully! You can now log in." 
        }
    } catch (error) {
        console.error("Registration error:", error)
        return { 
            error: "An error occurred during registration. Please try again." 
        }
    }
}

export async function loginUser(
    prevState: { error?: string; success?: string } | null,
    formData: FormData
) {
    try {
        const email = formData.get("email") as string
        const password = formData.get("password") as string

        const validatedFields = loginSchema.safeParse({
            email,
            password
        })

        if (!validatedFields.success) {
            return { 
                error:  "Invalid data provided!" 
            }
        }

        const existingUser = await db.user.findUnique({ 
            where: { email } 
        })

        if (!existingUser || !existingUser.password) {
            return { 
                error: "Invalid email or password" 
            }
        }

        const passwordsMatch = await bcrypt.compare(password, existingUser.password)
        
        if (!passwordsMatch) {
            return { 
                error: "Invalid email or password" 
            }
        }

        await signIn("credentials", {
            email,
            password,
            redirectTo: "/dashboard"
        })

        return { 
            success: "Login successful!" 
        }
    } catch (error) {
        console.error("Login error:", error)
        
    
        return { 
            error: "An error occurred during login. Please try again." 
        }
    }
}