"use server"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { signIn } from "@/auth"
import { AuthError } from "next-auth";

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
                bio:"",
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
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    const validatedFields = loginSchema.safeParse({
        email,
        password
    })

    if (!validatedFields.success) {
        return { error: "Invalid data provided!" }
    }

    try {
       
        await signIn("credentials", {
            email,
            password,
            redirectTo: "/dashboard",
        })
    } catch (error) {
       
        
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return { error: 'Invalid credentials.' };
                default:
                    return { error: 'Something went wrong.' };
            }
        }
        throw error; 
    }
    

    return { success: "Login successful!" }
}
export async function updateUser(username: string, bio: string, email: string) {
  try {
    const updatedUser = await db.user.update({
      where: { email },
      data: {
        username,
        bio
      }
    });
    return { success: "Profile updated successfully!" };
  } catch (error) {
    console.error('Update error:', error);
    return { error: "Failed to update profile. Please try again." };
  }
}