import { storage } from "../firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

/**
 * @param file 업로드할 파일 객체
 * @param folder 저장할 폴더명 (profiles, diary, posts 등)
 * @param userId 사용자 ID (경로 구분용)
 */

export const uploadImage = async (
  file: File,
  folder: string,
  userId: string | null,
): Promise<string> => {
  try {
    // 파일명 중복 방지를 위해 타임스탬프와 램덤 문자열 조합
    const fileName = `${Date.now()}_${file.name}`;
    const storageRef = ref(storage, `${folder}/${userId}/${fileName}`);

    /// 업로드 실행
    const snapshot = await uploadBytes(storageRef, file);

    // 공개 URL 반환
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.log("파이어베이스 업로드중 문제가 발생했습니다.", error);
    throw new Error("이미지 업로드에 실패했습니다.");
  }
};