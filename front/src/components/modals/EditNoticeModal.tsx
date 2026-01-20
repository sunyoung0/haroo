import { Pin } from 'lucide-react';

interface EditNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  notice: string;
  setNotice: (text: string) => void;
  onUpdate: () => void;
}

const EditNoticeModal = ({
  isOpen,
  onClose,
  notice,
  setNotice,
  onUpdate,
}: EditNoticeModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 animate-in fade-in zoom-in duration-300">
        <div className="flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-sky-50 rounded-2xl flex items-center justify-center">
              <Pin className="text-sky-500" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-800">공지사항 수정</h3>
              <p className="text-sm text-slate-400">그룹 멤버들에게 보여줄 메시지</p>
            </div>
          </div>

          <textarea
            value={notice}
            onChange={(e) => setNotice(e.target.value)}
            onKeyDown={(e) => {
              // 1. 한글 입력 시 중복 이벤트 방지 (Composition 상태 확인)
              if (e.nativeEvent.isComposing) return;

              // 2. Shift 없이 Enter만 눌렀을 때 제출
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault(); // 줄바꿈 방지
                onUpdate(); // 수정 완료 함수 실행
              }
            }}
            placeholder="공지사항을 입력해주세요..."
            className="w-full h-40 px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-sky-200 focus:bg-white rounded-2xl outline-none transition-all text-slate-700 font-medium resize-none mb-6"
          />

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-4 bg-slate-100 text-slate-500 font-bold rounded-2xl hover:bg-slate-200 transition-colors"
            >
              취소
            </button>
            <button
              onClick={onUpdate}
              className="flex-1 py-4 bg-sky-500 text-white font-bold rounded-2xl hover:bg-sky-600 transition-all shadow-lg shadow-sky-100"
            >
              수정 완료
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditNoticeModal;