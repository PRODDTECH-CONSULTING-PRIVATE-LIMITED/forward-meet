import { DatePicker } from "antd";
import dayjs from "dayjs";
import { CalendarOutlined } from '@ant-design/icons';

const TrafficPrediction = (props) => {
    const { selectedDateTime, setSelectedDateTime } = props;

    return (
        <div className="">
            <DatePicker
                id="trafficDateTime"
                showTime={{ format: "HH:mm" }}
                format="YYYY-MM-DD HH:mm"
                value={selectedDateTime ? dayjs(selectedDateTime) : null}
                onChange={(date, dateString) => setSelectedDateTime(dateString)}
                placeholder="Select Date and Time"
                suffixIcon={<CalendarOutlined style={{ color: 'white' }} />}
                style={{
                    width: '229px',
                    height: '48px',
                    background: '#8659FF',
                    border: 'none',
                    borderRadius: '6px',
                    color: 'white',
                    textcolor: 'white',
                    fontWeight:"bold"
                }}
                className="text-white font-medium"
            />
        </div>
    );
};

export default TrafficPrediction;