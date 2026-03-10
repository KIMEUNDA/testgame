import { useState } from 'react';

// --- [이미지 import] 경로와 대소문자를 엄격히 준수합니다 ---
import bgImg from './assets/bg-img.jpg';
import dog1 from './assets/dog1.png';
import dog2 from './assets/dog2.png'; 
import gameBg from './assets/home.jpg'; // 혹은 home.JPG (너의 파일명에 맞춰줘멍!)
import charNormal from './assets/character-normal.png'; 
import charHappy from './assets/character-happy.png';   
import imgF from './assets/so.png';         
import resBad from './assets/angry.png';      
import resNormal from './assets/so.png';   
import resGood from './assets/good.png';      

// --- 데이터 타입 ---
interface Option { text: string; score: number; }
interface Question { id: number; question: string; options: Option[]; comment: string; }

// --- 퀴즈 데이터 ---
const fullQuizData: Question[] = [
  { id: 1, question: "동일한 테스트 케이스로 반복 테스트하면 더 이상 버그를 못 찾는다멍! 이 현상은?", options: [{ text: "살충제 패러독스", score: 20 }, { text: "오류-부재의 궤변", score: -10 }], comment: "정답! 계속 새로운 테스트 케이스를 만들어야 한다멍!" },
  { id: 2, question: "프로토콜의 기본 3요소는 구문(Syntax), 의미(Semantics), 그리고 하나는 뭐냐멍?", options: [{ text: "시간(Timing)", score: 20 }, { text: "처리량(Throughput)", score: -10 }], comment: "딩동댕! 구의시(구문, 의미, 시간)라고 외워라멍!" },
  { id: 3, question: "Ajax에서 많이 쓰이고 XML을 대체하는 주요 데이터 포맷은 무엇일까멍?", options: [{ text: "JSON", score: 20 }, { text: "SGML", score: -10 }], comment: "빙고! 자바스크립트 객체 기반의 JSON이다멍!" },
  { id: 4, question: "트랜잭션 특징 중 원자성, 일관성, 지속성 말고 남은 하나는?", options: [{ text: "독립성(Isolation)", score: 20 }, { text: "무결성(Integrity)", score: -5 }], comment: "정답! ACID 특징 중 하나인 독립성이다멍!" },
  { id: 5, question: "출발지와 목적지 주소를 동일하게 해서 공격하는 DoS 공격 기법은?", options: [{ text: "랜드 어택(Land Attack)", score: 20 }, { text: "스머핑(Smurfing)", score: -10 }], comment: "와우! 땅(Land)에 발 묶이는 랜드 어택이다멍!" },
  { id: 6, question: "128비트 암호화 해시 함수로 MD4를 대체하기 위해 고안된 것은?", options: [{ text: "MD5", score: 20 }, { text: "SHA-256", score: -5 }], comment: "정답! 무결성 검사에 쓰이는 MD5다멍!" },
  { id: 7, question: "모듈 내 구성 요소들이 얼마나 밀접하게 관련되어 있는지를 나타내는 척도는?", options: [{ text: "응집도(Cohesion)", score: 20 }, { text: "결합도(Coupling)", score: -10 }], comment: "정답! 응집도는 높을수록 좋다멍!" },
  { id: 8, question: "OSI 7계층 중 비트(Bit)를 전송하는 가장 낮은 계층은 무엇일까멍?", options: [{ text: "물리 계층", score: 20 }, { text: "데이터 링크 계층", score: -10 }], comment: "기초가 탄탄하구나! 1계층인 물리 계층이다멍!" },
  { id: 9, question: "성능 측정 지표 중, 요구 입력 후 결과 출력이 완료될 때까지의 시간은?", options: [{ text: "경과 시간", score: 20 }, { text: "응답 시간", score: -10 }], comment: "딩동댕! 헷갈리지 않고 잘 맞췄다멍!" },
  { id: 10, question: "성능 향상을 위해 정규화된 모델을 중복, 통합, 분리하는 기법은?", options: [{ text: "비정규화", score: 20 }, { text: "이상 현상", score: -10 }], comment: "정답! 역정규화라고도 부른다멍!" },
  { id: 11, question: "비상사태 후 정상 가동될 때까지 걸리는 시간(목표 시간)을 뜻하는 용어는?", options: [{ text: "RTO", score: 20 }, { text: "RPO", score: -10 }], comment: "정답! Recovery Time Objective다멍!" },
  { id: 12, question: "페이지 전체를 새로 고치지 않고 일부분만 데이터를 로드하는 비동기 기술은?", options: [{ text: "AJAX", score: 20 }, { text: "JSON", score: -5 }], comment: "딩동댕! XML과 자바스크립트를 활용한 AJAX다멍!" },
  { id: 13, question: "사람 중심의 유연하고 신속한 적응적 경량 개발 방법론은 무엇일까멍?", options: [{ text: "애자일(Agile)", score: 20 }, { text: "워터폴", score: -10 }], comment: "정답! 변화에 빠른 애자일 방식이다멍!" },
  { id: 14, question: "오류 발생 시 특정 시점(Savepoint) 상태로 되돌리는 제어어 명령은?", options: [{ text: "Rollback", score: 20 }, { text: "Commit", score: -10 }], comment: "완벽해! 다시 되돌리는 건 롤백이다멍!" },
  { id: 15, question: "IP 계층에서 보안성을 제공하기 위해 표준화된 기술(프로토콜)은?", options: [{ text: "IPSec", score: 20 }, { text: "SSL/TLS", score: -5 }], comment: "빙고! 네트워크 계층 보안은 IPSec이다멍!" },
  { id: 16, question: "소스 코드를 실행하지 않고 코딩 표준이나 결함을 발견하는 도구는?", options: [{ text: "정적 분석 도구", score: 20 }, { text: "동적 분석 도구", score: -10 }], comment: "정답! 실행 없이 검사하는 건 정적 분석이다멍!" },
  { id: 17, question: "한 객체의 상태가 바뀌면 의존하는 다른 객체들에 자동 갱신되는 패턴은?", options: [{ text: "Observer Pattern", score: 20 }, { text: "Factory Pattern", score: -10 }], comment: "와우! 일대다 의존성의 옵저버 패턴이다멍!" },
  { id: 18, question: "리눅스 기반 모바일 OS로 구글에서 개발한 소프트웨어 스택은?", options: [{ text: "안드로이드", score: 20 }, { text: "iOS", score: -10 }], comment: "기초지! 자바/코틀린을 쓰는 안드로이드다멍!" },
  { id: 19, question: "XML 기반 데이터를 주고받는 통신 프로토콜로 HTTP 기반인 것은?", options: [{ text: "SOAP", score: 20 }, { text: "REST", score: -5 }], comment: "정답! 단순 객체 접근 프로토콜인 SOAP이다멍!" },
  { id: 20, question: "보안 취약점을 이용해 악의적인 SQL 구문을 삽입하여 정보를 탈취하는 기법은?", options: [{ text: "SQL Injection", score: 20 }, { text: "XSS", score: -10 }], comment: "정답! DB를 직접 공격하는 SQL 인젝션이다멍!" },
  { id: 21, question: "UI 설계 원칙 중 사용자의 목적을 정확하게 달성해야 하는 원칙은?", options: [{ text: "유효성", score: 20 }, { text: "직관성", score: -5 }], comment: "정답! 정확한 목표 달성은 유효성이다멍!" },
  { id: 22, question: "데이터 모델링 절차로 옳은 순서는?", options: [{ text: "개념-논리-물리", score: 20 }, { text: "물리-개념-논리", score: -10 }], comment: "딩동댕! 개-논-물 순서로 외워라멍!" },
  { id: 23, question: "소프트웨어 개발 과정에서 변경 사항을 관리하는 기법은?", options: [{ text: "형상 관리", score: 20 }, { text: "품질 관리", score: -5 }], comment: "빙고! 버전 관리도 형상 관리의 일부다멍!" },
  { id: 27, question: "네트워크에서 오류 발생 시 수신측에 오류 정보를 전달하는 프로토콜은?", options: [{ text: "ICMP", score: 20 }, { text: "IGMP", score: -5 }], comment: "완벽해! 에코 요청과 응답도 ICMP의 역할이다멍!" },
  { id: 28, question: "식별자 표기 시 접두어에 자료형(int, str 등)을 붙이는 표기법은?", options: [{ text: "헝가리안 표기법", score: 20 }, { text: "카멜 표기법", score: -10 }], comment: "딩동댕! 헝가리안은 요즘은 잘 안 쓰지만 중요하다멍!" },
  { id: 29, question: "사용자의 요구사항(명세)을 기반으로 수행하는 결함 발견 테스트 기법은?", options: [{ text: "블랙박스 테스트", score: 20 }, { text: "화이트박스 테스트", score: -10 }], comment: "정답! 기능이 잘 작동하는지만 보는 거다멍!" },
  { id: 30, question: "데이터베이스의 구조, 제약조건 등에 대한 정보를 담은 기본 구조는?", options: [{ text: "스키마(Schema)", score: 20 }, { text: "도메인", score: -5 }], comment: "정답! 외부, 개념, 내부 스키마 3단계가 있다멍!" },
  { id: 31, question: "기업 내 애플리케이션들을 통합하는 EAI의 유형 중 1:1 방식은 무엇일까멍?", options: [{ text: "포인트 투 포인트", score: 20 }, { text: "허브 앤 스포크", score: -10 }], comment: "빙고! 가장 단순한 형태의 통합 방식이다멍!" },
  { id: 32, question: "차세대 인터넷 프로토콜로 128비트 주소 체계를 가지는 것은 무엇일까멍?", options: [{ text: "IPv6", score: 20 }, { text: "IPv4", score: -10 }], comment: "정답! 128비트니까 넉넉하게 쓸 수 있다멍!" },
  { id: 33, question: "디자인 패턴의 목적에 따른 유형 3가지는 생성, 구조, 그리고 무엇일까멍?", options: [{ text: "행위", score: 20 }, { text: "연산", score: -5 }], comment: "정답! 상호작용을 정의하는 행위 패턴이다멍!" },
  { id: 34, question: "회복 기법 중 트랜잭션 수행 결과를 즉시 DB에 반영하는 기법은 무엇일까멍?", options: [{ text: "즉각 갱신 기법", score: 20 }, { text: "지연 갱신 기법", score: -10 }], comment: "정답! 장애 발생 시 로그를 보고 복구한다멍!" },
  { id: 35, question: "패킷을 수집하여 ID, PW 같은 중요한 정보를 가로채는 공격 기법은?", options: [{ text: "스니핑(Sniffing)", score: 20 }, { text: "스푸핑(Spoofing)", score: -10 }], comment: "정답! 킁킁거리며 정보를 훔치는 스니핑이다멍!" },
  { id: 36, question: "공인 IP 주소를 사설 IP 주소로 변환하여 사용하는 기술은 무엇일까멍?", options: [{ text: "NAT", score: 20 }, { text: "DHCP", score: -5 }], comment: "정답! IP 부족 문제를 해결하는 핵심 기술이다멍!" },
  { id: 37, question: "분산 컴퓨팅 기반으로 블록들을 연결하여 위변조를 방지하는 기술은?", options: [{ text: "블록체인", score: 20 }, { text: "빅데이터", score: -5 }], comment: "정답! 누구나 열람 가능하지만 수정은 어렵다멍!" },
  { id: 38, question: "데이터베이스에서 불필요한 중복으로 발생하는 삽입, 삭제, 갱신 문제는?", options: [{ text: "이상 현상", score: 20 }, { text: "고립성", score: -5 }], comment: "정답! 정규화를 통해 해결할 수 있다멍!" },
  { id: 39, question: "벨 연구소에서 만든 시분할 운영체제로 90% 이상 C언어로 구현된 것은?", options: [{ text: "유닉스", score: 20 }, { text: "윈도우", score: -10 }], comment: "정답! 이식성과 호환성이 아주 뛰어난 OS다멍!" },
  { id: 40, question: "정당한 권한이 있는 사용자가 서비스를 지속적으로 사용하게 보장하는 특성은?", options: [{ text: "가용성", score: 20 }, { text: "무결성", score: -10 }], comment: "딩동댕! 보안의 3요소(기무가) 중 하나다멍!" },
  { id: 41, question: "MAC 주소를 기반으로 IP 주소를 알아내는 역순 주소 결정 프로토콜은?", options: [{ text: "RARP", score: 20 }, { text: "ARP", score: -10 }], comment: "정답! 반대로 IP로 MAC을 찾는 건 ARP다멍!" },
  { id: 42, question: "DB 설계 단계 중 현실 세계를 추상화하여 E-R 다이어그램을 만드는 단계는?", options: [{ text: "개념적 설계", score: 20 }, { text: "논리적 설계", score: -10 }], comment: "딩동댕! 가장 먼저 추상화하는 단계다멍!" },
  { id: 43, question: "시스템이 제공하는 기능이나 서비스에 대한 요구사항을 무엇이라 할까멍?", options: [{ text: "기능적 요구사항", score: 20 }, { text: "비기능적 요구사항", score: -10 }], comment: "정답! 성능이나 보안은 비기능적 요구사항이다멍!" },
  { id: 44, question: "웹 서비스에 대한 상세 정보가 기술된 XML 형식의 언어는 무엇일까멍?", options: [{ text: "WSDL", score: 20 }, { text: "SOAP", score: -5 }], comment: "정답! 웹 서비스 기술 언어인 WSDL이다멍!" },
  { id: 45, question: "성능 향상을 위해 정규화된 엔티티를 중복, 통합하는 기법은?", options: [{ text: "반정규화", score: 20 }, { text: "정규화", score: -10 }], comment: "딩동댕! 비정규화, 역정규화라고도 부른다멍!" },
  { id: 46, question: "입력 데이터의 영역을 유사한 그룹으로 나눠 검사하는 블랙박스 테스트는?", options: [{ text: "동등 분할 테스트", score: 20 }, { text: "경계값 분석", score: -10 }], comment: "정답! 동치 분할 테스트라고도 한다멍!" },
  { id: 47, question: "개별 모듈이나 서브루틴이 정상적으로 실행되는지 확인하는 테스트는?", options: [{ text: "단위 테스트", score: 20 }, { text: "통합 테스트", score: -10 }], comment: "빙고! 가장 작은 단위부터 검사하는 거다멍!" },
  { id: 48, question: "IPv6 주소 체계의 전체 비트 수는 몇 비트일까멍?", options: [{ text: "128비트", score: 20 }, { text: "64비트", score: -10 }], comment: "정답! IPv4는 32비트다멍!" },
  { id: 49, question: "프로세스 간 데이터를 주고받는 통신 기술을 일컫는 용어는?", options: [{ text: "IPC", score: 20 }, { text: "RPC", score: -5 }], comment: "정답! Inter-Process Communication의 약자다멍!" },
  { id: 50, question: "기업 내 서로 다른 플랫폼 간의 정보를 연계하고 통합하는 솔루션은?", options: [{ text: "EAI", score: 20 }, { text: "FEP", score: -10 }], comment: "완벽해! 포인트 투 포인트, 허브 앤 스포크 방식이 있다멍!" },
  { id: 51, question: "릴레이션에서 행(Row)의 수를 나타내는 용어는 무엇일까멍?", options: [{ text: "카디널리티", score: 20 }, { text: "디그리", score: -10 }], comment: "정답! 열(Column)의 수는 디그리(Degree)다멍!" },
  { id: 52, question: "데이터 모델의 구성 요소 3가지는 연산, 제약조건, 그리고 무엇일까멍?", options: [{ text: "구조", score: 20 }, { text: "관계", score: -5 }], comment: "딩동댕! 연구제(연산, 구조, 제약조건)로 외워라멍!" },
  { id: 53, question: "사용자 신분이나 그룹에 따라 접근을 제한하는 접근 제어 방식은?", options: [{ text: "임의적 접근 통제", score: 20 }, { text: "강제적 접근 통제", score: -10 }], comment: "정답! DAC(Discretionary Access Control)라고도 한다멍!" },
  { id: 54, question: "모듈 간 전역 변수를 참조하고 갱신하며 상호작용하는 결함도는?", options: [{ text: "공통 결합도", score: 20 }, { text: "내용 결합도", score: -10 }], comment: "빙고! 전역 변수를 공유하면 공통 결합도다멍!" },
  { id: 55, question: "정상적인 세션을 가로채서 연결을 취득하는 공격 기법은 무엇일까멍?", options: [{ text: "세션 하이재킹", score: 20 }, { text: "스니핑", score: -10 }], comment: "정답! 세션을 납치하는 무서운 공격이다멍!" },
  { id: 56, question: "사용자의 숙련도에 따라 힌트를 제공하거나 단축키를 지원하는 UI 설계 원칙은?", options: [{ text: "유연성", score: 20 }, { text: "학습성", score: -10 }], comment: "정답! 초보와 숙련자 모두 배려하는 유연성이다멍!" },
  { id: 57, question: "공격자가 자신의 IP 주소를 변조하여 속이는 공격 기법은?", options: [{ text: "스푸핑(Spoofing)", score: 20 }, { text: "스니핑", score: -10 }], comment: "빙고! 가짜 신분으로 속이는 걸 스푸핑이라 한다멍!" },
  { id: 58, question: "한 릴레이션 내의 모든 튜플들은 서로 다른 값을 가져야 한다는 제약조건은?", options: [{ text: "유일성", score: 20 }, { text: "최소성", score: -5 }], comment: "정답! 튜플을 구별할 수 있어야 한다멍!" },
  { id: 59, question: "객체지향 설계 원칙 중 자식 클래스는 부모 클래스의 기능을 수행할 수 있어야 한다는 것은?", options: [{ text: "리스코프 치환 원칙", score: 20 }, { text: "단일 책임 원칙", score: -10 }], comment: "정답! LSP 원칙이라고도 한다멍!" },
  { id: 60, question: "데이터의 보안, 무결성 유지, 병행 제어 등을 정의하는 언어(DCL)의 명령은?", options: [{ text: "GRANT / REVOKE", score: 20 }, { text: "SELECT / INSERT", score: -10 }], comment: "정답! 권한을 주고 뺏는 제어어다멍!" },
  { id: 61, question: "네트워크 계층의 프로토콜로 호스트 그룹의 멤버십을 관리하는 것은?", options: [{ text: "IGMP", score: 20 }, { text: "ICMP", score: -5 }], comment: "완벽해! 멀티캐스트를 위한 프로토콜이다멍!" },
  { id: 62, question: "테스트 목적에 따른 분류 중, 변경된 코드에 영향이 없는지 확인하는 반복 테스트는?", options: [{ text: "회귀 테스트", score: 20 }, { text: "회복 테스트", score: -10 }], comment: "정답! 다시(Regress) 돌아가서 확인한다멍!" },
  { id: 63, question: "여러 개의 독립된 통신 장치가 블루투스 기술을 사용하여 형성하는 무선 네트워크는?", options: [{ text: "피코넷(Piconet)", score: 20 }, { text: "인트라넷", score: -10 }], comment: "딩동댕! 블루투스 기기들이 모인 망이다멍!" },
  { id: 64, question: "트랜잭션이 성공적으로 완료되었음을 선언하고 DB에 반영하는 명령은?", options: [{ text: "Commit", score: 20 }, { text: "Rollback", score: -10 }], comment: "정답! 확정 짓는 건 커밋이다멍!" },
  { id: 65, question: "화이트박스 테스트 기법 중, 소스 코드의 모든 구문이 최소 한 번은 실행되게 하는 것은?", options: [{ text: "구문 커버리지", score: 20 }, { text: "결정 커버리지", score: -5 }], comment: "정답! 문장 검증 기준이라고도 한다멍!" },
  { id: 66, question: "응용 프로그램 간 데이터를 교환하기 위해 사용하는 공개 표준 인터페이스는?", options: [{ text: "API", score: 20 }, { text: "GUI", score: -10 }], comment: "기본이지! 소프트웨어 연결 창구인 API다멍!" },
  { id: 67, question: "한 릴레이션의 기본키를 참조하는 다른 릴레이션의 속성을 무엇이라 할까멍?", options: [{ text: "외래키(Foreign Key)", score: 20 }, { text: "슈퍼키", score: -5 }], comment: "정답! 테이블 간 관계를 맺어주는 키다멍!" },
  { id: 68, question: "프로토콜 스택 중 전송 계층(Transport)에 해당하는 프로토콜은?", options: [{ text: "TCP / UDP", score: 20 }, { text: "IP / ARP", score: -10 }], comment: "딩동댕! 데이터 전송 방식인 TCP와 UDP다멍!" },
  { id: 69, question: "요구사항 분석에서 우선순위를 결정하는 핵심 요소가 아닌 것은?", options: [{ text: "개발자의 기호", score: 20 }, { text: "비용 및 시간", score: -5 }], comment: "정답! 개발자 맘대로 정하면 안 된다멍!" },
  { id: 70, question: "시스템의 물리적 형상을 정의하고 하드웨어와 소프트웨어의 구성 요소를 설명하는 것은?", options: [{ text: "아키텍처", score: 20 }, { text: "알고리즘", score: -10 }], comment: "정답! 시스템의 전체 구조인 아키텍처다멍!" },
  { id: 71, question: "릴레이션 스키마를 정규화하여 중복을 제거하는 과정 중 1NF에서 2NF가 되는 기준은?", options: [{ text: "부분 함수 종속 제거", score: 20 }, { text: "이행 함수 종속 제거", score: -10 }], comment: "정답! 완전 함수 종속을 만드는 과정이다멍!" },
  { id: 72, question: "소프트웨어 패키징 도구 중, 불법 복제를 방지하기 위한 디지털 저작권 관리 기술은?", options: [{ text: "DRM", score: 20 }, { text: "CMS", score: -5 }], comment: "정답! 유료 콘텐츠 보안에 필수적인 DRM이다멍!" },
  { id: 73, question: "모듈의 독립성을 높이기 위해 결합도는 낮추고, 이것은 높여야 한다멍! 이것은?", options: [{ text: "응집도", score: 20 }, { text: "가독성", score: -5 }], comment: "딩동댕! 내부 관계가 끈끈해야 한다멍!" },
  { id: 74, question: "애플리케이션 성능 테스트 지표 중, 단위 시간당 처리할 수 있는 일의 양은?", options: [{ text: "처리량(Throughput)", score: 20 }, { text: "응답 시간", score: -10 }], comment: "정답! 속도보다는 양에 집중하는 지표다멍!" },
  { id: 75, question: "인터넷상의 모든 기기가 고유한 IP를 가져야 한다는 원칙을 깨고 IP를 공유하는 기술은?", options: [{ text: "NAT", score: 20 }, { text: "DNS", score: -5 }], comment: "정답! 사설 IP를 공인 IP로 바꿔주는 NAT다멍!" },
  { id: 76, question: "데이터 저장 시 해시 충돌을 해결하기 위해 사용하는 방식 중 하나는?", options: [{ text: "체이닝(Chaining)", score: 20 }, { text: "파이프라이닝", score: -10 }], comment: "정답! 연결 리스트로 충돌을 해결한다멍!" },
  { id: 77, question: "사용자의 정보를 가로채기 위해 만든 가짜 웹사이트를 의미하는 용어는?", options: [{ text: "피싱(Phishing)", score: 20 }, { text: "파밍", score: -5 }], comment: "정답! 낚시하듯 정보를 낚아채는 피싱이다멍!" },
  { id: 78, question: "애자일 개발 방법론 중, 5가지 핵심 가치(용기, 존중 등)를 강조하는 방식은?", options: [{ text: "XP(eXtreme Programming)", score: 20 }, { text: "스크럼", score: -5 }], comment: "정답! 의사소통을 중시하는 XP다멍!" },
  { id: 79, question: "서로 다른 네트워크를 연결할 때 최적의 경로를 선택해주는 장비는?", options: [{ text: "라우터(Router)", score: 20 }, { text: "스위치", score: -10 }], comment: "완벽해! 길을 찾아주는 길잡이 라우터다멍!" },
  { id: 80, question: "데이터를 정해진 규칙에 따라 재정리하여 무결성을 보장하는 보안 기술은?", options: [{ text: "암호화", score: 20 }, { text: "압축", score: -10 }], comment: "정답! 읽을 수 없게 만드는 암호화다멍!" },
];

