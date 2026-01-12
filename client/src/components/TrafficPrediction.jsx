import { DatePicker } from "antd";
import dayjs from "dayjs";
import { CalendarOutlined } from '@ant-design/icons';

const TrafficPrediction = (props) => {
    const { selectedDate, setSelectedDate } = props;

    return (
        <div className="w-full">
            <DatePicker
                id="trafficDateTime"
                showTime={{ format: "HH:mm" }}
                format="YYYY-MM-DD HH:mm"
                value={selectedDate ? dayjs(selectedDate) : null}
                onChange={(date, dateString) => setSelectedDate(dateString)}
                placeholder="Select Date and Time"
                suffixIcon={<CalendarOutlined style={{ color: '#6366f1' }} />}
                style={{
                    width: '100%',
                    height: '52px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '16px',
                    color: '#1e293b',
                    fontWeight: "bold",
                    padding: '0 16px'
                }}
                className="hover:border-indigo-500 focus:border-indigo-500 transition-all duration-200"
            />
        </div>
    );
};

export default TrafficPrediction;