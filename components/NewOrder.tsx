import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { Press, Facility, OrderType } from '../types';
import { Droplet, Sprout, Send, Loader2 } from 'lucide-react';

interface NewOrderProps {
  userId: string | number;
}

export const NewOrder: React.FC<NewOrderProps> = ({ userId }) => {
  const [orderType, setOrderType] = useState<OrderType>('olives');
  const [weight, setWeight] = useState<string>('');
  const [volume, setVolume] = useState<string>('');
  const [selectedTarget, setSelectedTarget] = useState<string>('');
  const [presses, setPresses] = useState<Press[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Fetch targets based on selection
  useEffect(() => {
    const fetchData = async () => {
      setFetching(true);
      try {
        if (orderType === 'olives') {
          const { data, error } = await supabase.from('presses').select('*');
          if (!error && data) setPresses(data as Press[]);
        } else {
          const { data, error } = await supabase.from('facilities').select('*');
          if (!error && data) setFacilities(data as Facility[]);
        }
      } catch (err) {
        console.error('Error fetching targets:', err);
      } finally {
        setFetching(false);
      }
    };
    fetchData();
  }, [orderType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTarget) {
      alert('Please select a destination');
      return;
    }

    setLoading(true);
    setSuccessMsg('');

    try {
      if (orderType === 'olives') {
        const { error } = await supabase.from('olive_batches').insert({
          user_id: userId,
          press_id: selectedTarget,
          weight_kg: parseFloat(weight),
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.from('oil_batches').insert({
          user_id: userId,
          facility_id: selectedTarget,
          volume_liters: parseFloat(volume),
        });
        if (error) throw error;
      }
      setSuccessMsg('Batch dispatched successfully!');
      setWeight('');
      setVolume('');
      setSelectedTarget('');
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-6 pb-24">
      <header className="mb-6">
        <h2 className="text-2xl font-bold text-oleum-900">New Batch</h2>
        <p className="text-oleum-600">Register a new shipment</p>
      </header>

      {/* Toggle */}
      <div className="flex p-1 bg-oleum-100 rounded-xl">
        <button
          onClick={() => setOrderType('olives')}
          className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-medium transition-all ${
            orderType === 'olives'
              ? 'bg-white text-oleum-800 shadow-sm'
              : 'text-oleum-600 hover:text-oleum-800'
          }`}
        >
          <Sprout className="w-4 h-4" />
          Send Olives
        </button>
        <button
          onClick={() => setOrderType('oil')}
          className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-medium transition-all ${
            orderType === 'oil'
              ? 'bg-white text-earth-800 shadow-sm'
              : 'text-oleum-600 hover:text-oleum-800'
          }`}
        >
          <Droplet className="w-4 h-4" />
          Send Oil
        </button>
      </div>

      {successMsg && (
        <div className="bg-green-100 text-green-800 p-4 rounded-lg flex items-center gap-2 animate-fade-in">
          <Leaf className="w-5 h-5" />
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {orderType === 'olives' ? (
          <div className="space-y-4 animate-slide-up">
            <div>
              <label className="block text-sm font-medium text-oleum-700 mb-1">
                Batch Weight (kg)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full pl-4 pr-12 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-oleum-500 outline-none"
                  placeholder="e.g. 500"
                  required
                />
                <span className="absolute right-4 top-3.5 text-gray-400 font-medium">kg</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-oleum-700 mb-1">
                Destination Press (Maasara)
              </label>
              <select
                value={selectedTarget}
                onChange={(e) => setSelectedTarget(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-oleum-500 outline-none appearance-none"
                required
                disabled={fetching}
              >
                <option value="">{fetching ? 'Loading...' : 'Select a press'}</option>
                {presses.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.location})
                  </option>
                ))}
              </select>
            </div>
          </div>
        ) : (
          <div className="space-y-4 animate-slide-up">
            <div>
              <label className="block text-sm font-medium text-earth-800 mb-1">
                Oil Volume (Liters)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={volume}
                  onChange={(e) => setVolume(e.target.value)}
                  className="w-full pl-4 pr-12 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-earth-500 outline-none"
                  placeholder="e.g. 120"
                  required
                />
                <span className="absolute right-4 top-3.5 text-gray-400 font-medium">L</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-earth-800 mb-1">
                Destination Facility
              </label>
              <select
                value={selectedTarget}
                onChange={(e) => setSelectedTarget(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-earth-500 outline-none appearance-none"
                required
                disabled={fetching}
              >
                <option value="">{fetching ? 'Loading...' : 'Select a facility'}</option>
                {facilities.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.location}) - {f.type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || fetching}
          className={`w-full py-4 rounded-xl font-bold text-white shadow-lg shadow-oleum-200 flex items-center justify-center gap-2 transition-transform active:scale-95 ${
            orderType === 'olives'
              ? 'bg-oleum-600 hover:bg-oleum-700'
              : 'bg-earth-600 hover:bg-earth-700'
          }`}
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Send className="w-5 h-5" />
              Submit Order
            </>
          )}
        </button>
      </form>
    </div>
  );
};

// Simple icon for message
const Leaf = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
  </svg>
);