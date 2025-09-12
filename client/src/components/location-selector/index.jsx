import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';

const LocationSelector = ({ 
  location1, 
  location2, 
  setLocation1, 
  setLocation2, 
  location1InputRef, 
  location2InputRef,
  onInputsVisible
}) => {
  const [showLocationInputs, setShowLocationInputs] = useState(false);

  const handleSelectLocationClick = () => {
    setShowLocationInputs(true);
  };

  // Call onInputsVisible when inputs become visible
  useEffect(() => {
    if (showLocationInputs && onInputsVisible) {
      // Small delay to ensure DOM elements are rendered
      setTimeout(() => {
        onInputsVisible();
      }, 100);
    }
  }, [showLocationInputs, onInputsVisible]);

  return (
    <div className="mb-6">
      {!showLocationInputs ? (
        // Initial Purple Button
        <button 
          onClick={handleSelectLocationClick}
          className="w-full bg-purple-400 text-white py-4 px-4 rounded-lg flex items-center justify-center gap-2 text-lg font-medium hover:bg-purple-500 transition-colors"
        >
          <MapPin size={20} />
          Select Location
        </button>
      ) : (
        // Location Input Fields
        <div className="space-y-4">
          {/* Starting Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                Starting Location
              </span>
            </label>
            <input
              type="text"
              ref={location1InputRef}
              placeholder="e.g., Jayanagar, Bengaluru"
              value={location1}
              onChange={(e) => setLocation1(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoComplete="off"
              required
            />
          </div>
          
          {/* Destination Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                Destination Location
              </span>
            </label>
            <input
              type="text"
              ref={location2InputRef}
              placeholder="e.g., Indiranagar, Bengaluru"
              value={location2}
              onChange={(e) => setLocation2(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              autoComplete="off"
              required
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;

// import React, { useState, useEffect, useRef } from 'react';
// import { Modal, Input, Button, Radio } from 'antd';
// import { MapPin } from 'lucide-react';

// const LocationSelector = ({ 
//   location1, 
//   location2, 
//   setLocation1, 
//   setLocation2, 
//   location1InputRef, 
//   location2InputRef,
//   onInputsVisible,
//   userLocation
// }) => {
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [tempLocation1, setTempLocation1] = useState(location1);
//   const [tempLocation2, setTempLocation2] = useState(location2);
//   const [tempDestination, setTempDestination] = useState('');
//   const [destinationType, setDestinationType] = useState('destination');
  
//   // Refs for modal inputs
//   const modalLocation1Ref = useRef(null);
//   const modalLocation2Ref = useRef(null);
//   const modalDestinationRef = useRef(null);

//   const showModal = () => {
//     setIsModalVisible(true);
//     setTempLocation1(location1);
//     setTempLocation2(location2);
//   };

//   const handleCancel = () => {
//     setIsModalVisible(false);
//     setTempLocation1(location1);
//     setTempLocation2(location2);
//   };

//   const handleConfirm = () => {
//     setLocation1(tempLocation1);
//     setLocation2(tempLocation2);
//     setIsModalVisible(false);
    
//     // Call onInputsVisible after modal closes and state updates
//     if (onInputsVisible) {
//       setTimeout(() => {
//         onInputsVisible();
//       }, 100);
//     }
//   };

//   // Initialize autocomplete for modal inputs
//   const initModalAutocomplete = () => {
//     if (window.google?.maps?.places) {
//       const autocompleteOptions = {
//         types: ["geocode", "establishment"],
//         componentRestrictions: { country: ["in"] },
//       };

//       if (userLocation) {
//         const bounds = new window.google.maps.LatLngBounds(
//           new window.google.maps.LatLng(
//             userLocation.lat - 0.45,
//             userLocation.lng - 0.45
//           ),
//           new window.google.maps.LatLng(
//             userLocation.lat + 0.45,
//             userLocation.lng + 0.45
//           )
//         );
//         autocompleteOptions.bounds = bounds;
//       }

//       // Autocomplete for Friend 1 Location
//       if (modalLocation1Ref.current) {
//         const input1 = modalLocation1Ref.current.input || modalLocation1Ref.current;
//         const autocomplete1 = new window.google.maps.places.Autocomplete(
//           input1,
//           autocompleteOptions
//         );
//         autocomplete1.addListener("place_changed", () => {
//           const place = autocomplete1.getPlace();
//           if (place.formatted_address) {
//             setTempLocation1(place.formatted_address);
//           } else if (place.name) {
//             setTempLocation1(place.name);
//           }
//         });
//       }

//       // Autocomplete for Friend 2 Location
//       if (modalLocation2Ref.current) {
//         const input2 = modalLocation2Ref.current.input || modalLocation2Ref.current;
//         const autocomplete2 = new window.google.maps.places.Autocomplete(
//           input2,
//           autocompleteOptions
//         );
//         autocomplete2.addListener("place_changed", () => {
//           const place = autocomplete2.getPlace();
//           if (place.formatted_address) {
//             setTempLocation2(place.formatted_address);
//           } else if (place.name) {
//             setTempLocation2(place.name);
//           }
//         });
//       }

//       // Autocomplete for Destination
//       if (modalDestinationRef.current) {
//         const input3 = modalDestinationRef.current.input || modalDestinationRef.current;
//         const autocomplete3 = new window.google.maps.places.Autocomplete(
//           input3,
//           autocompleteOptions
//         );
//         autocomplete3.addListener("place_changed", () => {
//           const place = autocomplete3.getPlace();
//           if (place.formatted_address) {
//             setTempDestination(place.formatted_address);
//           } else if (place.name) {
//             setTempDestination(place.name);
//           }
//         });
//       }
//     }
//   };

//   // Initialize autocomplete when modal opens
//   useEffect(() => {
//     if (isModalVisible) {
//       // Small delay to ensure DOM elements are rendered
//       setTimeout(() => {
//         initModalAutocomplete();
//       }, 100);
//     }
//   }, [isModalVisible, userLocation]);

//   return (
//     <>
//       <div className="mb-6">
//         {/* Select Location Button */}
//         <Button 
//           type="primary"
//           size="large"
//           block
//           onClick={showModal}
//           className="bg-purple-400 hover:bg-purple-500 border-purple-400 hover:border-purple-500 h-12 text-lg font-medium"
//           icon={<MapPin size={20} />}
//         >
//           Select Location
//         </Button>

//         {/* Display selected locations if any */}
//         {(location1 || location2) && (
//           <div className="mt-4 space-y-2">
//             {location1 && (
//               <div className="flex items-center gap-2 text-sm text-gray-600">
//                 <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
//                 <span className="truncate">{location1}</span>
//               </div>
//             )}
//             {location2 && (
//               <div className="flex items-center gap-2 text-sm text-gray-600">
//                 <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
//                 <span className="truncate">{location2}</span>
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Ant Design Modal */}
//       <Modal
//         title={null}
//         open={isModalVisible}
//         onCancel={handleCancel}
//         footer={null}
//         width={479}
//         centered
//         maskClosable={false}
//         className="location-selector-modal"
//         styles={{
//           body: { padding: 0 }
//         }}
//       >
//         <div style={{ 
//           padding: '56px 24px 24px 24px',
//           backgroundColor: 'white',
//           borderRadius: '8px'
//         }}>
//           {/* Modal Title */}
//           <div className="text-center mb-10">
//             <h2 className="text-2xl font-semibold text-gray-800 m-0">Select Location,s</h2>
//           </div>

//           <div className="space-y-8">
//             {/* Friend 1 Location */}
//             <div>
//               <label className="block text-gray-700 font-medium mb-3 text-base">
//                 Starting Location
//               </label>
//               <Input
//                 ref={modalLocation1Ref}
//                 size="large"
//                 placeholder="Enter location"
//                 value={tempLocation1}
//                 onChange={(e) => setTempLocation1(e.target.value)}
//                 prefix={<MapPin size={16} className="text-gray-400" />}
//                 className="rounded-lg"
//                 autoComplete="off"
//                 style={{ 
//                   height: '48px',
//                   fontSize: '16px'
//                 }}
//               />
//             </div>

//             {/* Friend 2 Location */}
//             <div>
//               <label className="block text-gray-700 font-medium mb-3 text-base">
//                 Destination Location
//               </label>
//               <Input
//                 ref={modalLocation2Ref}
//                 size="large"
//                 placeholder="Enter location"
//                 value={tempLocation2}
//                 onChange={(e) => setTempLocation2(e.target.value)}
//                 prefix={<MapPin size={16} className="text-gray-400" />}
//                 className="rounded-lg"
//                 autoComplete="off"
//                 style={{ 
//                   height: '48px',
//                   fontSize: '16px'
//                 }}
//               />
//             </div>

//             {/* Select Destination Location */}
//             <div>
//               <label className="block text-gray-700 font-medium mb-4 text-base">
//                 Select Destination Location
//               </label>
              
//               {/* Radio buttons */}
//               <div className="mb-6">
//                 <Radio.Group 
//                   value={destinationType} 
//                   onChange={(e) => setDestinationType(e.target.value)}
//                   className="flex items-center gap-8"
//                 >
//                   <Radio 
//                     value="destination" 
//                     className="text-gray-700 font-medium"
//                     style={{ 
//                       fontSize: '16px',
//                       color: destinationType === 'destination' ? '#9333ea' : '#4B5563'
//                     }}
//                   >
//                     Destination
//                   </Radio>
//                   <Radio 
//                     value="fix" 
//                     className="text-gray-700 font-medium"
//                     style={{ 
//                       fontSize: '16px',
//                       color: destinationType === 'fix' ? '#9333ea' : '#4B5563'
//                     }}
//                   >
//                     fix location
//                   </Radio>
//                 </Radio.Group>
//               </div>

//               {/* Destination input */}
//               <Input
//                 ref={modalDestinationRef}
//                 size="large"
//                 placeholder="Enter location"
//                 value={tempDestination}
//                 onChange={(e) => setTempDestination(e.target.value)}
//                 prefix={<MapPin size={16} className="text-gray-400" />}
//                 className="rounded-lg"
//                 autoComplete="off"
//                 style={{ 
//                   height: '48px',
//                   fontSize: '16px'
//                 }}
//               />
//             </div>
//           </div>

//           {/* Confirm Button */}
//           <div className="mt-12">
//             <Button
//               type="primary"
//               size="large"
//               block
//               onClick={handleConfirm}
//               disabled={!tempLocation1 || !tempLocation2}
//               className="bg-purple-400 hover:bg-purple-500 border-purple-400 hover:border-purple-500 text-white font-medium rounded-lg"
//               style={{ 
//                 height: '56px',
//                 fontSize: '18px'
//               }}
//             >
//               Conform Location,s
//             </Button>
//           </div>
//         </div>
//       </Modal>

//       <style jsx global>{`
//         .location-selector-modal .ant-modal-content {
//           padding: 0;
//           border-radius: 8px;
//         }
        
//         .location-selector-modal .ant-modal-close {
//           top: 16px;
//           right: 16px;
//           color: #9CA3AF;
//         }
        
//         .location-selector-modal .ant-input-affix-wrapper {
//           border-radius: 8px !important;
//           border: 1px solid #E5E7EB;
//         }
        
//         .location-selector-modal .ant-input-affix-wrapper:focus,
//         .location-selector-modal .ant-input-affix-wrapper-focused {
//           border-color: #9333ea;
//           box-shadow: 0 0 0 2px rgba(147, 51, 234, 0.1);
//         }

//         .location-selector-modal .ant-radio-wrapper {
//           color: #4B5563;
//           font-weight: 500;
//         }

//         .location-selector-modal .ant-radio-checked .ant-radio-inner {
//           background-color: #9333ea;
//           border-color: #9333ea;
//         }

//         .location-selector-modal .ant-radio:hover .ant-radio-inner {
//           border-color: #9333ea;
//         }

//         .location-selector-modal .ant-radio-wrapper:hover .ant-radio .ant-radio-inner {
//           border-color: #9333ea;
//         }
//       `}</style>
//     </>
//   );
// };

// export default LocationSelector;