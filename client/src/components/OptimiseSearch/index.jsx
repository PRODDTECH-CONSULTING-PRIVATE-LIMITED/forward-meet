import React from 'react';

const OptimizeSearch = ({ searchMode, setSearchMode }) => {
  return (
    <div 
    className="bg-white rounded-md border" 
    style={{ 
        borderWidth: '0.6px',
        borderColor: '#C6C6C6',
        padding: '12px 16px'
    }}
    >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p 
            className="font-medium" 
            style={{
                fontFamily: 'DM Sans',
                fontSize: '20px',
                lineHeight: '30px',
                color: '#777777',
                margin: 0
            }}
            >
            Optimize search by:
            </p>
            <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <label className="inline-flex items-center cursor-pointer" style={{ gap: '8px' }}>
                <input
                type="radio"
                className="w-5 h-5 cursor-pointer"
                style={{
                    accentColor: '#8B5CF6',
                    margin: 0
                }}
                name="searchMode"
                value="time"
                checked={searchMode === "time"}
                onChange={(e) => setSearchMode(e.target.value)}
                />
                <span 
                className="font-medium" 
                style={{
                    fontFamily: 'DM Sans',
                    fontSize: '16px',
                    color: '#888888'
                }}
                >
                Time
                </span>
            </label>
            <label className="inline-flex items-center cursor-pointer" style={{ gap: '8px' }}>
                <input
                type="radio"
                className="w-5 h-5 cursor-pointer"
                style={{
                    accentColor: '#8B5CF6',
                    margin: 0
                }}
                name="searchMode"
                value="distance"
                checked={searchMode === "distance"}
                onChange={(e) => setSearchMode(e.target.value)}
                />
                <span 
                className="font-medium" 
                style={{
                    fontFamily: 'DM Sans',
                    fontSize: '16px',
                    color: '#888888'
                }}
                >
                Distance
                </span>
            </label>
            </div>
        </div>
    </div>
  );
};

export default OptimizeSearch;