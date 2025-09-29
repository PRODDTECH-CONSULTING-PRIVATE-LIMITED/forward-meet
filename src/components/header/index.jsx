import React from 'react';

const Header = () => {
  return (
    <div className="text-center mb-6">
      <h1 
        className="font-medium mb-2"
        style={{
          fontFamily: 'DM Sans, sans-serif',
          fontWeight: 500,
          fontSize: '36px',
          lineHeight: '46.8px',
          letterSpacing: '0%',
          color: '#474747',
          width: '348px',
          height: '47px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        Midway Place Finder
      </h1>
      <p 
        className=""
        style={{
          fontFamily: 'DM Sans, sans-serif',
          fontWeight: 500,
          fontSize: '17px',
          lineHeight: '25.5px',
          letterSpacing: '0%',
          color: '#777777',
          width: '426px',
          height: '26px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        Find the perfect meeting spot between two locations
      </p>
    </div>
  );
};

export default Header;