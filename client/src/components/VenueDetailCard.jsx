import React, { useState } from 'react';
import { X, Share2, Navigation, Phone, Globe, Star, Clock, Info, ChevronRight, MessageSquare, Camera } from 'lucide-react';

const VenueDetailCard = ({ venue, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!venue) return null;

  const {
    name,
    rating,
    user_ratings_total,
    address,
    phone,
    website,
    opening_hours,
    price_level,
    photo_references,
    reviews,
    review_summary
  } = venue;

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={14}
            fill={i < Math.floor(rating) ? "#FBBC04" : "none"}
            stroke={i < Math.floor(rating) ? "#FBBC04" : "#dadce0"}
          />
        ))}
      </div>
    );
  };

  const getPriceString = (level) => {
    return '₹'.repeat(level || 1);
  };

  const getPhotoUrl = (ref) => {
    return `http://localhost:8080/api/place_photo?photoreference=${ref}&maxwidth=800`;
  };

  return (
    <div 
      className="fixed top-0 bottom-0 z-[10005] flex pointer-events-none"
      style={{
        left: 'clamp(370px, 30vw, 550px)',
        zIndex: 10005,
        pointerEvents: 'none'
      }}
    >
      {/* Card Content */}
      <div 
        className="relative h-full bg-white shadow-2xl flex flex-col pointer-events-auto animate-slide-in-right"
        style={{
          width: '500px',
          height: '100%',
          backgroundColor: 'white',
          boxShadow: '8px 0 24px rgba(0, 0, 0, 0.12)',
          display: 'flex',
          flexDirection: 'column',
          borderLeft: '1px solid #e2e8f0'
        }}
      >
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-gray-100 shrink-0">
          <div className="flex-1 min-w-0 pr-4">
            <h2 className="text-xl font-semibold text-gray-900 truncate">{name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm font-medium text-gray-700">{rating}</span>
              {renderStars(rating)}
              <span className="text-xs text-gray-500">({user_ratings_total?.toLocaleString()})</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600">
              <Share2 size={20} />
            </button>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto hide-scrollbar">
          {/* Photos Area */}
          <div className="grid grid-cols-3 gap-1 h-64 shrink-0 px-4 mt-2">
            <div className="col-span-2 h-full overflow-hidden rounded-l-xl">
              {photo_references && photo_references[0] ? (
                <img 
                  src={getPhotoUrl(photo_references[0])} 
                  alt={name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <Camera className="text-gray-300" size={48} />
                </div>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <div className="h-1/2 overflow-hidden rounded-tr-xl">
                {photo_references && photo_references[1] ? (
                  <img src={getPhotoUrl(photo_references[1])} alt={name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-50" />
                )}
              </div>
              <div className="h-1/2 overflow-hidden rounded-br-xl bg-gray-800 relative group cursor-pointer">
                {photo_references && photo_references[2] ? (
                  <>
                    <img src={getPhotoUrl(photo_references[2])} alt={name} className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-2 text-center">
                      <span className="text-lg font-bold">+{photo_references.length}</span>
                      <span className="text-[10px] uppercase tracking-wider font-semibold">Photos</span>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full bg-gray-50" />
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions Row */}
          <div className="flex items-center gap-2 p-4 overflow-x-auto hide-scrollbar">
            <button className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-full font-semibold text-sm hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 shrink-0">
              <Navigation size={18} fill="currentColor" />
              Directions
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-indigo-600 rounded-full font-semibold text-sm hover:bg-indigo-50 transition-colors shrink-0">
              <MessageSquare size={18} />
              Ask
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-indigo-600 rounded-full font-semibold text-sm hover:bg-indigo-50 transition-colors shrink-0">
              Order
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-100 px-4 sticky top-0 bg-white z-10">
            {['overview', 'reviews', 'photos'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-sm font-semibold capitalize transition-all relative ${
                  activeTab === tab ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-4">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Summary Section */}
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer group">
                    <Clock className="mt-0.5 text-indigo-500 group-hover:scale-110 transition-transform" size={20} />
                    <div>
                      <div className="text-sm font-semibold text-green-600">Open <span className="text-gray-400 font-normal">• Closes 11:00 PM</span></div>
                      {opening_hours && (
                        <div className="text-xs text-gray-500 mt-1 space-y-0.5">
                          {opening_hours.map((line, i) => (
                             <div key={i}>{line}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer group">
                    <Navigation className="mt-0.5 text-indigo-500 group-hover:scale-110 transition-transform" size={20} />
                    <div className="text-sm text-gray-700 font-medium">
                      {address}
                    </div>
                  </div>

                  {phone && (
                    <div className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer group">
                      <Phone className="mt-0.5 text-indigo-500 group-hover:scale-110 transition-transform" size={20} />
                      <div className="text-sm text-gray-700 font-medium">{phone}</div>
                    </div>
                  )}

                  {website && (
                    <div className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer group">
                      <Globe className="mt-0.5 text-indigo-500 group-hover:scale-110 transition-transform" size={20} />
                      <div className="text-sm text-gray-700 font-medium truncate">{website}</div>
                    </div>
                  )}
                </div>

                {/* Know Before You Go */}
                {review_summary && (
                  <div className="bg-indigo-50 rounded-2xl p-4 border border-indigo-100">
                    <div className="flex items-center gap-2 text-indigo-700 mb-2">
                      <Info size={18} />
                      <span className="font-bold text-sm tracking-tight uppercase">AI Summary</span>
                    </div>
                    <p className="text-sm text-indigo-900 leading-relaxed italic">
                      "{review_summary}"
                    </p>
                  </div>
                )}

                {/* Main Action Button */}
                <button className="w-full py-4 bg-indigo-50 text-indigo-600 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-100 transition-colors shadow-sm tracking-wide uppercase text-sm">
                  Order online
                </button>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {reviews?.map((review, i) => (
                  <div key={i} className="border-b border-gray-50 pb-6 last:border-0">
                    <div className="flex items-center gap-3 mb-3">
                      <img 
                        src={review.profile_photo_url} 
                        alt={review.author_name} 
                        className="w-10 h-10 rounded-full border border-gray-100"
                      />
                      <div>
                        <div className="text-sm font-bold text-gray-900">{review.author_name}</div>
                        <div className="flex items-center gap-2">
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, starI) => (
                              <Star key={starI} size={10} fill={starI < review.rating ? "#FBBC04" : "none"} stroke={starI < review.rating ? "#FBBC04" : "#dadce0"} />
                            ))}
                          </div>
                          <span className="text-[10px] text-gray-400 font-medium uppercase">{review.relative_time_description}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed italic line-clamp-4">
                      "{review.text}"
                    </p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'photos' && (
              <div className="grid grid-cols-2 gap-2">
                {photo_references?.map((ref, i) => (
                  <div key={i} className="aspect-square rounded-xl overflow-hidden bg-gray-100 hover:opacity-90 transition-opacity cursor-pointer">
                    <img src={getPhotoUrl(ref)} alt={`Venue photo ${i+1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slide-in-right {
          from { transform: translateX(-100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default VenueDetailCard;
