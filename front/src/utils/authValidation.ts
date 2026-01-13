import { z } from "zod";

// 공통 정규식
const passwordRegex =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+={}[\]:;"'<>,.?/\\|-]).{8,}$/;

// 개별 필드 스키마
const emailField = z
  .string()
  .min(1, "이메일을 입력해주세요.")
  .email("올바른 이메일 형식이 아닙니다.");

const passwordField = z
  .string()
  .min(8, "비밀번호는 8자 이상이어야 합니다.")
  .regex(passwordRegex, "영문, 숫자, 특수문자를 포함해야 합니다.");

const nicknameField = z
  .string()
  .min(2, "닉네임은 2자 이상이어야 합니다.")
  .max(10, "닉네임은 10자 이하여야 합니다.");

// 최종 스키마
// 로그인용
export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, "비밀번호를 입력해주세요."),  // 로그인은 형식보단 입력 여부 중심
});

export const signUpSchema = z.object({
  email: emailField,
  password: passwordField,
  nickname: nicknameField,
});

// TypeScript 타입 추출
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;