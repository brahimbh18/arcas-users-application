import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { Trip } from '../types';
import { Truck, CheckCircle2, Clock, Calendar } from 'lucide-react';

export const Trips: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const { data, error } = await supabase
          .from('trips')
          .select('*')
          .order('date', { ascending: false });
        
        if (data) setTrips(data as Trip[]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'text-green-600 bg-green-50 border-green-100';
      case 'In Transit':
        return 'text-blue-600 bg-blue-50 border-blue-100';
      default:
        return 'text-yellow-600 bg-yellow-50 border-yellow-100';
    }
  };

  return (
    <div className="p-4 pb-24 min-h-screen bg-oleum-50">
      <header className="mb-6">
        <h2 className="text-2xl font-bold text-oleum-900">Shipments</h2>
        <p className="text-oleum-600">Track your transfers</p>
      </header>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map(i => <div key={i} className="h-32 bg-white rounded-xl animate-pulse" />)}
        </div>
      ) : (
        <div className="relative space-y-6 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:-translate-x-px before:bg-gradient-to-b before:from-gray-200 before:via-gray-200 before:to-transparent">
          {trips.length > 0 ? trips.map((trip) => (
            <div key={trip.id} className="relative flex gap-4">
              <div className="absolute left-0 mt-5 h-2.5 w-2.5 translate-x-1.5 rounded-full bg-gray-300 ring-4 ring-white" />
              
              <div className="ml-8 flex-1 bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-3">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${getStatusColor(trip.status)}`}>
                    {trip.status}
                  </span>
                  <div className="flex items-center text-xs text-gray-400 gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(trip.date).toLocaleDateString()}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Origin</p>
                      <p className="font-semibold text-gray-800">{trip.origin}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-300">
                     <div className="h-px bg-gray-200 flex-1" />
                     <Truck className="w-4 h-4 text-oleum-400" />
                     <div className="h-px bg-gray-200 flex-1" />
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Destination</p>
                    <p className="font-semibold text-gray-800">{trip.destination}</p>
                  </div>
                </div>

                {trip.driver_name && (
                  <div className="mt-4 pt-3 border-t border-gray-50 flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                      <span className="text-xs font-bold">D</span>
                    </div>
                    Driver: {trip.driver_name}
                  </div>
                )}
              </div>
            </div>
          )) : (
            <div className="ml-8 py-10 text-gray-400 text-center bg-white rounded-xl border border-dashed border-gray-200">
              <p>No active trips recorded.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};