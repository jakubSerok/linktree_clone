import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import AnalyticsClient from "./components/AnalyticsClient";


export default async function AnalyticsPage() {
    const session = await auth()

    if(!session?.user?.email) redirect("/login")

        const user = await db.user.findUnique({
            where:{email:session.user.email}
        })

if (!user) redirect("/login");

const links = await db.link.findMany({
    where: {
      userId: user.id 
    },
    orderBy: {
      clicks: 'desc' 
    },    
  });
  const totalClicks = links.reduce((sum, link) => sum + link.clicks, 0);
    return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Statystyki</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
            <h3 className="text-gray-400 text-sm font-medium">Całkowite Kliknięcia</h3>
            <p className="text-4xl font-bold text-indigo-400 mt-2">{totalClicks}</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
            <h3 className="text-gray-400 text-sm font-medium">Aktywne Linki</h3>
            <p className="text-4xl font-bold text-pink-400 mt-2">{links.length}</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
            <h3 className="text-gray-400 text-sm font-medium">Najlepszy Link</h3>
            <div className="mt-2">
                <p className="text-xl font-bold text-green-400 truncate">
                    {links[0]?.title || "Brak danych"}
                </p>
                <p className="text-xs text-gray-500 truncate">{links[0]?.url}</p>
            </div>
          </div>
        </div>

        <AnalyticsClient links={links} />
        
      </div>
    </div>
  )
}

