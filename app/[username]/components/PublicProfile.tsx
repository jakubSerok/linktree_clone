import { User } from "@prisma/client";
import Link from "next/link";

interface PreviewProps {
  user: User & {
    links: Array<{
      id: string;
      title: string;
      url: string;
      userId: string;
    }>;
  };
}

const PublicProfile = ({ user }: PreviewProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div 
        className="pt-20 pb-12 px-6 text-center bg-indigo-600 text-white"
      >
        <div className="max-w-md mx-auto">
          <div className="w-32 h-32 bg-white rounded-full mx-auto mb-6 flex items-center justify-center text-5xl font-bold text-indigo-600 shadow-lg">
            {user.username ? user.username[0].toUpperCase() : '?'}
          </div>
          <h1 className="text-3xl font-bold mb-2">@{user.username}</h1>
          {user.bio && (
            <p className="text-indigo-100 text-lg mb-4">{user.bio}</p>
          )}
          {user.email && (
            <p className="text-indigo-200 text-sm">{user.email}</p>
          )}
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-8">
        {user.links.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            <p className="text-lg">No links to display</p>
            <p className="text-sm mt-2">Check back later for updates!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {user.links.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-indigo-300"
              >
                <span className="font-medium text-gray-800">{link.title}</span>
                <span className="block text-sm text-gray-500 truncate mt-1">{link.url}</span>
              </a>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-indigo-600">
            <span>Created with</span>
            <svg className="w-4 h-4 mx-1 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            <span>LinkTree Clone</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;