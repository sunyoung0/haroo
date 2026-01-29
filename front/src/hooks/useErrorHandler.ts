import axios from "axios";
import { useSnackbar } from "../context/SnackbarContext";

export const useErrorHandler = () => {
  const { showSnackbar } = useSnackbar();

  const errorHandler = (
    error: unknown,
    defaultMsg: string = "오류가 발생했습니다.",
  ) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const serverMessage = error.response?.data.message || defaultMsg;

      switch (status) {
        case 400:
        case 401:
        case 403:
        case 404:
        case 409:
          showSnackbar(serverMessage, "warning");
          break;
        case 500:
          showSnackbar("서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.", "error");
          break;
        default:
          showSnackbar("예상치 못한 오류가 발생했습니다.", "error");
          console.error("API Error:", error);
      }

    } else {
        showSnackbar("네트워크 오류가 발생했습니다.", "error");
        console.error("Unknown Error", error);
    }
  };

  return { errorHandler };
};
