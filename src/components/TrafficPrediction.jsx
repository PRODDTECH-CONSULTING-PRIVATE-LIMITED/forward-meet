import { DatePicker, Button } from "antd";
import dayjs from "dayjs";

const TrafficPrediction = (props) => {
    const {selectedDateTime, setSelectedDateTime} = props;  
    return (

            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
            <p className="text-gray-700 font-semibold mb-3 text-sm">
                ⏰ Traffic Prediction (Driving Only)
                </p>
                <div>
                <label
                htmlFor="trafficDateTime"
                className="block text-gray-600 text-xs font-semibold mb-1"
                >
                Date & Time:
                </label>
                <DatePicker
                id="trafficDateTime"
                showTime={{ format: "HH:mm" }}
                format="YYYY-MM-DD HH:mm"
                value={selectedDateTime ? dayjs(selectedDateTime) : null}
                onChange={(date, dateString) => setSelectedDateTime(dateString)}
                className="w-full"
                />
            </div>
        </div>
    )
}  
export default TrafficPrediction;           