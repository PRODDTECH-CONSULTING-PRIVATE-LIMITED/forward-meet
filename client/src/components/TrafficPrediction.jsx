import { DatePicker, TimePicker } from "antd";
import dayjs from "dayjs";
import { CalendarOutlined, ClockCircleOutlined } from '@ant-design/icons';

const TrafficPrediction = (props) => {
    const { selectedDate, setSelectedDate, selectedTime, setSelectedTime } = props;

    return (
        <div className="w-full mt-10">
            <div className="flex gap-10 w-full">
                {/* Date Picker Section */}
                <div className="flex-1 group relative">
                    <div className="premium-field-container">
                        <label className="premium-field-label">
                            📅 Date
                        </label>
                        <DatePicker
                            id="trafficDate"
                            format="YYYY-MM-DD"
                            value={selectedDate ? dayjs(selectedDate) : null}
                            onChange={(date, dateString) => setSelectedDate(dateString)}
                            placeholder="Select date"
                            suffixIcon={<CalendarOutlined className="premium-field-icon" />}
                            className="premium-picker-integrated"
                            active={!!selectedDate}
                            style={{ width: '100%', border: 'none', background: 'transparent', padding: 0, boxShadow: 'none' }}
                        />
                    </div>
                </div>

                {/* Time Picker Section */}
                <div className="flex-1 group relative">
                    <div className="premium-field-container">
                        <label className="premium-field-label">
                            🕐 Time
                        </label>
                        <TimePicker
                            id="trafficTime"
                            format="HH:mm"
                            value={selectedTime ? dayjs(selectedTime, "HH:mm") : null}
                            onChange={(time, timeString) => setSelectedTime(timeString)}
                            placeholder="Select time"
                            suffixIcon={<ClockCircleOutlined className="premium-field-icon" />}
                            className="premium-picker-integrated"
                            minuteStep={15}
                            style={{ width: '100%', border: 'none', background: 'transparent', padding: 0, boxShadow: 'none' }}
                        />
                    </div>
                </div>
            </div>
            
            <style>{`
                .premium-field-container {
                    background: #ffffff;
                    border: 1px solid #e2e8f0;
                    border-radius: 20px;
                    padding: 12px 20px;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                    cursor: pointer;
                }
                .premium-field-container:hover {
                    border-color: #6366f1;
                    box-shadow: 0 10px 20px -10px rgba(99, 102, 241, 0.15);
                    transform: translateY(-2px);
                }
                .premium-field-container:focus-within {
                    border-color: #6366f1;
                    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
                    background: white;
                }
                .premium-field-label {
                    text-[10px] font-black text-indigo-500 uppercase tracking-[0.15em] block;
                    margin-bottom: 2px;
                }
                .premium-field-icon {
                    color: #6366f1 !important;
                    font-size: 16px !important;
                    transition: all 0.3s ease;
                }
                .premium-field-container:hover .premium-field-icon {
                    transform: scale(1.1);
                }
                .premium-picker-integrated input {
                    color: #0f172a !important;
                    font-weight: 700 !important;
                    font-size: 15px !important;
                    height: 24px !important;
                }
                .premium-picker-integrated.ant-picker {
                    padding: 0 !important;
                    height: 28px !important;
                }
                .premium-picker .ant-picker-input > input {
                    color: #0f172a !important;
                    font-weight: 600 !important;
                }
                .premium-picker:hover {
                    box-shadow: 0 10px 20px -10px rgba(99, 102, 241, 0.15) !important;
                    transform: translateY(-1px);
                    border-color: #6366f1 !important;
                }
                .premium-picker-focused, .ant-picker-focused {
                    border-color: #6366f1 !important;
                    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1) !important;
                    background: white !important;
                }
            `}</style>
        </div>
    );
};

export default TrafficPrediction;