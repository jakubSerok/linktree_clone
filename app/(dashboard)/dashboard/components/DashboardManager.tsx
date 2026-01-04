"use client"
import { useState } from "react";
import { User } from "@prisma/client";
import Editor from "./Editor";
import Preview from "./Preview";

type LinkType = { id: string; title: string; url: string; userId: string };
type UserWithLinks = User & { links: LinkType[] };

export interface Props {
  initialUser: UserWithLinks;
}

export default function DashboardManager({ initialUser }: Props) {
  const [user, setUser] = useState<UserWithLinks>(initialUser);

  
  const handleLinkAdded = (newLink: LinkType) => {
     setUser((prev) => ({ ...prev, links: [...prev.links, newLink] }));
  };

  const handleLinkDeleted = (linkId: string) => {
     setUser((prev) => ({ ...prev, links: prev.links.filter(l => l.id !== linkId) }));
  };

  const handleLinkUpdated = (updatedLink: LinkType) => {
     setUser((prev) => ({
        ...prev,
        links: prev.links.map(l => l.id === updatedLink.id ? updatedLink : l)
     }));
  };

  const handleProfileUpdated = (username: string, bio: string) => {
     setUser((prev) => ({ ...prev, username, bio }));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <main className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
            
                <Editor 
                    user={user} 
                    onLinkAdded={handleLinkAdded}
                    onLinkDeleted={handleLinkDeleted}
                    onLinkUpdated={handleLinkUpdated}
                    onProfileUpdated={handleProfileUpdated}
                />
           

                <Preview user={user}/>
        

        </div>
      </main>
    </div>
  );
}