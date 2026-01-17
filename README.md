<div align="center">

  <h3>📖 그룹 일기 시스템</h3>
  <p>개인적인 기록부터 소중한 사람들과의 공유 기록까지, 실시간 알람 기능이 결합된 스마트 플랫폼 </p>

</div>

<br />

## 📋 프로젝트 개요
- **프로젝트명**: 그룹 일기 관리 시스템 (Group Diary System)
- **핵심 가치**: 실시간 연결성, 작성의 편의성, 직관적인 관리
- **개발 배경**: 기존 공유 다이어리 서비스들의 불편한 시각화와 실시간 소통의 부재를 해결하고자 **"기록하는 즐거움과 보는 즐거움"**을 동시에 제공하는 통합 플랫폼을 기획하게 되었습니다.

---

## 🚀 Key Features

<table width="100%">
  <tr>
    <td width="50%">
      <h3>1. 스마트 일기 작성 (Upsert)</h3>
      <ul>
        <li><b>자동 저장 및 복구</b>: 작성 중 유실 방지</li>
        <li><b>isTemp 필드</b>: 임시 저장 상태 관리</li>
        <li><b>Debouncing</b>: 서버 부하 최적화</li>
      </ul>
    </td>
    <td width="50%">
      <h3>2. 실시간 알림 (SSE)</h3>
      <ul>
        <li><b>실시간 푸시</b>: 댓글, 좋아요, 초대 알림</li>
        <li><b>미열람 알림 복구</b>: 구독 시 즉시 전송</li>
        <li><b>자동 스케줄링</b>: 30일 경과 알림 자동 삭제</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>3. 대시보드 관리</h3>
      <ul>
        <li><b>유형별 구분</b>: Personal / Shared 그룹화</li>
        <li><b>테마 차별화</b>: Enum 기반 컬러 매칭</li>
        <li><b>반응형 그리드</b>: 모든 기기 최적화</li>
      </ul>
    </td>
    <td width="50%">
      <h3>4. 데이터 최적화</h3>
      <ul>
        <li><b>QueryDSL</b>: 타입 안정적 동적 쿼리</li>
        <li><b>Dirty Checking</b>: 효율적인 상태 업데이트</li>
        <li><b>API 모듈화</b>: Axios Interceptor 활용</li>
      </ul>
    </td>
  </tr>
</table>

---

## 🏗 System Architecture

<br />
프로젝트는 확장성과 유지보수를 위해 **도메인 중심 설계(Domain-Driven Design)** 개념을 도입하여 각 엔티티 간의 권한과 역할을 명확히 구분했습니다.

---

## 🛠 Tech Stack

### 💻 Backend
<p>
  <img src="https://img.shields.io/badge/Java_17-007396?style=for-the-badge&logo=java&logoColor=white" />
  <img src="https://img.shields.io/badge/Spring_Boot_3.x-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white" />
  <img src="https://img.shields.io/badge/Spring_Data_JPA-6DB33F?style=for-the-badge&logo=hibernate&logoColor=white" />
  <img src="https://img.shields.io/badge/QueryDSL-073159?style=for-the-badge&logo=java&logoColor=white" />
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" />
</p>

### 🎨 Frontend
<p>
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  <img src="https://img.shields.io/badge/Zustand-443E38?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white" />
</p>
