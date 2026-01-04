import { auth, getUser } from "@/auth";
import { redirect } from "next/navigation";
import DashboardManager from "./components/DashboardManager";
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
    <div>
      
            <DashboardManager initialUser={user}/>
       
      
      
    </div>
  );
}