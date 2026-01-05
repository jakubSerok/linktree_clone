import { User } from "@prisma/client";
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

export default function Preview({user}:PreviewProps) {
  return <div className="hidden lg:block w-1/3 pl-8 sticky top-8 h-[calc(100vh-4rem)]">
      <div className="mockup-phone border-gray-800 border-[14px] rounded-[2.5rem] h-full overflow-hidden bg-white shadow-2xl relative">
        
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-6 w-32 bg-gray-800 rounded-b-xl z-20"></div>

        <div className="h-full overflow-y-auto bg-gray-100 scrollbar-hide">
          
          <div 
            className="pt-16 pb-6 px-6 text-center"
            style={{ backgroundColor: user.username ? '#4F46E5' : '#4F46E5' }} 
          >
            <div className="w-24 h-24 bg-white rounded-full mx-auto border-4 border-white mb-4 flex items-center justify-center text-3xl font-bold text-gray-400">
               {user.username ? user.username[0].toUpperCase() : '?'}
            </div>
            <h2 className="text-white text-xl font-bold">@{user.username}</h2>
            <p className="text-indigo-100 text-sm mt-2">{user.email}</p>
          </div>

          <div className="px-4 py-6 space-y-4">
            {user.links.length === 0 ? (
              <div className="text-center text-gray-400 mt-10 text-sm">
                No links yet...
              </div>
            ) : (
              user.links.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-white p-4 rounded-xl shadow-sm border border-gray-200 text-center hover:scale-105 transition-transform duration-200"
                >
                  <span className="font-semibold text-gray-800">{link.title}</span>
                </a>
              ))
            )}
          </div>

          <div className="mt-8 pb-8 text-center">
            <span className="text-xs font-bold text-gray-400">LinkTree Clone</span>
          </div>

        </div>
      </div>
    </div>;
}