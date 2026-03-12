# 1단계: 빌드 (소스 코드를 압축된 결과물로 만드는 과정)
FROM node:18-alpine AS build
WORKDIR /app

# 라이브러리 설치를 위해 설정 파일 먼저 복사
COPY package.json package-lock.json ./
RUN npm install

# 전체 소스 코드 복사 후 빌드
COPY . .
RUN npm run build

# 2단계: 실행 (Nginx라는 가벼운 웹 서버에 담는 과정)
FROM nginx:stable-alpine

# 위 단계에서 생성된 빌드 결과물을 Nginx의 기본 경로로 복사
# 만약 Vite를 쓰신다면 /app/dist, CRA를 쓰신다면 /app/build로 수정하세요.
COPY --from=build /app/dist /usr/share/nginx/html

# 80번 포트 열기
EXPOSE 80

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]