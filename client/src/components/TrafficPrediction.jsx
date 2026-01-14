import { DatePicker, TimePicker } from "antd";
import dayjs from "dayjs";
import { CalendarOutlined, ClockCircleOutlined } from '@ant-design/icons';

const TrafficPrediction = (props) => {
    const { selectedDate, setSelectedDate, selectedTime, setSelectedTime } = props;

    return (
        <div className="w-full">
            <div className="flex gap-5 w-full">
                {/* Date Picker */}
                <div className="flex-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-4">
                        📅 Date
                    </label>
                    <DatePicker
                        id="trafficDate"
                        format="YYYY-MM-DD"
                        value={selectedDate ? dayjs(selectedDate) : null}
                        onChange={(date, dateString) => setSelectedDate(dateString)}
                        placeholder="Choose date"
                        suffixIcon={<CalendarOutlined style={{ color: '#6366f1' }} />}
                        style={{
                            width: '100%',
                            height: '52px',
                            background: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            borderRadius: '16px',
                            color: '#1e293b',
                            fontWeight: "500",
                            padding: '0 16px'
                        }}
                        className="hover:border-indigo-500 focus:border-indigo-500 transition-all duration-200"
                    />
                </div>

                {/* Time Picker */}
                <div className="flex-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-4">
                        🕐 Time
                    </label>
                    <TimePicker
                        id="trafficTime"
                        format="HH:mm"
                        value={selectedTime ? dayjs(selectedTime, "HH:mm") : null}
                        onChange={(time, timeString) => setSelectedTime(timeString)}
                        placeholder="Choose time"
                        suffixIcon={<ClockCircleOutlined style={{ color: '#6366f1' }} />}
                        style={{
                            width: '100%',
                            height: '52px',
                            background: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            borderRadius: '16px',
                            color: '#1e293b',
                            fontWeight: "500",
                            padding: '0 16px'
                        }}
                        className="hover:border-indigo-500 focus:border-indigo-500 transition-all duration-200"
                        minuteStep={15}
                    />
                </div>
            </div>
        </div>
    );
};

export default TrafficPrediction;