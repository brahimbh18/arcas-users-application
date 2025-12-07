import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { Press, Facility } from '../types';
import { MapPin, Factory, Warehouse } from 'lucide-react';

export const Network: React.FC = () => {
  const [items, setItems] = useState<(Press | Facility)[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'press' | 'facility'>('all');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [pressRes, facilityRes] = await Promise.all([
          supabase.from('presses').select('*'),
          supabase.from('facilities').select('*'),
        ]);

        const presses = (pressRes.data || []).map((p: any) => ({ ...p, _type: 'press' }));
        const facilities = (facilityRes.data || []).map((f: any) => ({ ...f, _type: 'facility' }));

        setItems([...presses, ...facilities]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredItems = items.filter((item) => {
    if (filter === 'all') return true;
    return (item as any)._type === filter;
  });

  return (
    <div className="p-4 pb-24 min-h-screen bg-oleum-50">
      <header className="mb-6">
        <h2 className="text-2xl font-bold text-oleum-900">Network</h2>
        <p className="text-oleum-600">Find partners & services</p>
      </header>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {['all', 'press', 'facility'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filter === f
                ? 'bg-oleum-800 text-white'
                : 'bg-white text-oleum-600 border border-oleum-100'
            }`}
          >
            {f === 'all' ? 'All Locations' : f === 'press' ? 'Presses' : 'Facilities'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-white rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredItems.map((item) => {
            const isPress = (item as any)._type === 'press';
            return (
              <div
                key={item.id}
                className="bg-white p-5 rounded-xl shadow-sm border border-oleum-100 hover:shadow-md transition-shadow flex items-start justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wide ${
                        isPress ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                      }`}
                    >
                      {isPress ? 'Press' : (item as Facility).type}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
                  <div className="flex items-center gap-1.5 text-gray-500 mt-2 text-sm">
                    <MapPin className="w-4 h-4" />
                    {item.location}
                  </div>
                </div>
                <div
                  className={`p-3 rounded-full ${
                    isPress ? 'bg-oleum-50 text-oleum-600' : 'bg-earth-50 text-earth-600'
                  }`}
                >
                  {isPress ? <Factory className="w-6 h-6" /> : <Warehouse className="w-6 h-6" />}
                </div>
              </div>
            );
          })}
          {filteredItems.length === 0 && (
             <div className="text-center py-10 text-gray-400">
               <p>No locations found.</p>
             </div>
          )}
        </div>
      )}
    </div>
  );
};