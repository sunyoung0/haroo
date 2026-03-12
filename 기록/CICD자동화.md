# 🚀 CI/CD 자동 배포 구축 가이드 (Full-Stack)

본 문서는 GitHub Actions, Docker, Google Cloud Platform(GCP)을 활용하여 Spring Boot 백엔드와 React(Vite) 프론트엔드를 자동 배포하는 CI/CD 파이프라인 구축 과정을 정리한 문서입니다.

## 📌 아키텍처 개요
- **버전 관리:** GitHub (main 브랜치 Push 시 자동 실행)
- **CI (지속적 통합):** GitHub Actions를 통해 Docker 이미지 빌드
- **Image Registry:** Google Artifact Registry (asia-northeast3)
- **CD (지속적 배포):** GCP Compute Engine(VM)에 SSH로 접속하여 최신 도커 컨테이너 실행
- **데이터베이스:** MariaDB (데이터 보존을 위해 CI/CD 파이프라인과 분리하여 독립 실행)

---

## 🔐 1. GitHub Secrets 환경 변수 설정
보안을 위해 노출되면 안 되는 주요 정보들은 GitHub 저장소의 `Settings > Secrets and variables > Actions`에 저장하여 안전하게 관리합니다.

| Secret 이름 | 설명 | 예시 / 획득처 |
| :--- | :--- | :--- |
| `GCP_SA_KEY` | GCP 서비스 계정 인증 키 (JSON) | GCP IAM에서 발급 (Artifact Registry 권한 필수) |
| `GCP_PROJECT_ID` | GCP 프로젝트 ID | `haroo-799a8` |
| `GCP_VM_IP` | 배포할 GCP VM의 외부 고정 IP | `34.123.45.67` |
| `GCP_VM_USER` | GCP VM SSH 접속 사용자 이름 | `github-actions` 또는 `본인ID` |
| `GCP_SSH_PRIVATE_KEY` | 서버 접속용 SSH 개인키 | `-----BEGIN...` 부터 끝까지 통째로 복사 |
| `DB_PASSWORD` | MariaDB 접속 비밀번호 | `1234` |
| `FRONTEND_ENV` | 프론트엔드 `.env` 파일 내용 전체 | `VITE_API_BASE_URL=http://...` (줄바꿈 포함) |

---

## 📄 2. CI/CD 워크플로우 파일 (`deploy.yml`)
프로젝트 최상단 폴더에 `.github/workflows/deploy.yml` 경로로 아래 파일을 생성합니다.

```yaml
name: Deploy to GCP (Full Stack)

on:
  push:
    branches: [ "main" ] # main 브랜치에 코드가 푸시되면 자동 실행

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Google Auth
        uses: google-github-actions/auth@v2
        with:
          credentials_json: ${{ secrets.GCP_SA_KEY }}

      - name: Docker Auth & Build & Push
        run: |
          # GCP 도커 레지스트리 로그인
          gcloud auth configure-docker asia-northeast3-docker.pkg.dev
          
          # 1. 백엔드 빌드 및 푸시
          docker build -t asia-northeast3-docker.pkg.dev/${{ secrets.GCP_PROJECT_ID }}/diary-repo/backend-app ./backend
          docker push asia-northeast3-docker.pkg.dev/${{ secrets.GCP_PROJECT_ID }}/diary-repo/backend-app
          
          # 2. 프론트엔드 빌드 전 .env 파일 안전하게 생성 (비밀 금고 내용 주입)
          echo "${{ secrets.FRONTEND_ENV }}" > ./frontend/.env
          
          # 3. 프론트엔드 빌드 및 푸시
          docker build -t asia-northeast3-docker.pkg.dev/${{ secrets.GCP_PROJECT_ID }}/diary-repo/frontend-app ./frontend
          docker push asia-northeast3-docker.pkg.dev/${{ secrets.GCP_PROJECT_ID }}/diary-repo/frontend-app

      - name: SSH Remote Commands & Run Containers
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.GCP_VM_IP }}
          username: ${{ secrets.GCP_VM_USER }}
          key: ${{ secrets.GCP_SSH_PRIVATE_KEY }}
          script: |
            # 1. 기존에 실행 중인 컨테이너 삭제
            sudo docker rm -f backend frontend
            
            # 2. Artifact Registry에서 최신 도커 이미지 다운로드
            sudo docker pull asia-northeast3-docker.pkg.dev/${{ secrets.GCP_PROJECT_ID }}/diary-repo/backend-app
            sudo docker pull asia-northeast3-docker.pkg.dev/${{ secrets.GCP_PROJECT_ID }}/diary-repo/frontend-app
            
            # 3. 백엔드 실행 (런타임에 DB 환경변수 주입)
            sudo docker run -d -p 8080:8080 --name backend --network diary-net \
              -e SPRING_DATASOURCE_URL=jdbc:mariadb://mariadb:3306/diary \
              -e SPRING_DATASOURCE_USERNAME=root \
              -e SPRING_DATASOURCE_PASSWORD=${{ secrets.DB_PASSWORD }} \
              asia-northeast3-docker.pkg.dev/${{ secrets.GCP_PROJECT_ID }}/diary-repo/backend-app
              
            # 4. 프론트엔드 실행 (80 포트)
            sudo docker run -d -p 80:80 --name frontend --network diary-net \
              asia-northeast3-docker.pkg.dev/${{ secrets.GCP_PROJECT_ID }}/diary-repo/frontend-app
```              

3. 핵심 주의사항 (Troubleshooting)
- 프론트엔드 환경변수 (.env) 주입 타이밍:

React(Vite)는 코드를 브라우저용으로 변환하는 **빌드 타임(Build Time)**에 도메인 주소가 코드에 박혀야 합니다.

따라서 도커를 빌드하기 직전에 GitHub Action에서 echo 명령어로 실제 .env 파일을 임시로 만들어주어야 합니다.

- 백엔드 환경변수 (application.yml) 주입 타이밍:

Spring Boot는 서버가 켜지는 **런타임(Run Time)**에 변수를 외부에서 받아올 수 있습니다.

따라서 배포 서버에서 도커 컨테이너를 실행할 때 docker run -e 옵션을 사용하여 DB 비밀번호를 안전하게 넘겨줍니다.

- 데이터베이스(MariaDB)의 독립성:

DB 컨테이너는 배포 스크립트에 포함시키지 않습니다.

CI/CD가 돌 때마다 DB를 껐다 켜거나 삭제하면 유저 데이터가 날아갑니다. DB는 같은 도커 네트워크(diary-net) 안에서 한 번 띄워두고 24시간 혼자 돌게 둡니다. 백엔드는 그저 켜질 때마다 DB에 접속만 할 뿐입니다.