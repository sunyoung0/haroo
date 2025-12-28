import { useState } from "react";
import { BookHeart, Mail, Lock, User } from 'lucide-react';

function MainPage() {
  const [isSignUp, setIsSignUp] = useState(false);

  if (isSignUp) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-sky-100 to-white flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-sky-600 rounded-2xl mb-4">
              <BookHeart className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-sky-600 mb-2">회원가입</h1>
            <p className="text-gray-600">함께 추억을 기록해요</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <form className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    placeholder="email@example.com"
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    placeholder="비밀번호를 입력하세요"
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Nickname</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="닉네임을 입력하세요"
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
              >
                Sign Up
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                className="text-sm text-sky-600 hover:text-sky-700"
                onClick={() => setIsSignUp(false)}
              >
                이미 계정이 있으신가요? 로그인
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-sky-100 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-sky-600 rounded-2xl mb-4">
            <BookHeart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-sky-600 mb-2">나의 다이어리</h1>
          <p className="text-gray-600">매일의 소중한 순간을 기록하세요</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form className="space-y-4">
            <div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
            >
              Login
            </button>
          </form>

          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-sm text-gray-500">또는</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600 mb-3">아직 계정이 없으신가요?</p>
            <button
              onClick={() => setIsSignUp(true)}
              className="w-full py-3 border border-sky-600 text-sky-600 rounded-lg hover:bg-sky-50 transition-colors"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
