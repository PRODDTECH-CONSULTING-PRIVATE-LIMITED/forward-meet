import React from 'react';

const SearchRadiusSlider = ({ value, onChange, min = 1, max = 10 }) => {
  const percentage = ((value - min) / (max - min)) * 100;
  const sliderBackground = `linear-gradient(to right, #2563eb ${percentage}%, #e5e7eb ${percentage}%)`;

  return (
    <div style={{ marginTop: '8px' }}>

      {/* Label Row */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px'
      }}>
        <span style={{
          fontSize: '12px',
          fontWeight: 700,
          color: '#334155',
          letterSpacing: '0.06em',
          textTransform: 'uppercase'
        }}>
          SEARCH RADIUS
        </span>

        <span style={{
          fontSize: '15px',
          fontWeight: 700,
          color: '#2563eb'
        }}>
          {value} km
        </span>
      </div>

      {/* Slider */}
      <div>
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{
            width: '100%',
            height: '4px',
            borderRadius: '999px',
            background: sliderBackground,
            appearance: 'none'
          }}
        />

        {/* Thumb styling */}
        <style>{`
          input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #ffffff;
            border: 2px solid #2563eb;
            box-shadow: 0 1px 4px rgba(0,0,0,0.2);
            cursor: pointer;
          }
          input[type="range"]::-moz-range-thumb {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #ffffff;
            border: 2px solid #2563eb;
            cursor: pointer;
          }
        `}</style>

        {/* Min/Max */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '6px',
          fontSize: '11px',
          color: '#94a3b8'
        }}>
          <span>{min}km</span>
          <span>{max}km</span>
        </div>
      </div>

    </div>
  );
};

export default SearchRadiusSlider;
