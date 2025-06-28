# Sasp 취약점 실습 및 보안 프로젝트





# 아키텍처


![아키텍처2 drawio](https://github.com/user-attachments/assets/d7662a6b-3742-4be5-bcd1-4f4b06cdece0)





# 공격 시나리오

## 1. Initial Access (초기 접근)

공격자는 로그인 페이지를 대상으로 사전(dictionary) 기반 Brute-force 공격을 수행했다.

취약한 비밀번호를 사용하는 일반 사용자의 계정 정보를 알아냈다.

이후 해당 계정으로 웹사이트에 정상 로그인하여, 내부 시스템으로의 초기에 접근할 수 있었다.

## 2. Discovery & Collection (탐색 및 정보 수집)

로그인에 성공한 후, 공격자는 프로필 조회 기능을 분석했다.

URL에 사용자 ID가 직접 노출되고 있으며, 인증/인가 검증 없이 다른 사용자의 정보에 접근할 수 있음을 발견했다.

이를 통해 다른 사용자들의 개인정보(이메일, 전화번호 등)를 대량으로 수집했다.

또한, 공격자는 수집한 정보를 기반으로 추가적인 공격 경로를 탐색했다.

## 3. Execution & Credential Access (코드 실행 및 인증 정보 접근)

게시판 기능을 통해 공격자는 악성 스크립트(XSS 페이로드)를 삽입할 수 있었다.

게시글 작성 시 입력값 검증이 부실하여, `<script>` 태그를 포함한 게시글을 저장할 수 있었다.

다른 사용자가 게시글을 열람할 때마다, 악성 스크립트가 실행되어 피해자의 세션 쿠키를 공격자 서버로 전송하게 했다.

이를 통해 관리자의 세션 쿠키를 탈취하는 데 성공했다.

## 4. Defense Evasion & Credential Access (방어 회피 및 인증 정보 추가 탈취)

탈취한 세션 쿠키를 사용하여 공격자는 브라우저에 직접 쿠키를 주입했다.

이를 통해 별도의 로그인 과정을 거치지 않고 관리자 권한 세션을 하이재킹했다.

정상적인 세션처럼 보였기 때문에 서버 로그에서는 별다른 이상 징후를 남기지 않았다.

## 5. Privilege Escalation & Collection (권한 상승 및 정보 수집)

관리자 권한을 획득한 이후, 공격자는 관리자 페이지에서 입력 필드의 취약점을 분석했다.

검색 기능에 사용자 입력값을 적절히 필터링하지 않아 SQL Injection/NoSQL Injection 공격이 가능했다.

이를 이용해 데이터베이스의 사용자 목록, 이메일, 비밀번호 해시값 등 민감 정보를 대량으로 탈취했다.

## 6. Persistence & Command and Control (지속적 접근 확보 및 서버 제어)

공격자는 파일 업로드 기능의 보안 취약점을 이용해, 서버에 웹쉘 파일을 업로드했다.

이후 웹쉘을 통해 시스템 명령어를 자유롭게 실행할 수 있었다.

웹쉘을 이용하여 신규 관리자 계정을 생성하고, 서버 crontab 설정을 변경하여 공격자의 리버스 쉘을 지속적으로 유지하는 백도어를 설치했다.

이를 통해 서버에 대한 장기적인 지속 접근 권한을 확보했다.

---

# MITRE ATT&CK 매핑

| 공격 전술 (Tactic) | 공격 기법 (Technique) |
| --- | --- |
| Initial Access | Brute Force (T1110) |
| Discovery & Collection | Exploitation of Remote Services (T1210) |
| Execution & Credential Access | User Execution: Malicious File (T1204.002), Input Capture (T1056) |
| Defense Evasion & Credential Access | Hijack Web Session Cookie (T1557.003) |
| Privilege Escalation & Collection | SQL Injection (T1505.001), Data from Information Repositories (T1213) |
| Persistence & Command and Control | Upload Malicious File (T1105), Web Shell (T1505.003), Create Account (T1136), Modify System Configuration (T1112) |

---

# 공격 흐름 다이어그램

```

[Brute-force 로그인 성공]
        ↓
[IDOR 취약점 이용 사용자 정보 수집]
        ↓
[게시판에 Stored XSS 삽입]
        ↓
[관리자 세션 쿠키 탈취 및 세션 하이재킹]
        ↓
[SQL Injection/NoSQL Injection 통해 데이터베이스 장악]
        ↓
[파일 업로드 기능 이용 웹쉘 업로드]
        ↓
[웹쉘 통해 신규 계정 생성 및 서버 백도어 설치]

```

---

# 요약

> 공격자는 Brute-force를 통한 초기 접근을 시작으로, IDOR로 정보를 수집하고, Stored XSS로 세션을 탈취한 뒤, 세션 하이재킹으로 관리자 권한을 획득하였다. 이후 SQL Injection/NoSQL Injection을 통해 데이터베이스를 장악하고, 웹쉘 업로드 및 백도어 설치로 서버에 대한 지속적인 접근 권한을 확보했다.
>




![image](https://github.com/user-attachments/assets/c4929292-5d34-496a-84d0-656059ae4519)




