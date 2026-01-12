import { BookHeart } from "lucide-react";
import { useNavigate } from "react-router-dom";

function AuthLayOut({ children, title, subtitle }) {

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-sky-600 rounded-2xl mb-4">
            <BookHeart className="w-8 h-8 text-white" onClick={() => navigate("/")}/>
          </div>
          <h1 className="text-sky-600 mb-2">{title}</h1>
          <p className="text-gray-600">{subtitle}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-8">{children}</div>
      </div>
    </div>
  );
}

export default AuthLayOut;
