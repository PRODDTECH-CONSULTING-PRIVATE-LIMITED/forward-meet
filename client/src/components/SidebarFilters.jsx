
import React from 'react';
import SegmentedControl from './SegmentedControl';
import SearchRadiusSlider from './SearchRadiusSlider';
import TimeDifferenceSlider from './TimeDifferenceSlider';
import { Info } from 'lucide-react';

const SidebarFilters = ({
  searchMode,
  onSearchModeChange,
  searchRadius,
  onSearchRadiusChange,
  timeDifferenceMargin,
  onTimeDifferenceMarginChange
}) => {
  return (
    <div style={{
      padding: '8px 16px',
      borderBottom: '1px solid #e2e8f0',
      paddingLeft: '25px',
      background: 'white'
    }}>
      <SegmentedControl
        options={[
          { value: 'time', label: 'Time' },
          { value: 'distance', label: 'Distance' }
        ]}
        selected={searchMode}
        onChange={onSearchModeChange}
      />

      <div style={{ marginTop: '0px' }}>
        {searchMode === 'time' ? (
          <TimeDifferenceSlider
            value={timeDifferenceMargin}
            onChange={onTimeDifferenceMarginChange}
            min={0}
            max={30}
          />
        ) : (
          <SearchRadiusSlider
            value={searchRadius}
            onChange={onSearchRadiusChange}
            min={1}
            max={10}
          />
        )}
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        marginTop: '12px',
        color: '#64748b',
        fontSize: '11px',
        paddingLeft: '4px',
        paddingBottom: '4px'
      }}>
        <Info size={14} style={{ flexShrink: 0, opacity: 0.8 }} />
        <span style={{ fontWeight: 500 }}>
          {searchMode === 'time'
            ? 'Max difference in travel time between people'
            : 'Radius around the midpoint'}
        </span>
      </div>
    </div>
  );
};

export default SidebarFilters;