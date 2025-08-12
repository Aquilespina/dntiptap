import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faClock } from "@fortawesome/free-solid-svg-icons";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

interface DateProps {
    type: "date" | "time";
    id: "initial" | "end" | "invitation_schedule_date";
    label: string;
    startDate?: Date | null;
    value: Date | null;
    onChange: (value: Date | null) => void;
    minDate?: Date;
    disabled?: boolean;
}

export default function Dates({
    type,
    id,
    label,
    startDate,
    value,
    onChange,
    disabled = false,
}: DateProps) {
    const today = new Date();
    const isDate = type === "date";
    const icon = isDate ? faCalendar : faClock;

    const handleChange = (date: Date | null) => {
        if (!date) {
            onChange(null);
            return;
        }

        if (!isDate && value) {
            const newDate = new Date(value);
            newDate.setHours(date.getHours());
            newDate.setMinutes(date.getMinutes());
            onChange(newDate);
        } else {
            const localDate = dayjs(date).tz(dayjs.tz.guess()).toDate();
            onChange(localDate);
        }
    };

    const displayValue = value ? dayjs(value).tz(dayjs.tz.guess()).toDate() : null;

    return (
        <div>
            <label htmlFor={id} className={`block font-md-base mb-2 ${disabled ? 'text-gray-400' : ''}`}>
                {label}
            </label>
            <div className={`flex items-center px-3 py-2 w-full rounded-sm border ${disabled ? 'bg-gray-100 border-gray-300' : 'bg-white border-input-border'}`}>
                <DatePicker
                    id={id}
                    selected={displayValue}
                    onChange={handleChange}
                    placeholderText={
                        isDate
                            ? id === "initial"
                                ? "Seleccione fecha de inicio"
                                : "Seleccione fecha de fin"
                            : "-- : -- horas"
                    }
                    className={`flex-1 text-sm outline-none w-full ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white'}`}
                    dateFormat={isDate ? "dd/MM/yyyy" : "HH:mm"}
                    showTimeSelect={!isDate}
                    showTimeSelectOnly={!isDate}
                    timeIntervals={15}
                    timeFormat="HH:mm"
                    timeCaption="Hora"
                    minDate={
                        isDate
                            ? id === "initial"
                                ? today
                                : startDate || today
                            : undefined
                    }
                    disabled={disabled}
                />

                <FontAwesomeIcon
                    icon={icon}
                    className={`ml-6 ${disabled ? 'text-gray-400' : 'text-primary'}`}
                    size="lg"
                />
            </div>
        </div>
    );
}
