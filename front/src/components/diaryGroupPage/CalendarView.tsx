import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../../css/calendar-custom.css";
import { useState } from "react";
import { diaryGroupList } from "../../types/types";
import DiaryCard from "./DiaryCard";

interface CalendarViewProps {
  diaries: diaryGroupList[];
}

const CalendarView = ({ diaries }: CalendarViewProps) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // 선택된 날짜와 일기 날짜 비교 함수
  const isSameDate = (date1: Date, dateStr: string) => {
    if (!dateStr) return false;

    // JS Date를 YYYY-MM-DD 형식으로 변환 (KST 기준)
    const offset = date1.getTimezoneOffset() * 60000;
    const localDate = new Date(date1.getTime() - offset)
      .toISOString()
      .split("T")[0];

    return dateStr.substring(0, 10) === localDate;
  };

  return (
    <div className="flex flex-col items-center animate-in fade-in duration-500">
      {/* 달력 카드 */}
      <div className="w-full bg-white p-4 pb-6 rounded-[2.5rem] shadow-sm border border-slate-100 mb-8">
        <Calendar
          onChange={(value) => setSelectedDate(value as Date)}
          value={selectedDate}
          formatDay={(_, date) => date.toLocaleString("en", { day: "numeric" })}
          calendarType="gregory"
          locale="ko-KR"
          next2Label={null}
          prev2Label={null}
          showNeighboringMonth={false}
          className="mx-auto border-none w-full"
          tileClassName={({ date, view }) => {
            if (view === "month" && date.getDay() === 0) {
              // 0은 일요일
              return "sun-text-red";
            }
          }}
          tileContent={({ date, view }) => {
            if (view !== "month") return null;
            const hasDiary = diaries.some((d) => isSameDate(date, d.diaryDate));
            const isSelected =
              selectedDate.toDateString() === date.toDateString();

            return (
              <div className="flex flex-col items-center">
                <div className="mt-3">
                  {hasDiary ? (
                    <div
                      className={`w-1.5 h-1.5 rounded-full transition-all ${
                        isSelected ? "bg-white" : "bg-sky-400"
                      }`}
                    />
                  ) : (
                    <div className="w-1.5 h-1.5" />
                  )}
                </div>
              </div>
            );
          }}
        />
      </div>

      <div className="w-full space-y-4 pb-20">
        {" "}
        {/* 하단 여백 추가 */}
        <div className="flex items-center gap-2 px-4 mb-2">
          <div className="w-1.5 h-6 bg-sky-500 rounded-full"></div>
          <h3 className="font-black text-slate-800 text-xl tracking-tight">
            {selectedDate.toLocaleDateString("ko-KR", {
              month: "long",
              day: "numeric",
            })}
          </h3>
          <span className="text-slate-400 font-medium pt-1">일기</span>
        </div>
        {diaries.filter((d) => isSameDate(selectedDate, d.diaryDate)).length >
        0 ? (
          diaries
            .filter((d) => isSameDate(selectedDate, d.diaryDate))
            .map((diary) => <DiaryCard key={diary.id} diary={diary} />)
        ) : (
          <div className="bg-white p-12 rounded-[2.5rem] text-center text-slate-400 border border-dashed border-slate-200 font-medium">
            이날은 작성된 일기가 없어요 ✍️
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarView;