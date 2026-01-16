📖 그룹 일기 관리 시스템 (Group Diary System)
개인적인 기록부터 소중한 사람들과의 공유 기록까지, 한 곳에서 관리하는 스마트 일기 플랫폼 > 실시간 알림과 임시 저장 기능을 통해 끊김 없는 기록 경험을 제공합니다.

🛠 Tech Stack
Backend
Language: Java 17

Framework: Spring Boot 3.x

Database: MySQL, Spring Data JPA

Query Optimization: QueryDSL

Real-time: SSE (Server-Sent Events)

Frontend
Framework: React, TypeScript

Styling: Tailwind CSS, Lucide-react (Icons)

State Management: Zustand

Animation: Framer Motion style animations

🏗 System Architecture & Domain Model
프로젝트는 확장성과 유지보수를 고려하여 다음과 같은 핵심 도메인 모델을 기반으로 설계되었습니다.

User: 사용자 인증 및 기본 정보 관리

DiaryGroup: 일기장의 성격 정의 (PERSONAL / SHARED)

DiaryMember: 그룹별 멤버십 및 권한(OWNER, MEMBER) 제어

Diary: 일기 본문 저장 및 임시 저장(isTemp) 상태 관리

Notification: 이벤트 기반 실시간 알림 및 이력 관리

🚀 Key Features
1. 다이어리 그룹 관리 (Dashboard)
사용자의 용도에 맞는 다이어리 환경을 제공합니다.

유형별 생성: 개인 전용(PERSONAL)과 공동 작성용(SHARED) 그룹 구분 생성.

직관적 UI: Enum 타입에 따른 테마 차별화 (개인용: Sky/Book, 그룹용: Indigo/Users).

반응형 그리드: 다양한 디바이스 환경에 최적화된 대시보드 레이아웃.

2. 스마트 일기 작성 (Upsert & Auto-save)
데이터 유실을 방지하고 사용자 편의성을 극대화했습니다.

통합 API: diaryId 유무에 따라 INSERT와 UPDATE를 자동으로 전환하는 Upsert 로직.

최적화: 프론트엔드 디바운싱(Debouncing) 기술을 적용하여 서버 부하 감소.

임시 저장: isTemp 필드를 활용해 작성 중인 내용을 보관하고, 최종 [등록] 시에만 목록에 노출.

3. 실시간 알림 시스템 (SSE 기반)
사용자 간의 인터랙션을 실시간으로 전달합니다.

SseEmitter 활용: 서버-클라이언트 간 단방향 실시간 통신 구현.

알림 복구: 구독 시점에 읽지 않은(isRead=false) 알림을 즉시 전송하여 데이터 유실 방지.

이벤트 트리거: 댓글, 좋아요, 그룹 초대 등 주요 액션 발생 시 실시간 푸시.

4. 데이터 관리 및 자동화
Dirty Checking: 알림 클릭 시 별도의 쿼리 없이 상태를 읽음(isRead=true)으로 변경.

자동 스케줄링: @Scheduled를 활용하여 매일 새벽 3시, 30일이 지난 알림 데이터를 자동 삭제하는 최적화 로직 적용.

💻 Technical Deep Dive
Efficient Data Handling
QueryDSL: 복잡한 동적 쿼리를 타입 안정성을 보장하며 구현했습니다.

SSE Connection: 유저별 전용 스트림 연결을 통해 HTTP 오버헤드를 줄인 실시간 통신을 구현했습니다.

UI/UX Details
Headless UI: 모달 및 오버레이 컴포넌트의 접근성과 커스텀 자유도를 높였습니다.

Axios Interceptor: 공통 헤더 및 베이스 URL 관리를 통해 API 통신 로직을 모듈화했습니다.
