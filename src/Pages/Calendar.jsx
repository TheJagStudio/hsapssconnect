import React, { useEffect, useState } from "react";

const Calendar = () => {
    const [now, setNow] = useState(new Date());
    const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
    const [selectedYear, setSelectedYear] = useState(now.getFullYear());
    const [monthNames, setMonthNames] = useState(["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]);
    const [currentMonth, setCurrentMonth] = useState(now.getMonth());
    const [currentYear, setCurrentYear] = useState(now.getFullYear());
    const [firstDay, setFirstDay] = useState(new Date(currentYear, currentMonth, 1));
    const [lastDay, setLastDay] = useState(new Date(currentYear, currentMonth + 1, 0));
    const [startingDay, setStartingDay] = useState(firstDay.getDay());
    const [endingDay, setEndingDay] = useState(6 - lastDay.getDay());
    const [monthDays, setMonthDays] = useState(lastDay.getDate());
    const [lastMonthDays, setLastMonthDays] = useState(new Date(currentYear, currentMonth, 0).getDate());
    const [totalDays, setTotalDays] = useState(startingDay + monthDays + endingDay);
    const [selectedDate, setSelectedDate] = useState(0);
    const [events, setEvents] = useState([]);
    const [mandirEvents, setMandirEvents] = useState([]);
    const classes = "bg-orange-500 bg-green-500 bg-blue-500 bg-red-500 bg-purple-500 bg-yellow-500 bg-pink-500";
    const classes2 = "bg-orange-50 bg-green-50 bg-blue-50 bg-red-50 bg-purple-50 bg-yellow-50 bg-pink-50";
    const classes3 = "bg-orange-100 bg-green-100 bg-blue-100 bg-red-100 bg-purple-100 bg-yellow-100 bg-pink-100";
    const classes4 = "border-orange-500 border-green-500 border-blue-500 border-red-500 border-purple-500 border-yellow-500 border-pink-500";
    const classes5 = "outline-orange-500 outline-green-500 outline-blue-500 outline-red-500 outline-purple-500 outline-yellow-500 outline-pink-500";

    useEffect(() => {
        setSelectedMonth(currentMonth);
        setSelectedYear(currentYear);

        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/event-list/`)
            .then((res) => res.json())
            .then((data) => {
                setEvents(data.events);
            });

        fetch("/static/json/calendar-data.json")
            .then((res) => res.json())
            .then((data) => {
                setMandirEvents(data);
            });
    }, []);

    useEffect(() => {
        let firstDayTemp = new Date(selectedYear, selectedMonth, 1);
        let lastDayTemp = new Date(selectedYear, selectedMonth + 1, 0);
        let startingDayTemp = firstDayTemp.getDay();
        let endingDayTemp = 6 - lastDayTemp.getDay();
        let monthDaysTemp = lastDayTemp.getDate();
        let lastMonthDaysTemp = new Date(selectedYear, selectedMonth, 0).getDate();
        let totalDaysTemp = startingDayTemp + monthDaysTemp + endingDayTemp;
        setCurrentMonth(selectedMonth);
        setCurrentYear(selectedYear);
        setFirstDay(firstDayTemp);
        setLastDay(lastDayTemp);
        setStartingDay(startingDayTemp);
        setEndingDay(endingDayTemp);
        setMonthDays(monthDaysTemp);
        setLastMonthDays(lastMonthDaysTemp);
        setTotalDays(totalDaysTemp);
    }, [selectedMonth, selectedYear]);
    return (
        <div className="p-5 relative">
            <section className="relative">
                <div className="w-full pb-20 relative z-10 ">
                    <div className="w-full max-w-7xl mx-auto lg:px-8">
                        <div className="grid grid-cols-12 lg:gap-8 max-w-4xl mx-auto lg:max-w-full">
                            <div className="col-span-12 lg:col-span-5">
                                <h2 className="text-3xl leading-tight text-primary-600 lg:mb-1.5">Upcoming Events</h2>
                                <p className="text-lg font-normal text-gray-600 mb-3 lg:mb-8">Don’t miss schedule</p>
                                <div className="flex gap-5 flex-col h-fit lg:h-[70vh] overflow-y-auto ">
                                    {/* {events.map((event, index) => (
                                        <div key={index} className="p-6 rounded-xl bg-white shadow">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-2.5">
                                                    <span className={`w-2.5 h-2.5 rounded-full outline outline-offset-2 outline-${event?.color}-500 bg-${event?.color}-500`}></span>
                                                    <p className="text-base font-medium text-primary-600">{event?.date}</p>
                                                </div>
                                            </div>
                                            <h6 className="leading-8 font-semibold text-primary-700 mb-1">{event?.title}</h6>
                                            <p className="text-sm font-normal text-gray-600">{event?.description}</p>
                                        </div>
                                    ))} */}
                                </div>
                            </div>
                            <div className="col-span-12 lg:col-span-7 px-2.5 py-5 sm:p-8 rounded-2xl max-lg:row-start-1 lg:bg-gradient-to-b lg:from-gray-50 lg:to-white">
                                <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-5">
                                    <div className="flex items-center justify-between w-full gap-4">
                                        <h5 className="text-4xl leading-8 text-primary-600 font-haspss flex items-center justify-center gap-3">
                                            {monthNames[selectedMonth]} {selectedYear}{" "}
                                            <span className="text-xl font-bold">
                                                ( {mandirEvents?.[selectedYear]?.[monthNames[selectedMonth - 1]]?.monthNameGuj}-{mandirEvents?.[selectedYear]?.[monthNames[selectedMonth]]?.monthNameGuj} )
                                            </span>
                                        </h5>
                                        <div className="flex items-center">
                                            <button
                                                onClick={() => {
                                                    if (selectedMonth === 0) {
                                                        setSelectedYear(selectedYear - 1);
                                                        setSelectedMonth(11);
                                                    } else {
                                                        setSelectedMonth(Math.abs((selectedMonth - 1) % 12));
                                                    }
                                                }}
                                                className="text-secondary-600 p-1 rounded transition-all duration-300 hover:text-white hover:bg-secondary-600"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 16 16" fill="none">
                                                    <path d="M10.0002 11.9999L6 7.99971L10.0025 3.99719" stroke="currentcolor" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedMonth((selectedMonth + 1) % 12);
                                                    if (selectedMonth === 11) setSelectedYear(selectedYear + 1);
                                                }}
                                                className="text-secondary-600 p-1 rounded transition-all duration-300 hover:text-white hover:bg-secondary-600"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 16 16" fill="none">
                                                    <path d="M6.00236 3.99707L10.0025 7.99723L6 11.9998" stroke="currentcolor" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="border border-secondary-500/50 rounded-xl shadow ">
                                    <div className="grid grid-cols-7 rounded-t-3xl border-b border-secondary-500/50">
                                        <div className="py-3.5 border-r rounded-tl-xl border-secondary-500/50 bg-secondary-50 flex items-center justify-center text-sm font-medium text-secondary-600">Sun</div>
                                        <div className="py-3.5 border-r border-secondary-500/50 bg-secondary-50 flex items-center justify-center text-sm font-medium text-secondary-600">Mon</div>
                                        <div className="py-3.5 border-r border-secondary-500/50 bg-secondary-50 flex items-center justify-center text-sm font-medium text-secondary-600">Tue</div>
                                        <div className="py-3.5 border-r border-secondary-500/50 bg-secondary-50 flex items-center justify-center text-sm font-medium text-secondary-600">Wed</div>
                                        <div className="py-3.5 border-r border-secondary-500/50 bg-secondary-50 flex items-center justify-center text-sm font-medium text-secondary-600">Thu</div>
                                        <div className="py-3.5 border-r border-secondary-500/50 bg-secondary-50 flex items-center justify-center text-sm font-medium text-secondary-600">Fri</div>
                                        <div className="py-3.5 rounded-tr-xl bg-secondary-50 flex items-center justify-center text-sm font-medium text-secondary-600">Sat</div>
                                    </div>
                                    <div className="grid grid-cols-7 rounded-b-xl">
                                        {[...Array(startingDay).keys()].map((day, index) => (
                                            <div key={index} className="flex lg:aspect-square max-lg:min-h-[60px] p-3.5 bg-gray-50 border-r border-b border-secondary-500/50 transition-all duration-300 hover:bg-secondary-50">
                                                <span className="text-xs font-semibold text-gray-400">{lastMonthDays - startingDay + day + 1}</span>
                                            </div>
                                        ))}
                                        {[...Array(monthDays).keys()].map((day, index) => {
                                            let dayData = mandirEvents?.[selectedYear]?.[monthNames[selectedMonth]]?.[day+1];
                                            if (dayData?.iconURL === "") {
                                                return (
                                                    <div key={index} className={"group flex flex-col items-center justify-start lg:aspect-square max-lg:min-h-[60px] pt-1 pb-6 bg-white relative border-secondary-500/50 transition-all duration-300 hover:bg-secondary-50 cursor-pointer " + ((startingDay + day + 1) % 7 === 0 ? " " : "border-r ") + (totalDays - 6 > startingDay + day + 1 ? "border-b" : (startingDay + day + 1) % 7 === 1 ? " rounded-bl-xl" : "")}>
                                                        <span className={"text-xs font-semibold text-primary-600 my-1 " + (now.getDate() === day + 1 && now.getMonth() === selectedMonth && now.getFullYear() === selectedYear ? " bg-secondary-500 rounded-full text-white w-5 h-fit scale-110 lg:scale-100 p-1 lg:p-0 aspect-square text-center flex items-center justify-center " : "")}>{day + 1}</span>
                                                        <span className="text-[0.7rem] text-primary-600 text-center">
                                                            {dayData?.pakshaGuj} {dayData?.tithiGuj}
                                                        </span>
                                                        {events.map((event, index2) => {
                                                            if (event?.day === day + 1 && event?.month - 1 === selectedMonth && event?.year === selectedYear) {
                                                                return (
                                                                    <div key={index2} className={`absolute  bottom-1 left-1 p-[0.3rem] group-hover:px-2.5 h-5 group-hover:h-fit w-5 overflow-hidden group-hover:w-fit rounded group-hover:z-50 bg-${event.color}-100 lg:bg-${event.color}-50 border-${event.color}-500 border group-hover:shadow-lg`}>
                                                                        <p className={`hidden group-hover:block text-xs font-medium text-${event.color}-500 mb-px truncate`}>{event?.title}</p>
                                                                        <span className={`hidden group-hover:block text-xs font-normal text-${event.color}-500 whitespace-nowrap`}>{event?.date.split("|")[1]}</span>
                                                                        <p className={`block group-hover:hidden w-2 h-2 rounded-full bg-${event.color}-500 animate-pulse `}></p>
                                                                    </div>
                                                                );
                                                            }
                                                        })}
                                                    </div>
                                                );
                                            } else {
                                                return (
                                                    <div key={index} className={"group flex flex-col items-center justify-start lg:aspect-square max-lg:min-h-[60px] pt-1 pb-6 bg-white relative border-secondary-500/50 transition-all duration-300 hover:bg-secondary-50 cursor-pointer " + ((startingDay + day + 1) % 7 === 0 ? " " : "border-r ") + (totalDays - 6 > startingDay + day + 1 ? "border-b" : (startingDay + day + 1) % 7 === 1 ? " rounded-bl-xl" : "")}>
                                                        <img src={dayData?.iconURL} className="w-10 h-10 mix-blend-multiply" alt={dayData?.iconURL} />
                                                        <span className="text-[0.7rem] text-primary-600 text-center">{dayData?.events?.[0]?.eventTitleGuj ? dayData?.events?.[0]?.eventTitleGuj : dayData?.pakshaGuj + " " + dayData?.tithiGuj}</span>
                                                        {events.map((event, index2) => {
                                                            if (event?.day === day + 1 && event?.month - 1 === selectedMonth && event?.year === selectedYear) {
                                                                return (
                                                                    <div key={index2} className={`absolute  bottom-1 left-1 p-[0.3rem] group-hover:px-2.5 h-5 group-hover:h-fit w-5 overflow-hidden group-hover:w-fit rounded group-hover:z-50 bg-${event.color}-100 lg:bg-${event.color}-50 border-${event.color}-500 border group-hover:shadow-lg`}>
                                                                        <p className={`hidden group-hover:block text-xs font-medium text-${event.color}-500 mb-px truncate`}>{event?.title}</p>
                                                                        <span className={`hidden group-hover:block text-xs font-normal text-${event.color}-500 whitespace-nowrap`}>{event?.date.split("|")[1]}</span>
                                                                        <p className={`block group-hover:hidden w-2 h-2 rounded-full bg-${event.color}-500 animate-pulse `}></p>
                                                                    </div>
                                                                );
                                                            }
                                                        })}
                                                    </div>
                                                );
                                            }
                                        })}
                                        {[...Array(endingDay).keys()].map((day, index) => (
                                            <div key={index} className={"flex lg:aspect-square max-lg:min-h-[60px] p-3.5 relative bg-gray-50 border-secondary-500/50 transition-all duration-300 hover:bg-secondary-50 cursor-pointer last:rounded-br-xl " + (day + 1 === endingDay ? " " : "border-r ")}>
                                                <span className="text-xs font-semibold text-gray-400">{day + 1}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Calendar;
