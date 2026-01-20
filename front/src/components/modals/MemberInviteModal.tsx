import { Users } from 'lucide-react';

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  inviteEmail: string;
  setInviteEmail: (email: string) => void;
  onSendInvite: () => void;
}

const InviteMemberModal = ({
  isOpen,
  onClose,
  inviteEmail,
  setInviteEmail,
  onSendInvite,
}: InviteMemberModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* 배경 어둡게 */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 모달 박스 */}
      <div className="relative bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl p-8 animate-in fade-in zoom-in duration-300">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-sky-50 rounded-full flex items-center justify-center mb-4">
            <Users className="text-sky-600" size={30} />
          </div>

          <h3 className="text-xl font-black text-slate-800 mb-2">멤버 초대하기</h3>
          <p className="text-sm text-slate-400 mb-6">
            함께 일기를 공유할 멤버의
            <br />
            이메일 주소를 입력해 주세요.
          </p>

          <div className="w-full space-y-4">
            <div className="relative">
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="example@haroo.com"
                className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-sky-200 focus:bg-white rounded-2xl outline-none transition-all text-sm font-medium"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-4 bg-slate-100 text-slate-500 font-bold rounded-2xl hover:bg-slate-200 transition-colors"
              >
                취소
              </button>
              <button
                onClick={onSendInvite}
                className="flex-1 py-4 bg-sky-600 text-white font-bold rounded-2xl hover:bg-sky-700 transition-all shadow-lg shadow-sky-100"
              >
                초대장 전송
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteMemberModal;