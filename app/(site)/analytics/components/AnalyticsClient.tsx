"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface AnalyticsProps {
  links: Array<{
    id: string;
    title: string;
    url: string;
    clicks: number;
  }>;
}

export default function AnalyticsClient({ links }: AnalyticsProps) {
  
  const data = links.map(link => ({
    name: link.title, 
    clicks: link.clicks 
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
        <h2 className="text-xl font-bold mb-6 text-gray-100">Wykres Kliknięć</h2>
        <div className="h-[300px] w-full">
            {links.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                        <XAxis 
                            dataKey="name" 
                            stroke="#9CA3AF" 
                            fontSize={12} 
                            tickLine={false} 
                            axisLine={false} 
                        />
                        <YAxis 
                            stroke="#9CA3AF" 
                            fontSize={12} 
                            tickLine={false} 
                            axisLine={false} 
                            allowDecimals={false}
                        />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }}
                            cursor={{ fill: '#374151', opacity: 0.4 }}
                        />
                        <Bar 
                            dataKey="clicks" 
                            fill="#818cf8" 
                            radius={[4, 4, 0, 0]} 
                            barSize={40}
                        />
                    </BarChart>
                </ResponsiveContainer>
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-500">
                    <p>Brak danych do wyświetlenia.</p>
                    <p className="text-sm">Dodaj linki i kliknij w nie!</p>
                </div>
            )}
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
        <h2 className="text-xl font-bold mb-6 text-gray-100">Szczegóły</h2>
        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-600">
            {links.map((link, index) => (
                <div key={link.id} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors">
                    <div className="flex items-center space-x-4">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-700 text-sm font-bold text-gray-300 border border-gray-600">
                            {index + 1}
                        </span>
                        <div className="min-w-0">
                            <p className="font-medium text-white truncate">{link.title}</p>
                            <p className="text-xs text-gray-400 truncate max-w-[150px]">{link.url}</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-indigo-400 font-bold text-lg">{link.clicks}</span>
                        <span className="text-gray-500 text-xs uppercase tracking-wider">kliknięć</span>
                    </div>
                </div>
            ))}
            {links.length === 0 && (
                 <p className="text-center text-gray-500 py-4">Lista jest pusta</p>
            )}
        </div>
      </div>
    </div>
  );
}