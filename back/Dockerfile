# --- 1단계: 빌드 스테이지 ---
# Gradle과 Java 17이 설치된 이미지를 가져옵니다.
FROM gradle:7.6-jdk17 AS build

# 작업 디렉토리를 설정합니다.
WORKDIR /app

# 프로젝트의 모든 파일을 도커 안으로 복사합니다.
COPY . .

# Gradle을 사용해 실행 가능한 .jar 파일을 만듭니다. (테스트는 제외하여 속도를 높임)
RUN gradle clean build -x test

# --- 2단계: 실행 스테이지 ---
# 실행할 때는 무거운 Gradle까지는 필요 없으므로 가벼운 자바 실행 환경만 가져옵니다.
FROM amazoncorretto:17-alpine-jdk

WORKDIR /app

# 1단계(build)에서 만들어진 .jar 파일만 쏙 빼서 현재 폴더로 복사합니다.
# 보통 build/libs/폴더 안에 -SNAPSHOT.jar 파일이 생성됩니다.
COPY --from=build /app/build/libs/*.jar app.jar

# 8080 포트를 사용한다고 명시합니다.
EXPOSE 8080

# 프로그램을 실행합니다.
ENTRYPOINT ["java", "-jar", "app.jar"]