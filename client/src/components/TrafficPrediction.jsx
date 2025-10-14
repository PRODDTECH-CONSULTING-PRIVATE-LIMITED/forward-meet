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
                suffixIcon={<CalendarOutlined style={{ color: '#ABABAB', fontSize: '24px' }} />}
                style={{
                    width: '100%',
                    background: '#FFFFFF',
                    border: '0.6px solid #C6C6C6',
                    borderRadius: '6px',
                    padding: '16px 16px',
                }}
                className="custom-datepicker"
            />
            <style jsx>{`
                .custom-datepicker.ant-picker {
                    height: auto !important;
                    min-height: 54px !important;
                }
                
                .custom-datepicker .ant-picker-input > input {
                    font-family: 'DM Sans', sans-serif !important;
                    font-weight: 500 !important;
                    font-size: 20px !important;
                    line-height: 30px !important;
                    color: '#000000' !important;
                }
                
                .custom-datepicker .ant-picker-input > input::placeholder {
                    color: #ABABAB !important;
                    font-family: 'DM Sans', sans-serif !important;
                    font-weight: 500 !important;
                    font-size: 20px !important;
                    line-height: 30px !important;
                }
                
                .custom-datepicker .ant-picker-suffix {
                    width: 24px;
                    height: 24px;
                }

                .custom-datepicker:hover,
                .custom-datepicker:focus {
                    border-color: #C6C6C6 !important;
                }
            `}</style>
        </div>
    );
};

export default TrafficPrediction;