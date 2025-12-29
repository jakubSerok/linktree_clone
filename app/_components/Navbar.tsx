import { ReactNode } from "react";
import Link from "next/link";
import { auth } from "@/auth";
export default async function Navbar() {
  const session = await auth()
  
  return  <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">LinkTree Clone</h1>
          <div className="space-x-4 flex gap-2 items-center ">
            {session ?  <Link 
              href="/dashboard"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Profile
            </Link>:
            <Link 
              href="/login" 
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Sign In
            </Link>}
            <Link 
              href="/register"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>
;
}