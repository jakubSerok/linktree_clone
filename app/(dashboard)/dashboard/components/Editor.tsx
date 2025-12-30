"use client";

import { User } from "@prisma/client";
import { useState } from "react";
import { updateUser } from "@/actions/user";
import { addLink, deleteLink, updateLink } from "@/actions/links";

interface EditorProps {
  user: User & {
    links: Array<{
      id: string;
      title: string;
      url: string;
      userId: string;
    }>;
  };
}

export default function Editor({ user }: EditorProps) {
  const [username, setUsername] = useState(user.username || '');
  const [bio, setBio] = useState(user.bio || '');
  const [links, setLinks] = useState(user.links);
  const [linkTitle, setLinkTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [editingLink, setEditingLink] = useState<{ id: string; title: string; url: string } | null>(null);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await updateUser(username, bio, user.email);
    if (result?.error) {
      console.error(result.error);
    } else {
      alert('Profile updated successfully!');
    }
  };

  const handleLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await addLink(linkTitle, linkUrl, user.id);
    if (result?.error) {
      console.error(result.error);
    } else if (result?.data) {
      setLinkTitle('');
      setLinkUrl('');
      setLinks([...links, result.data]);
      alert('Link added successfully!');
    }
  };

  const handleDeleteLink = async (linkId: string) => {
    if (!confirm('Are you sure you want to delete this link?')) return;
    
    const result = await deleteLink(linkId, user.id);
    if (!result?.error) {
      const updatedLinks = links.filter(link => link.id !== linkId);
      setLinks(updatedLinks);
    }
  };

  const handleUpdateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLink) return;

    const result = await updateLink(
      editingLink.id,
      editingLink.title,
      editingLink.url,
      user.id
    );

    if (!result?.error) {
      const updatedLinks = links.map(link => 
        link.id === editingLink.id ? { ...link, ...editingLink } : link
      );
      setLinks(updatedLinks);
      setEditingLink(null);
      alert('Link updated successfully!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
          Edit Your Page
        </h1>
        <p className="mt-2 text-gray-400">Customize your profile and links</p>
      </div>
      
      {/* Profile Section */}
      <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Profile Settings
        </h2>
        <form onSubmit={handleProfileSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-3 pl-10 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter username"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
            <div className="relative">
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-3 pl-10 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 h-32"
                placeholder="Tell us about yourself..."
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium py-3 px-6 rounded-lg hover:opacity-90 transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg hover:shadow-purple-500/20"
          >
            Save Profile
          </button>
        </form>
      </div>

      {/* Links Section */}
      <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            Your Links
          </h2>
          <span className="bg-gray-700 text-purple-300 text-xs font-medium px-3 py-1 rounded-full">
            {links.length} {links.length === 1 ? 'Link' : 'Links'}
          </span>
        </div>
        
        {/* Links List */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-300 mb-4">Current Links</h3>
          {links.length > 0 ? (
            <ul className="space-y-3">
              {links.map((link) => (
                <li key={link.id} className="group bg-gray-700/50 hover:bg-gray-700/80 border border-gray-600 rounded-lg p-4 transition-all duration-200">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-white truncate">{link.title}</div>
                      <a 
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-purple-300 hover:text-purple-200 text-sm truncate block mt-1"
                      >
                        {link.url}
                      </a>
                    </div>
                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={() => setEditingLink({ id: link.id, title: link.title, url: link.url })}
                        className="p-2 text-gray-300 hover:text-purple-400 hover:bg-gray-600 rounded-lg transition-colors"
                        title="Edit link"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteLink(link.id)}
                        className="p-2 text-gray-300 hover:text-red-400 hover:bg-gray-600 rounded-lg transition-colors"
                        title="Delete link"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8 bg-gray-700/30 rounded-lg border-2 border-dashed border-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-400">No links added yet. Add your first link below!</p>
            </div>
          )}
        </div>

        {/* Add/Edit Link Form */}
        <div className="bg-gray-700/50 p-6 rounded-xl border border-dashed border-gray-600">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            {editingLink ? 'Edit Link' : 'Add New Link'}
          </h3>
          <form 
            onSubmit={editingLink ? handleUpdateLink : handleLinkSubmit} 
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
              <div className="relative">
                <input
                  type="text"
                  value={editingLink?.title || linkTitle}
                  onChange={(e) => 
                    editingLink
                      ? setEditingLink({...editingLink, title: e.target.value})
                      : setLinkTitle(e.target.value)
                  }
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-3 pl-10 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g. My Portfolio"
                  required
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">URL</label>
              <div className="relative">
                <input
                  type="url"
                  value={editingLink?.url || linkUrl}
                  onChange={(e) =>
                    editingLink
                      ? setEditingLink({...editingLink, url: e.target.value})
                      : setLinkUrl(e.target.value)
                  }
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-3 pl-10 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="https://example.com"
                  required
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
            </div>
            <div className="flex space-x-3 pt-2">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium py-2.5 px-4 rounded-lg hover:opacity-90 transition-all duration-200 flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {editingLink ? 'Update Link' : 'Add Link'}
              </button>
              {editingLink && (
                <button
                  type="button"
                  onClick={() => setEditingLink(null)}
                  className="px-4 py-2.5 bg-gray-600 hover:bg-gray-500 text-white font-medium rounded-lg transition-colors duration-200 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}