// --- 이론 공부 데이터 ---
const studyData = [
  { title: "🏗️ 디자인 패턴 (생·구·행)", content: "생성(Factory, Singleton), 구조(Adapter, Bridge), 행위(Observer, State)! 각각의 역할을 구분하는 게 핵심이다멍!" },
  { title: "💾 데이터베이스 정규화", content: "1NF(원자값), 2NF(부분함수 종속 제거), 3NF(이행함수 종속 제거)! '도부이결다조' 앞글자를 따서 외워라멍!" },
  { title: "🌐 OSI 7계층", content: "물-데-네-전-세-표-응! 3계층은 라우터(IP), 4계층은 TCP/UDP가 활동하는 영역이다멍!" },
];

// 셔플 함수 (선택지를 무작위로 섞음)
const shuffle = (array: any[]) => {
  return [...array].sort(() => Math.random() - 0.5);
};

export default function App() {
  const [gameState, setGameState] = useState<'title' | 'playing' | 'result' | 'review' | 'study'>('title');
  const [quizSet, setQuizSet] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [showComment, setShowComment] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [wrongAnswers, setWrongAnswers] = useState<Question[]>([]);
  
  // 현재 섞인 선택지를 저장할 상태
  const [shuffledOptions, setShuffledOptions] = useState<Option[]>([]);

  // 게임 시작 로직
  const startNewGame = () => {
    const shuffledQuiz = shuffle(fullQuizData).slice(0, 20); // 20문제 랜덤 추출
    setQuizSet(shuffledQuiz);
    setCurrentIdx(0);
    setTotalScore(0);
    setGameState('playing');
    setShowComment(false);
    
    // 첫 번째 문제 선택지 섞기
    setShuffledOptions(shuffle(shuffledQuiz[0].options));
  };

  // 정답 제출 로직
  const handleAnswer = (score: number) => {
    const correct = score > 0;
    setIsCorrect(correct);
    if (correct) {
      setTotalScore(prev => prev + 5);
    } else {
      const currentQ = quizSet[currentIdx];
      setWrongAnswers(prev => prev.find(q => q.id === currentQ.id) ? prev : [...prev, currentQ]);
    }
    setShowComment(true);
    
    setTimeout(() => {
      if (currentIdx + 1 < quizSet.length) {
        const nextIdx = currentIdx + 1;
        setCurrentIdx(nextIdx);
        // 다음 문제 선택지 미리 섞기
        setShuffledOptions(shuffle(quizSet[nextIdx].options));
        setShowComment(false);
        setIsCorrect(null);
      } else {
        setGameState('result');
      }
    }, 1800);
  };

  // --- 1. 시작 화면 ---
  if (gameState === 'title') {
    return (
      <div className="relative w-screen h-screen overflow-hidden flex flex-col">
        <div className="absolute inset-0 bg-cover bg-center -z-10" style={{ backgroundImage: `url(${bgImg})` }}></div>
        <div className="flex-[5] flex flex-col items-center justify-center z-20 text-white pt-10">
          <h1 className="text-7xl md:text-9xl font-black drop-shadow-2xl italic mb-10 animate-bounce text-center px-4">우겨넣자 정처기!</h1>
          <button onClick={startNewGame} className="bg-pink-500 text-white text-4xl px-20 py-6 rounded-full shadow-[0_12px_0_rgb(190,24,93)] active:translate-y-3 active:shadow-none transition-all font-black mb-6">게임 시작하기 🐾</button>
          <div className="flex gap-4">
            <button onClick={() => setGameState('review')} className="bg-slate-700 text-white text-xl px-8 py-4 rounded-2xl shadow-[0_6px_0_rgb(30,41,59)] active:translate-y-2 active:shadow-none transition-all font-bold">오답 노트</button>
            <button onClick={() => setGameState('study')} className="bg-amber-500 text-white text-xl px-8 py-4 rounded-2xl shadow-[0_6px_0_rgb(180,83,9)] active:translate-y-2 active:shadow-none transition-all font-bold">요약 노트</button>
          </div>
        </div>
        <div className="flex-[5] flex items-end justify-around px-20">
          <img src={dog1} className="h-[45vh] object-contain animate-tilt-left" alt="dog1" />
          <img src={dog2} className="h-[45vh] object-contain animate-tilt-right" alt="dog2" />
        </div>
        <style>{`
          @keyframes tL { 0%, 100% { transform: rotate(0); } 50% { transform: rotate(-30deg); } }
          @keyframes tR { 0%, 100% { transform: rotate(0); } 50% { transform: rotate(30deg); } }
          .animate-tilt-left { animation: tL 0.9s ease-in-out infinite; transform-origin: bottom center; }
          .animate-tilt-right { animation: tR 0.9s ease-in-out infinite 0.1s; transform-origin: bottom center; }
        `}</style>
      </div>
    );
  }

  // --- 2. 오답 노트 페이지 ---
  if (gameState === 'review') {
    return (
      <div className="w-screen h-screen bg-slate-100 p-8 overflow-y-auto flex flex-col items-center">
        <h2 className="text-4xl font-black text-slate-800 mb-8 text-center">오답노트</h2>
        <div className="w-full max-w-4xl flex-grow">
          {wrongAnswers.length === 0 ? (
            <p className="text-center text-2xl font-bold text-slate-400 mt-20">공부하고 시험보고 각오하고 와</p>
          ) : (
            wrongAnswers.map(q => (
              <div key={q.id} className="bg-white p-6 rounded-3xl shadow-md border-l-8 border-red-400 mb-4">
                <p className="text-xl font-bold mb-2">Q. {q.question}</p>
                <p className="text-pink-600 font-bold italic">💡 {q.comment}</p>
              </div>
            ))
          )}
        </div>
        <button onClick={() => setGameState('title')} className="mt-10 mb-10 bg-slate-800 text-white px-12 py-5 rounded-full text-2xl font-black hover:bg-pink-500 transition-all shadow-lg active:scale-95">🏠 메인 화면으로 돌아가기</button>
      </div>
    );
  }

  // --- 3. 이론 공부 페이지 ---
  if (gameState === 'study') {
    return (
      <div className="w-screen h-screen bg-amber-50 p-8 overflow-y-auto flex flex-col items-center">
        <h2 className="text-4xl font-black text-amber-900 mb-8 text-center">요약노트</h2>
        <div className="w-full max-w-4xl flex-grow space-y-6">
          {studyData.map((item, idx) => (
            <div key={idx} className="bg-white p-8 rounded-[2.5rem] shadow-xl border-2 border-amber-200">
              <h3 className="text-2xl font-black text-amber-600 mb-4">{item.title}</h3>
              <p className="text-xl leading-relaxed text-slate-700">{item.content}</p>
            </div>
          ))}
        </div>
        <button onClick={() => setGameState('title')} className="mt-10 mb-10 bg-amber-700 text-white px-12 py-5 rounded-full text-2xl font-black hover:bg-pink-600 transition-all shadow-lg active:scale-95">다 외웠으면 시험 볼까?</button>
      </div>
    );
  }

  // --- 4. 게임 중 화면 ---
  if (gameState === 'playing' && quizSet.length > 0) {
    const q = quizSet[currentIdx];
    return (
      <div className="relative w-screen h-screen flex flex-col items-center bg-cover bg-center" style={{ backgroundImage: `url(${gameBg})` }}>
        <div className="w-full max-w-4xl px-6 pt-10 flex justify-between items-center text-white font-black text-2xl drop-shadow-md">
          <div className="bg-black/40 px-6 py-2 rounded-full border-2 border-white/50">Q {currentIdx + 1} / 20</div>
          <div className="bg-pink-500 px-6 py-2 rounded-full border-2 border-white shadow-lg">💕 {totalScore}점</div>
        </div>
        
        <div className="w-[90%] max-w-4xl mt-6 bg-white/90 rounded-[3rem] p-8 md:p-12 shadow-2xl border-[6px] border-pink-200 relative">
          <h2 className="text-2xl md:text-4xl font-black text-slate-800 text-center leading-snug">
            {showComment ? (isCorrect ? "⭕ 정답이다멍!" : "❌ 틀렸다멍!") : `"${q.question}"`}
          </h2>
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[30px] border-t-pink-200"></div>
        </div>

        <div className="flex-grow flex items-center justify-center relative w-full">
          {showComment && !isCorrect && <img src={imgF} className="absolute z-30 w-48 md:w-64 animate-ping" alt="F" />}
          <img 
            src={showComment && isCorrect ? charHappy : charNormal} 
            className="h-[35vh] md:h-[45vh] object-contain transition-all duration-300 transform scale-110 drop-shadow-2xl" 
            alt="character" 
          />
        </div>

        <div className="w-full max-w-4xl px-6 pb-12 grid grid-cols-1 gap-4 z-20">
          {showComment ? (
            <div className="bg-black/60 p-8 rounded-3xl text-white text-center text-2xl font-bold animate-pulse border-2 border-white/30">{q.comment}</div>
          ) : (
            shuffledOptions.map((opt, i) => (
              <button key={i} onClick={() => handleAnswer(opt.score)} className="bg-white hover:bg-pink-100 text-slate-800 text-2xl md:text-3xl font-black py-6 rounded-2xl shadow-[0_8px_0_#ddd] active:translate-y-2 active:shadow-none transition-all border-2 border-slate-200">
                {opt.text}
              </button>
            ))
          )}
        </div>

        <button 
          onClick={() => { if(window.confirm("태초마을로 갈래?")) setGameState('title'); }}
          className="absolute bottom-6 left-6 w-16 h-16 bg-slate-800/80 hover:bg-slate-800 text-white rounded-full flex items-center justify-center text-3xl shadow-lg transition-all active:scale-90 z-30 border-2 border-white/30"
        >
          🏠
        </button>
      </div>
    );
  }

  // --- 5. 최종 결과 화면 ---
  const result = (totalScore >= 80) 
    ? { img: resGood, txt: "눈아 이제 코딩 공부해도 돼\n나 간식사줘", col: "text-pink-600" }
    : (totalScore >= 60) 
    ? { img: resNormal, txt: "공부 더 해\n구름이랑 같이 안 살거야?", col: "text-blue-600" }
    : { img: resBad, txt: "누나. 공부 좀 해\n누나가 구름이 대신 집 지키려고?", col: "text-gray-600" };

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center p-6 bg-pink-50 overflow-y-auto">
      <div className="bg-white p-12 rounded-[4rem] shadow-2xl text-center max-w-2xl border-[12px] border-white my-10">
        <h2 className="text-4xl font-black mb-6 italic text-slate-800">성적표 발표다멍!</h2>
        <img src={result.img} className="w-72 h-72 mx-auto object-cover rounded-3xl mb-6 shadow-lg" alt="result" />
        <div className={`text-9xl font-black mb-6 ${result.col}`}>{totalScore}<span className="text-4xl">점</span></div>
        <p className="text-3xl font-black text-slate-800 mb-10 whitespace-pre-wrap">{result.txt}</p>
        <button onClick={() => setGameState('title')} className="bg-slate-800 text-white px-16 py-6 rounded-full text-2xl font-black hover:bg-pink-600 transition-colors">🏠 메인으로 가기</button>
      </div>
    </div>
  );
}