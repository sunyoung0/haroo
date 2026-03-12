# 🔒 HTTPS 및 Nginx 리버스 프록시 구축 가이드

본 문서는 GCP(Google Cloud Platform) 환경에서 Nginx와 Certbot을 활용하여 도메인에 HTTPS(SSL 인증서)를 적용하고, 프론트엔드와 백엔드로 트래픽을 분배(Reverse Proxy)하는 과정을 정리한 문서입니다.

## 📌 핵심 개념 (Nginx & Certbot)

- **Nginx (엔진엑스):** 서버의 80(HTTP), 443(HTTPS) 포트를 전담하여 외부 요청을 가장 먼저 받아내는 웹 서버 겸 리버스 프록시(안내데스크)입니다.
- **Certbot (서트봇):** Let's Encrypt에서 제공하는 무료 SSL 인증서를 자동으로 발급받고, Nginx 설정까지 수정해 주며, 만료 전 자동 갱신까지 해주는 로봇입니다.
- **Reverse Proxy (리버스 프록시):** Nginx가 단일 출입구 역할을 하며, 요청 URL에 따라 내부 도커 컨테이너(프론트엔드 3000 포트, 백엔드 8080 포트)로 트래픽을 안전하게 전달합니다.

---

## 🛠️ 1. 사전 준비 (80포트 확보)

Nginx가 80번 정문을 사용해야 하므로, 기존에 80포트를 차지하고 있던 프론트엔드 컨테이너를 종료합니다.

```bash
sudo docker rm -f frontend
```

2. Nginx 설치 및 도메인 인식

1) Nginx 설치

```Bash
sudo apt update
sudo apt install nginx -y
```

2. 도메인 설정
   Nginx 기본 설정 파일을 열어 내 도메인을 등록합니다.

```Bash
sudo nano /etc/nginx/sites-available/default
Nginx
# (수정 전) server_name _;
# (수정 후) 아래와 같이 본인 도메인으로 변경
server_name haroo.p-e.kr;
```

저장 후 Nginx에 설정을 적용합니다.

```Bash
sudo nginx -t  # 오타 검사 (successful 확인)
sudo systemctl reload nginx
```

3. Certbot을 이용한 HTTPS(SSL) 적용

1) Certbot 설치

```Bash
sudo apt install certbot python3-certbot-nginx -y
```

2. 인증서 발급 및 자동 설정

```Bash
sudo certbot --nginx -d haroo.p-e.kr
```

진행 중 이메일 입력, 약관 동의(Y), 광고 수신 거부(N)를 차례로 입력합니다.

성공 시 Congratulations! You have successfully enabled HTTPS... 메시지가 출력됩니다.

🔀 4. Nginx 라우팅 (경로 분배) 설정
HTTPS가 적용되었으니, Nginx가 트래픽을 프론트엔드와 백엔드로 나누어 보내도록 설정합니다.

```Bash
sudo nano /etc/nginx/sites-available/default
```

Certbot이 자동으로 만들어둔 listen 443 ssl 블록 안쪽의 location / 부분을 찾아 아래와 같이 수정합니다.

```Nginx
        # 1. 기본 접속 (/) -> 프론트엔드 컨테이너 (3000포트)로 전달
        location / {
                proxy_pass http://localhost:3000;
        }

        # 2. API 요청 (/api/) -> 백엔드 컨테이너 (8080포트)로 전달
        location /api/ {
                proxy_pass http://localhost:8080/;
        }
```

⚠️ 주의: /api/ 와 8080/ 끝에 있는 후행 슬래시(/)는 경로를 덮어쓰는 데 필수적이므로 절대 누락하지 않습니다.

설정을 저장하고 Nginx를 다시 로드합니다.

```Bash
sudo nginx -t
sudo systemctl reload nginx
```

5. 프론트엔드 통신 에러 (Mixed Content) 해결
HTTPS 환경이 구축되면, 프론트엔드가 백엔드로 http:// 요청을 보낼 때 브라우저가 보안상 통신을 차단하는 Mixed Content 에러가 발생합니다. 이를 해결하기 위해 CI/CD 설정을 업데이트합니다.

1) GitHub Secrets 수정 (FRONTEND_ENV)
프론트엔드의 환경변수(.env)에 있는 백엔드 API 주소를 https로 변경합니다. (포트번호 8080은 제거합니다. Nginx가 알아서 처리합니다.)

VITE_API_BASE_URL=https://haroo.p-e.kr/api

2) CI/CD deploy.yml 포트 매핑 수정
프론트엔드 컨테이너가 서버의 3000번 포트를 열어두도록 도커 실행 명령어를 수정합니다.

```YAML
# (수정 전) -p 80:80
# (수정 후) -p 3000:80
sudo docker run -d -p 3000:80 --name frontend --network diary-net \
  asia-northeast3-docker.pkg.dev/.../frontend-app
```

3) 재배포 (Re-run)
GitHub Actions에서 워크플로우를 재실행하여 프론트엔드를 새로운 환경변수로 다시 빌드 및 배포하면 모든 세팅이 완료됩니다.