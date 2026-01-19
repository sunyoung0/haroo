import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../../pages/css/calendar-custom.css'; // 아까 만든 스타일 파일
import { useState } from 'react';
import { diaryGroupList } from "../../types/types";
import DiaryCard from "./DiaryCard"; // 아까 분리한 카드 재사용!

interface CalendarViewProps {
  diaries: diaryGroupList[];
}

const CalendarView = ({ diaries }: CalendarViewProps) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // 선택된 날짜와 일기 날짜 비교 함수
  const isSameDate = (date1: Date, dateStr: string) => {
    return dateStr?.substring(0, 10) === date1.toISOString().split('T')[0];
  };

  return (
    <div className="flex flex-col items-center animate-in fade-in duration-500">
      {/* 달력 카드 */}
      <div className="w-full bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 mb-8">
        <Calendar
          onChange={(value) => setSelectedDate(value as Date)}
          value={selectedDate}
          formatDay={(_, date) => date.toLocaleString("en", { day: "numeric" })}
          calendarType="gregory"
          className="mx-auto border-none w-full"
          tileContent={({ date }) => {
            const hasDiary = diaries.some((d) => isSameDate(date, d.createdAt));
            return hasDiary ? (
              <div className="flex justify-center mt-1">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
              </div>
            ) : null;
          }}
        />
      </div>

      {/* 선택 날짜 일기 리스트 */}
      <div className="w-full space-y-4">
        <div className="flex items-center justify-between px-2 mb-4">
          <h3 className="font-black text-slate-800 text-lg">
            {selectedDate.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })} 일기
          </h3>
        </div>

        {diaries.filter(d => isSameDate(selectedDate, d.createdAt)).length > 0 ? (
          diaries
            .filter(d => isSameDate(selectedDate, d.createdAt))
            .map(diary => <DiaryCard key={diary.id} diary={diary} />) // 카드 컴포넌트 재사용!
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