import React, { useState, useRef } from 'react';
import { Select } from 'antd';
import { MapPin } from 'lucide-react';
import ParticipantCard from '../ParticipantCard';

const LocationSelector = ({ 
  location1, 
  location2, 
  setLocation1, 
  setLocation2, 
  location1InputRef, 
  location2InputRef
}) => {
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const timeoutRef1 = useRef(null);
  const timeoutRef2 = useRef(null);

  const fetchSuggestions = async (input, setData, timeoutRef) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (!input || input.length < 2) {
      setData([]);
      return;
    }
    timeoutRef.current = setTimeout(async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/autocomplete?input=${encodeURIComponent(input)}`);
        if (response.ok) {
          const data = await response.json();
          const predictions = data.predictions || [];
          const options = predictions.map(s => {
            const mainText = s.structured_formatting?.main_text || s.description.split(',')[0];
            const secondaryText = s.structured_formatting?.secondary_text || s.description.split(',').slice(1).join(',').trim();
            return {
              value: s.description,
              label: (
                <div className="flex items-center gap-4 py-1">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#e5e7eb] rounded-full flex items-center justify-center">
                    <MapPin size={16} className="text-black" />
                  </div>
                  <div className="flex flex-col flex-1 overflow-hidden">
                    <span className="text-[14px] font-semibold text-gray-900 truncate">{mainText}</span>
                    {secondaryText && (
                      <span className="text-[12px] font-normal text-gray-500 truncate">{secondaryText}</span>
                    )}
                  </div>
                </div>
              )
            };
          });
          setData(options);
        }
      } catch (e) {
        console.error('Failed to fetch autocomplete:', e);
      }
    }, 300);
  };

  const NavArrow = (
    <div className="text-black ml-1 pt-1 opacity-70">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="22" y1="2" x2="11" y2="13"></line>
        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
      </svg>
    </div>
  );

  return (
    <div className="space-y-6 w-full relative">
      <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-2 ml-1">
        Participants
      </label>
      
      <div className="relative w-full">
        <ParticipantCard label="Person A" avatarClass="person-a">
          <Select
            ref={location1InputRef}
            showSearch
            allowClear
            variant="borderless"
            value={location1 || undefined}
            placeholder="e.g., Jayanagar, Bengaluru"
            style={{ width: '100%' }}
            className="text-base font-medium"
            defaultActiveFirstOption={false}
            suffixIcon={NavArrow}
            filterOption={false}
            onSearch={(val) => fetchSuggestions(val, setData1, timeoutRef1)}
            onChange={(val) => setLocation1(val || '')}
            notFoundContent={null}
            options={data1}
            dropdownStyle={{ borderRadius: '12px', padding: '8px 0' }}
          />
        </ParticipantCard>
      </div>

      <div className="relative w-full mt-4">
        <ParticipantCard label="Person B" avatarClass="person-b">
          <Select
            ref={location2InputRef}
            showSearch
            allowClear
            variant="borderless"
            value={location2 || undefined}
            placeholder="e.g., Indiranagar, Bengaluru"
            style={{ width: '100%' }}
            className="text-base font-medium"
            defaultActiveFirstOption={false}
            suffixIcon={NavArrow}
            filterOption={false}
            onSearch={(val) => fetchSuggestions(val, setData2, timeoutRef2)}
            onChange={(val) => setLocation2(val || '')}
            notFoundContent={null}
            options={data2}
            dropdownStyle={{ borderRadius: '12px', padding: '8px 0' }}
          />
        </ParticipantCard>
      </div>
    </div>
  );
};

export default LocationSelector;