<<<<<<< HEAD
import React, { useState } from 'react';
=======
import React, { useState, useEffect } from 'react';
>>>>>>> b2b364f6c9d4af2eece31998dc4bd6bae08eef70
import {
  Sprout,
  Users,
  ShieldCheck,
  TrendingUp,
  CloudSun,
  Wrench,
  MapPin,
  Map,
  ArrowRight,
  Info,
  Calendar,
  DollarSign,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
<<<<<<< HEAD

const mockLaborers = [
  { id: 1, name: 'Sanjay Kumar', skills: 'Wheat Harvesting, Seeding', rating: 4.8, experience: '8 Yrs', pay: '₹400/day', location: '1.2 km away', status: 'Available' },
  { id: 2, name: 'Ramesh Pujari', skills: 'Tractor Driver, Irrigation', rating: 4.9, experience: '6 Yrs', pay: '₹450/day', location: '3.0 km away', status: 'Available' },
  { id: 3, name: 'Jatin Das', skills: 'Pesticide Spray, Planting', rating: 4.6, experience: '4 Yrs', pay: '₹380/day', location: '2.5 km away', status: 'Booked' },
];

const mockEquipment = [
  { id: 1, name: 'Mahindra Arjun Tractor', owner: 'Devender Singh', rate: '₹800/hr', type: 'Tractor', distance: '1.8 km', status: 'Available' },
  { id: 2, name: 'John Deere Combine Harvester', owner: 'Satish Grewal', rate: '₹2,200/hr', type: 'Harvester', distance: '4.0 km', status: 'Available' },
  { id: 3, name: 'Rotavator Tiller Attachment', owner: 'Jagbir Singh', rate: '₹350/hr', type: 'Tiller', distance: '2.2 km', status: 'Rented' },
];

const mockMandiPrices = [
  { crop: 'Wheat (Gehun)', sonipat: '₹2,275/qtl', narela: '₹2,300/qtl', rohtak: '₹2,260/qtl', trend: 'up' },
  { crop: 'Paddy (Dhan - Basmati)', sonipat: '₹4,150/qtl', narela: '₹4,220/qtl', rohtak: '₹4,120/qtl', trend: 'up' },
  { crop: 'Potato (Aloo)', sonipat: '₹1,400/qtl', narela: '₹1,450/qtl', rohtak: '₹1,380/qtl', trend: 'down' },
  { crop: 'Mustard (Sarson)', sonipat: '₹5,450/qtl', narela: '₹5,500/qtl', rohtak: '₹5,420/qtl', trend: 'down' },
];
=======
import { farmerAPI } from '../services/api';
>>>>>>> b2b364f6c9d4af2eece31998dc4bd6bae08eef70

interface FarmerHubProps {
  onNavigate: (page: string) => void;
}

export const FarmerHub: React.FC<FarmerHubProps> = ({ onNavigate }) => {
<<<<<<< HEAD
  const { darkMode } = useTheme();
  
  const [activeTab, setActiveTab] = useState<'labor' | 'machinery' | 'prices'>('labor');
  const [bookingWorkerId, setBookingWorkerId] = useState<number | null>(null);
  const [bookedWorkers, setBookedWorkers] = useState<number[]>([]);
  
  const handleBookWorker = (workerId: number) => {
    setBookingWorkerId(workerId);
    setTimeout(() => {
      setBookedWorkers((prev) => [...prev, workerId]);
      setBookingWorkerId(null);
    }, 1500);
=======
  const { darkMode, t } = useTheme();
  
  const [activeTab, setActiveTab] = useState<'labor' | 'machinery' | 'prices'>('labor');
  
  const [laborers, setLaborers] = useState<any[]>([]);
  const [equipment, setEquipment] = useState<any[]>([]);
  const [mandiPrices, setMandiPrices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [bookingWorkerId, setBookingWorkerId] = useState<number | null>(null);
  const [bookedWorkers, setBookedWorkers] = useState<number[]>([]);
  
  const [rentingEqId, setRentingEqId] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [labRes, eqRes, priceRes] = await Promise.all([
        farmerAPI.getLaborers(),
        farmerAPI.getEquipment(),
        farmerAPI.getMandiPrices()
      ]);
      setLaborers(labRes.laborers);
      setEquipment(eqRes.equipment);
      setMandiPrices(priceRes.prices);
      
      // Mark initially booked ones
      setBookedWorkers(labRes.laborers.filter((l: any) => l.status === 'Booked').map((l: any) => l.id));
    } catch (err) {
      console.error("Failed to fetch farmer hub data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookWorker = async (workerId: number) => {
    setBookingWorkerId(workerId);
    try {
      await farmerAPI.bookLaborer(workerId);
      setBookedWorkers((prev) => [...prev, workerId]);
      
      // Update local state to show 'Booked'
      setLaborers(prev => prev.map(l => l.id === workerId ? { ...l, status: 'Booked' } : l));
    } catch (err: any) {
      alert(err.message || "Failed to book laborer");
    } finally {
      setBookingWorkerId(null);
    }
  };

  const handleRentEquipment = async (eqId: number) => {
    setRentingEqId(eqId);
    try {
      await farmerAPI.rentEquipment(eqId);
      setEquipment(prev => prev.map(e => e.id === eqId ? { ...e, status: 'Rented' } : e));
    } catch (err: any) {
      alert(err.message || "Failed to rent equipment");
    } finally {
      setRentingEqId(null);
    }
>>>>>>> b2b364f6c9d4af2eece31998dc4bd6bae08eef70
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className={`${darkMode ? 'glass-card-dark' : 'glass-card'} p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-teal-500/5`}>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg">
            <Sprout className="w-8 h-8" />
          </div>
          <div>
            <h1 className={`text-2xl md:text-3xl font-extrabold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
<<<<<<< HEAD
              Smart Agriculture Hub
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Find verified agricultural laborers, rent machineries, check hyper-local mandi prices, and protect crop profits.
=======
              {t('fhTitle')}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              {t('fhDesc')}
>>>>>>> b2b364f6c9d4af2eece31998dc4bd6bae08eef70
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
<<<<<<< HEAD
            Seasonal Demand Verified
=======
            {t('fhSeasonal')}
>>>>>>> b2b364f6c9d4af2eece31998dc4bd6bae08eef70
          </span>
        </div>
      </div>

      {/* Weather & Price alerts widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Weather advisory */}
        <div className={`${darkMode ? 'glass-card-dark' : 'glass-card'} p-5 border border-slate-200/50 dark:border-slate-800 flex gap-4 items-start`}>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center flex-shrink-0">
            <CloudSun className="w-6 h-6 animate-pulse" />
          </div>
          <div className="min-w-0">
<<<<<<< HEAD
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">Weather Advisory</h4>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">Clear Sky • Perfect for harvesting</p>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">No rainfall expected in Sonipat for 5 days. Complete cutting crop cycles now.</p>
=======
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">{t('fhWeatherAdv')}</h4>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">{t('fhClearSky')}</p>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{t('fhNoRainfall')}</p>
>>>>>>> b2b364f6c9d4af2eece31998dc4bd6bae08eef70
          </div>
        </div>

        {/* P2P Anti-Overpricing Guarantee */}
        <div className={`${darkMode ? 'glass-card-dark' : 'glass-card'} p-5 border border-slate-200/50 dark:border-slate-800 flex gap-4 items-start col-span-1 md:col-span-2`}>
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-500 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="min-w-0">
<<<<<<< HEAD
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">Price Stabilization Guarantee</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              JeevanSetu implements smart contracts monitoring agricultural services to block mid-work rate negotiations and harvester rental manipulators. Platform checks ensure honest seasonal hiring.
=======
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">{t('fhPriceStabilization')}</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              {t('fhPriceDesc')}
>>>>>>> b2b364f6c9d4af2eece31998dc4bd6bae08eef70
            </p>
          </div>
        </div>

      </div>

      {/* Main Tabs */}
      <div className={`${darkMode ? 'glass-card-dark' : 'glass-card'} p-1.5 border border-slate-200/50 dark:border-slate-800`}>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {[
<<<<<<< HEAD
            { id: 'labor', label: 'Hire Farm Laborers', icon: Users },
            { id: 'machinery', label: 'Equipment Rentals', icon: Wrench },
            { id: 'prices', label: 'Hyper-Local Mandi Prices', icon: TrendingUp },
=======
            { id: 'labor', label: t('fhHireLaborers'), icon: Users },
            { id: 'machinery', label: t('fhEquipmentRentals'), icon: Wrench },
            { id: 'prices', label: t('fhMandiPrices'), icon: TrendingUp },
>>>>>>> b2b364f6c9d4af2eece31998dc4bd6bae08eef70
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-emerald-500 text-white shadow-lg'
                  : darkMode
                    ? 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Contents */}
<<<<<<< HEAD
      {activeTab === 'labor' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mockLaborers.map((worker) => (
            <div
              key={worker.id}
              className={`${darkMode ? 'glass-card-dark' : 'glass-card'} p-6 border border-slate-200/50 dark:border-slate-800 flex flex-col justify-between hover:border-emerald-500/30 transition-all`}
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase">
                    {worker.status}
                  </span>
                  <span className="text-xs font-bold text-slate-400">{worker.experience} Exp</span>
                </div>

                <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{worker.name}</h3>
                <p className="text-xs text-teal-500 font-semibold mt-0.5">{worker.skills}</p>

                <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <div>
                    <span className="text-xs text-slate-400 block">Rate Required</span>
                    <span className="font-bold text-slate-900 dark:text-white">{worker.pay}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Proximity</span>
                    <span className="font-bold text-slate-950 dark:text-white flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {worker.location}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
                {bookedWorkers.includes(worker.id) ? (
                  <button className="w-full py-2.5 rounded-lg bg-emerald-500 text-white font-bold text-sm cursor-default flex items-center justify-center gap-1.5">
                    <ShieldCheck className="w-4.5 h-4.5" />
                    Laborer Booked
                  </button>
                ) : (
                  <button
                    onClick={() => handleBookWorker(worker.id)}
                    disabled={bookingWorkerId === worker.id || worker.status === 'Booked'}
                    className={`w-full py-2.5 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                      worker.status === 'Booked'
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        : 'bg-emerald-500/15 hover:bg-emerald-500 text-emerald-600 dark:text-emerald-400 hover:text-white shadow-md'
                    }`}
                  >
                    {bookingWorkerId === worker.id ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Booking...
                      </>
                    ) : worker.status === 'Booked' ? (
                      'Not Available'
                    ) : (
                      'Book Laborer'
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'machinery' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mockEquipment.map((eq) => (
            <div
              key={eq.id}
              className={`${darkMode ? 'glass-card-dark' : 'glass-card'} p-6 border border-slate-200/50 dark:border-slate-800 flex flex-col justify-between hover:border-emerald-500/30 transition-all`}
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-sky-400 text-[10px] font-bold uppercase">
                    {eq.type}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">{eq.status}</span>
                </div>

                <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{eq.name}</h3>
                <p className="text-xs text-slate-400 mt-1">Owner: <span className="font-bold text-slate-600 dark:text-slate-300">{eq.owner}</span></p>

                <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <div>
                    <span className="text-xs text-slate-400 block">Rental Rate</span>
                    <span className="font-bold text-slate-900 dark:text-white">{eq.rate}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Location</span>
                    <span className="font-bold text-slate-950 dark:text-white flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {eq.distance}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
                <button
                  disabled={eq.status === 'Rented'}
                  className={`w-full py-2.5 rounded-lg font-bold text-sm transition-colors ${
                    eq.status === 'Rented'
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-emerald-500/15 hover:bg-emerald-500 text-emerald-600 dark:text-emerald-400 hover:text-white'
                  }`}
                >
                  {eq.status === 'Rented' ? 'Currently Rented' : 'Rent Equipment'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'prices' && (
        <div className={`${darkMode ? 'glass-card-dark' : 'glass-card'} p-6 border border-slate-200/50 dark:border-slate-800 overflow-hidden`}>
          <div className="flex items-center gap-2 mb-6 border-b pb-4">
            <Info className="w-5 h-5 text-emerald-500" />
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Below are today's verified grain and produce rates compiled directly from local APMC Mandis. Verify rates before selling or negotiating transport.
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400 font-bold uppercase text-[11px] tracking-wider">
                  <th className="py-3 px-4">Crop Name</th>
                  <th className="py-3 px-4">Sonipat Mandi</th>
                  <th className="py-3 px-4">Narela Mandi</th>
                  <th className="py-3 px-4">Rohtak Mandi</th>
                  <th className="py-3 px-4">Daily Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {mockMandiPrices.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="py-4 px-4 font-bold text-slate-900 dark:text-white">{row.crop}</td>
                    <td className="py-4 px-4 font-semibold text-emerald-600 dark:text-emerald-400">{row.sonipat}</td>
                    <td className="py-4 px-4 font-semibold text-govBlue-600 dark:text-sky-400">{row.narela}</td>
                    <td className="py-4 px-4">{row.rohtak}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        row.trend === 'up' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {row.trend === 'up' ? '▲ Upward' : '▼ Downward'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

=======
      {loading ? (
        <div className="text-center py-12 text-slate-400">{t('fhLoading')}</div>
      ) : (
        <>
          {activeTab === 'labor' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {laborers.map((worker) => (
                <div
                  key={worker.id}
                  className={`${darkMode ? 'glass-card-dark' : 'glass-card'} p-6 border border-slate-200/50 dark:border-slate-800 flex flex-col justify-between hover:border-emerald-500/30 transition-all`}
                >
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${worker.status === 'Booked' ? 'bg-slate-100 dark:bg-slate-800 text-slate-500' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'}`}>
                        {worker.status}
                      </span>
                      <span className="text-xs font-bold text-slate-400">{worker.experience} {t('fhExp')}</span>
                    </div>

                    <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{worker.name}</h3>
                    <p className="text-xs text-teal-500 font-semibold mt-0.5">{worker.skills}</p>

                    <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-slate-600 dark:text-slate-300">
                      <div>
                        <span className="text-xs text-slate-400 block">{t('fhRateRequired')}</span>
                        <span className="font-bold text-slate-900 dark:text-white">{worker.pay}</span>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 block">{t('fhProximity')}</span>
                        <span className="font-bold text-slate-950 dark:text-white flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {worker.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
                    {bookedWorkers.includes(worker.id) || worker.status === 'Booked' ? (
                      <button className="w-full py-2.5 rounded-lg bg-emerald-500 text-white font-bold text-sm cursor-default flex items-center justify-center gap-1.5">
                        <ShieldCheck className="w-4.5 h-4.5" />
                        {t('fhLaborerBooked')}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleBookWorker(worker.id)}
                        disabled={bookingWorkerId === worker.id}
                        className={`w-full py-2.5 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 bg-emerald-500/15 hover:bg-emerald-500 text-emerald-600 dark:text-emerald-400 hover:text-white shadow-md`}
                      >
                        {bookingWorkerId === worker.id ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            Booking...
                          </>
                        ) : (
                          t('fhBookLaborer')
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'machinery' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {equipment.map((eq) => (
                <div
                  key={eq.id}
                  className={`${darkMode ? 'glass-card-dark' : 'glass-card'} p-6 border border-slate-200/50 dark:border-slate-800 flex flex-col justify-between hover:border-emerald-500/30 transition-all`}
                >
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-sky-400 text-[10px] font-bold uppercase">
                        {eq.type}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase">{eq.status}</span>
                    </div>

                    <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{eq.name}</h3>
                    <p className="text-xs text-slate-400 mt-1">{t('fhOwner')}: <span className="font-bold text-slate-600 dark:text-slate-300">{eq.owner}</span></p>

                    <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-slate-600 dark:text-slate-300">
                      <div>
                        <span className="text-xs text-slate-400 block">{t('fhRentalRate')}</span>
                        <span className="font-bold text-slate-900 dark:text-white">{eq.rate}</span>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 block">{t('fhLocation')}</span>
                        <span className="font-bold text-slate-950 dark:text-white flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {eq.distance}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
                    <button
                      onClick={() => handleRentEquipment(eq.id)}
                      disabled={eq.status === 'Rented' || rentingEqId === eq.id}
                      className={`w-full py-2.5 rounded-lg font-bold text-sm transition-colors flex justify-center items-center gap-2 ${
                        eq.status === 'Rented'
                          ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          : 'bg-emerald-500/15 hover:bg-emerald-500 text-emerald-600 dark:text-emerald-400 hover:text-white'
                      }`}
                    >
                      {rentingEqId === eq.id ? (
                        <><RefreshCw className="w-4 h-4 animate-spin" /> Renting...</>
                      ) : eq.status === 'Rented' ? (
                        t('fhCurrentlyRented')
                      ) : (
                        t('fhRentEquipment')
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'prices' && (
            <div className={`${darkMode ? 'glass-card-dark' : 'glass-card'} p-6 border border-slate-200/50 dark:border-slate-800 overflow-hidden`}>
              <div className="flex items-center gap-2 mb-6 border-b pb-4">
                <Info className="w-5 h-5 text-emerald-500" />
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {t('fhMandiDesc')}
                </p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400 font-bold uppercase text-[11px] tracking-wider">
                      <th className="py-3 px-4">{t('fhCropName')}</th>
                      <th className="py-3 px-4">{t('fhSonipatMandi')}</th>
                      <th className="py-3 px-4">{t('fhNarelaMandi')}</th>
                      <th className="py-3 px-4">{t('fhRohtakMandi')}</th>
                      <th className="py-3 px-4">{t('fhDailyTrend')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {mandiPrices.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <td className="py-4 px-4 font-bold text-slate-900 dark:text-white">{row.crop}</td>
                        <td className="py-4 px-4 font-semibold text-emerald-600 dark:text-emerald-400">{row.sonipat}</td>
                        <td className="py-4 px-4 font-semibold text-govBlue-600 dark:text-sky-400">{row.narela}</td>
                        <td className="py-4 px-4">{row.rohtak}</td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            row.trend === 'up' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {row.trend === 'up' ? t('fhUpward') : t('fhDownward')}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
>>>>>>> b2b364f6c9d4af2eece31998dc4bd6bae08eef70
    </section>
  );
};
export default FarmerHub;
