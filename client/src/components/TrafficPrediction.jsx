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
                        <div className="participant-avatar bg-slate-50 shadow-md transition-all duration-300 group-hover:bg-indigo-50/80">
                            <div className="absolute inset-0 bg-white/40 rounded-full scale-90 blur-sm group-hover:blur-none transition-all duration-300"></div>
                            <CalendarOutlined style={{ fontSize: '1.2rem', color: '#6366f1', position: 'relative', zIndex: 1 }} />
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
                        <div className="participant-avatar bg-slate-50 shadow-md transition-all duration-300 group-hover:bg-indigo-50/80">
                            <div className="absolute inset-0 bg-white/40 rounded-full scale-90 blur-sm group-hover:blur-none transition-all duration-300"></div>
                            <ClockCircleOutlined style={{ fontSize: '1.2rem', color: '#6366f1', position: 'relative', zIndex: 1 }} />
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
            <div className="mt-5 flex items-center gap-3 px-1.5 opacity-80 group/info">
                <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center transition-colors group-hover/info:bg-indigo-50">
                    <InfoCircleOutlined style={{ fontSize: '13px', color: '#475569' }} />
                </div>
                <p 
                    className="font-semibold text-slate-500 tracking-tight leading-tight"
                    style={{ fontSize: '12.5px' }}
                >
                    Finds venues with equal travel time for everyone.
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