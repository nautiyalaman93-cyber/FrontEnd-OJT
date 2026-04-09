/**
 * @file index.jsx (SOS Help Page)
 * @description Flat high-contrast red/white emergency protocol.
 */

import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { AlertTriangle, Info } from 'lucide-react';

export default function SOSHelp() {
  const [reportType, setReportType] = useState('Medical Emergency');

  return (
    <div className="w-full pb-16 bg-[#F5F7FA] min-h-screen">
      
      <section className="bg-white border-b border-[#D1D5DB] py-6 mb-8 mt-0">
        <div className="max-w-[1000px] mx-auto px-4">
           <h1 className="text-xl font-semibold text-[#B91C1C] flex items-center gap-2">
             <AlertTriangle size={24} /> RAILWAY EMERGENCY SOS
           </h1>
           <p className="text-[13px] text-[#6B7280] mt-1">Immediate dispatch interface for RPF and Medical Personnel.</p>
        </div>
      </section>

      <section className="max-w-[800px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Important Info Panel */}
        <div className="lg:col-span-1">
           <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-[6px] p-4 text-[#92400E]">
             <h4 className="font-bold text-[13px] uppercase flex items-center gap-1.5 mb-2"><Info size={14}/> Mandatory Notice</h4>
             <p className="text-[12px] font-medium leading-relaxed">
               Misuse of the SOS system is a punishable offense under Section 145 of the Railways Act. 
               Only submit requests in genuine situations involving security threats, fires, or medical crises.
             </p>
           </div>
        </div>

        {/* SOS Form */}
        <div className="lg:col-span-2">
           <div className="bg-[#FFFFFF] rounded-[8px] border border-[#D1D5DB]">
             <div className="px-6 py-4 border-b border-[#D1D5DB] bg-[#F9FAFB]">
                <h3 className="text-[15px] font-bold text-[#1F2937] uppercase tracking-wide">Signal Details</h3>
             </div>

             <form className="p-6 space-y-5" onSubmit={(e) => e.preventDefault()}>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                   <div>
                     <label className="block text-[12px] font-bold text-[#6B7280] uppercase mb-1.5">Train Details</label>
                     <input type="text" defaultValue="12952 Mumbai Rajdhani" className="w-full px-3 py-2 bg-[#F9FAFB] border border-[#D1D5DB] rounded-[4px] outline-none text-[14px] font-semibold text-[#1F2937]" readOnly/>
                   </div>
                   <div>
                     <label className="block text-[12px] font-bold text-[#6B7280] uppercase mb-1.5">Current Coach/Seat</label>
                     <input type="text" placeholder="e.g. B4, Seat 45" className="w-full px-3 py-2 bg-white border border-[#D1D5DB] rounded-[4px] outline-none focus:border-[#B91C1C] text-[14px] font-semibold text-[#1F2937]" required />
                   </div>
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-[#6B7280] uppercase mb-1.5">Incident Category</label>
                  <select 
                    value={reportType} 
                    onChange={(e) => setReportType(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-[#D1D5DB] rounded-[4px] outline-none focus:border-[#B91C1C] text-[14px] font-semibold text-[#1F2937] cursor-pointer"
                  >
                    <option>Medical Emergency</option>
                    <option>Security / Harassment</option>
                    <option>Fire</option>
                    <option>Theft</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-[#6B7280] uppercase mb-1.5">Description (Optional)</label>
                  <textarea 
                    rows={3} 
                    className="w-full p-3 bg-white border border-[#D1D5DB] rounded-[4px] outline-none focus:border-[#B91C1C] text-[13px] font-medium text-[#1F2937] resize-none" 
                    placeholder="Provide additional details regarding the incident..."
                  ></textarea>
                </div>

                <div className="pt-2">
                  <Button 
                     type="submit" 
                     variant="danger"
                     className="w-full h-[46px] text-base tracking-widest uppercase rounded-[4px]"
                  >
                    Dispatch SOS
                  </Button>
                </div>
             </form>
           </div>
        </div>
      </section>
    </div>
  );
}
