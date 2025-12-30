import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { z } from "zod"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"
import { authConfig } from "./auth.config"

export async function getUser(email:string) {
    try{
        const user = await db.user.findUnique({where:{email},include: {
      links: {
        orderBy: {
          createdAt: 'desc'
        }
      }
    }})
        return user;
    }
    catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export const {handlers,auth,signIn,signOut} = NextAuth({
    ...authConfig,
    providers:[
        Credentials({
            async authorize(credentials){
                const parsedCredentails = z.object({email:z.string().email(),password:z.string().min(6)})
                .safeParse(credentials)

                if(parsedCredentails.success){
                    const {email,password} = parsedCredentails.data
                    const user = await getUser(email)
                    if(!user) return null
                    const passwordsMatch = await bcrypt.compare(password,user.password)
                    if(passwordsMatch) return user

                }
                console.log('Invalid credentials');
        return null;
            }
        })
    ]
})