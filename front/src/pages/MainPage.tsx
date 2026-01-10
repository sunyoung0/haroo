
import AuthLayOut from "../components/auth/AuthLayout";
import SignUpForm from "../components/auth/SignUpForm";

function MainPage() {

  return (
    <>

        <AuthLayOut title="회원가입" subtitle="함께 추억을 기록해요">
          <SignUpForm />
        </AuthLayOut>

    </>
  );
}

export default MainPage;
