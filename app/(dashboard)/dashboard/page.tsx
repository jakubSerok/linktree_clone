import { auth, getUser } from "@/auth";
import { redirect } from "next/navigation";
import Editor from "./components/Editor";
import Preview from "./components/Preview";

export default async function DashboardPage() {
  const session = await auth();
  
  if (!session?.user?.email) {
    redirect("/login");
  }
  
  const user = await getUser(session.user.email);
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <main className="container mx-auto px-4 py-8">
        <div className=" flex">
          <Editor user={user} />
          
          <Preview/>
        </div>
      </main>
      
      
    </div>
  );
}