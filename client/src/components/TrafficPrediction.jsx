import { DatePicker, TimePicker } from "antd";
import dayjs from "dayjs";
import { CalendarOutlined, ClockCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';

const TrafficPrediction = (props) => {
    const { selectedDate, setSelectedDate, selectedTime, setSelectedTime } = props;

    return (
        <div className="w-full" style={{ marginTop: '24px' }}>
            <div className="flex w-full" style={{ gap: '16px', marginBottom: '4px' }}>
                {/* Date Selection Card */}
                <div 
                    className="participant-card group"
                    style={{ flex: 1, padding: '18px 20px', cursor: 'pointer' }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div className="participant-avatar bg-indigo-50 shadow-sm transition-all duration-300 group-hover:bg-indigo-100/50">
                            <CalendarOutlined style={{ fontSize: '1.25rem', color: '#6366f1' }} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <label className="text-[10px] font-black text-indigo-500 uppercase tracking-widest block mb-1">
                                Date
                            </label>
                            <DatePicker
                                id="trafficDate"
                                format="YYYY-MM-DD"
                                value={selectedDate ? dayjs(selectedDate) : null}
                                onChange={(date, dateString) => setSelectedDate(dateString)}
                                placeholder="Select date"
                                className="premium-picker-clean"
                                active={!!selectedDate}
                                suffixIcon={null}
                                style={{ 
                                    width: '100%', 
                                    border: 'none', 
                                    background: 'transparent', 
                                    padding: 0, 
                                    boxShadow: 'none',
                                    fontSize: '0.925rem',
                                    fontWeight: 700,
                                    color: '#0f172a'
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Time Selection Card */}
                <div 
                    className="participant-card group"
                    style={{ flex: 1, padding: '18px 20px', cursor: 'pointer' }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div className="participant-avatar bg-indigo-50 shadow-sm transition-all duration-300 group-hover:bg-indigo-100/50">
                            <ClockCircleOutlined style={{ fontSize: '1.25rem', color: '#6366f1' }} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <label className="text-[10px] font-black text-indigo-500 uppercase tracking-widest block mb-1">
                                Time
                            </label>
                            <TimePicker
                                id="trafficTime"
                                format="HH:mm"
                                value={selectedTime ? dayjs(selectedTime, "HH:mm") : null}
                                onChange={(time, timeString) => setSelectedTime(timeString)}
                                placeholder="Select time"
                                className="premium-picker-clean"
                                minuteStep={15}
                                suffixIcon={null}
                                style={{ 
                                    width: '100%', 
                                    border: 'none', 
                                    background: 'transparent', 
                                    padding: 0, 
                                    boxShadow: 'none',
                                    fontSize: '0.925rem',
                                    fontWeight: 700,
                                    color: '#0f172a'
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Info Section */}
            <div className="mt-5 flex items-center gap-2.5 px-2 opacity-90 transition-opacity hover:opacity-100 text-left">
                <InfoCircleOutlined style={{ fontSize: '14px', color: '#6366f1' }} />
                <p 
                    className="font-medium text-slate-500 tracking-tight leading-tight ml-2"
                    style={{ fontSize: '13px' }}
                >
                    {" "}Using predictive traffic modeling to ensure accurate travel time
                </p>
            </div>

            <style>{`
                .premium-picker-clean .ant-picker-input > input {
                    color: #0f172a !important;
                    font-weight: 700 !important;
                    font-size: 0.925rem !important;
                    cursor: pointer !important;
                }
                .premium-picker-clean.ant-picker {
                    padding: 0 !important;
                }
            `}</style>
        </div>
    );
};

export default TrafficPrediction;