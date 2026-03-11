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
type GameMode = 'Normal' | 'Short' | 'Code' | 'Mixed' | null;
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
  { id: 81, question: "데이터베이스에서 테이블의 열(Column) 개수를 의미하는 용어는?", options: [{ text: "디그리(Degree)", score: 20 }, { text: "카디널리티", score: -10 }], comment: "정답! 차수(Degree)라고도 한다멍!" },
  { id: 82, question: "애플리케이션 테스트에서 살충제 패러독스를 방지하기 위한 전략은?", options: [{ text: "테스트 케이스의 정기적 개선", score: 20 }, { text: "동일 테스트 반복 수행", score: -10 }], comment: "정답! 케이스를 계속 업데이트해야 버그를 잡는다멍!" },
  { id: 83, question: "네트워크 주소 변환 기술로, 한 개의 공인 IP로 여러 사설 IP를 사용하는 것은?", options: [{ text: "NAPT (PAT)", score: 20 }, { text: "DHCP", score: -5 }], comment: "정답! Port까지 활용해서 나눠 쓰는 방식이다멍!" },
  { id: 84, question: "객체지향 원칙 중 추상화된 것은 구체적인 것에 의존하면 안 된다는 원칙은?", options: [{ text: "의존 역전 원칙(DIP)", score: 20 }, { text: "인터페이스 분리 원칙", score: -10 }], comment: "정답! SOLID 원칙 중 DIP다멍!" },
  { id: 85, question: "파이썬에서 리스트에 요소를 마지막에 추가하는 함수는?", options: [{ text: "append()", score: 20 }, { text: "add()", score: -5 }], comment: "정답! 파이썬 기초지만 실기에 자주 나온다멍!" },
  { id: 86, question: "소프트웨어 테스트에서 오류의 80%는 전체 모듈의 20% 내에서 발생한다는 법칙은?", options: [{ text: "파레토 법칙", score: 20 }, { text: "브룩스의 법칙", score: -10 }], comment: "정답! 결함 집중(Defect Clustering) 원리다멍!" },
  { id: 87, question: "데이터베이스 회복 기법 중 로그를 이용하여 재실행하는 연산은?", options: [{ text: "REDO", score: 20 }, { text: "UNDO", score: -10 }], comment: "정답! 다시 실행하는 건 REDO다멍!" },
  { id: 88, question: "화이트박스 테스트 중 모든 조건문의 참/거짓 결과가 한 번 이상 실행되게 하는 것은?", options: [{ text: "조건 커버리지", score: 20 }, { text: "결정 커버리지", score: -5 }], comment: "정답! 개별 조건식의 결과를 다 보는 거다멍!" },
  { id: 89, question: "서로 다른 네트워크를 연결할 때 최적의 경로를 설정하는 장비는?", options: [{ text: "라우터", score: 20 }, { text: "브릿지", score: -10 }], comment: "딩동댕! 3계층 장비 라우터다멍!" },
  { id: 90, question: "JSON과 유사하지만 더 적은 용량으로 이진 데이터를 전송하는 포맷은?", options: [{ text: "BSON", score: 20 }, { text: "YAML", score: -5 }], comment: "정답! Binary JSON의 약자다멍!" },
  { id: 91, question: "트랜잭션이 데이터베이스에 영구적으로 반영되는 상태를 일컫는 말은?", options: [{ text: "Durability (지속성)", score: 20 }, { text: "Consistency", score: -10 }], comment: "정답! ACID 특징 중 하나다멍!" },
  { id: 92, question: "자바에서 부모 클래스의 메서드를 자식 클래스에서 재정의하는 것은?", options: [{ text: "오버라이딩(Overriding)", score: 20 }, { text: "오버로딩", score: -10 }], comment: "정답! 덮어쓰기는 라이딩이다멍!" },
  { id: 93, question: "가상 사설망(VPN)에서 데이터를 안전하게 전송하기 위해 사용하는 기술은?", options: [{ text: "터널링(Tunneling)", score: 20 }, { text: "미러링", score: -10 }], comment: "정답! 전용 통로를 만드는 터널링이다멍!" },
  { id: 94, question: "사용자 인터페이스(UI) 설계에서 누구나 쉽게 이해하고 사용할 수 있어야 하는 원칙은?", options: [{ text: "직관성", score: 20 }, { text: "유효성", score: -5 }], comment: "정답! 보자마자 아는 게 직관성이다멍!" },
  { id: 95, question: "데이터 모델의 3요소는 구조(Structure), 연산(Operation) 그리고?", options: [{ text: "제약 조건(Constraint)", score: 20 }, { text: "관계", score: -5 }], comment: "정답! 구연제! 꼭 외워라멍!" },
  { id: 96, question: "여러 개의 프로세스가 공유 자원을 점유하려 할 때 발생하는 현상은?", options: [{ text: "경쟁 상태(Race Condition)", score: 20 }, { text: "교착 상태", score: -10 }], comment: "정답! 실행 순서에 따라 결과가 달라지는 위험한 상태다멍!" },
  { id: 97, question: "릴레이션에서 튜플(Tuple)의 개수를 의미하는 용어는?", options: [{ text: "카디널리티(Cardinality)", score: 20 }, { text: "디그리", score: -10 }], comment: "정답! 행의 수는 카디널리티다멍!" },
  { id: 98, question: "C언어에서 메모리를 동적으로 할당할 때 사용하는 함수는?", options: [{ text: "malloc()", score: 20 }, { text: "free()", score: -5 }], comment: "정답! Memory Allocation의 약자다멍!" },
  { id: 99, question: "애플리케이션의 성능을 측정하는 지표 중 시스템에 걸리는 부하를 의미하는 것은?", options: [{ text: "자원 사용률", score: 20 }, { text: "처리량", score: -10 }], comment: "정답! CPU, 메모리 등의 사용 정도다멍!" },
  { id: 100, question: "소프트웨어 개발 보안 3요소 중 인가된 사용자만 정보에 접근할 수 있게 하는 것은?", options: [{ text: "기밀성(Confidentiality)", score: 20 }, { text: "가용성", score: -10 }], comment: "정답! 보안의 핵심 기무가(기밀성, 무결성, 가용성)다멍!" },
  { id: 101, question: "Java의 싱글톤 패턴 코드에서 인스턴스가 없을 때만 생성하여 하나의 객체만 유지하는 메서드 방식은?", options: [{ text: "Connection.get()", score: 20 }, { text: "new Connection()", score: -10 }], comment: "정답! _inst가 null일 때만 새로 만드는 방식이다멍!" },
  { id: 102, question: "보안 AAA 체계 중 '검증된 사용자에게 어떤 수준의 권한과 서비스를 허용하는가'에 해당하는 것은?", options: [{ text: "Authorization (인가)", score: 20 }, { text: "Authentication (인증)", score: -10 }], comment: "정답! 권한을 주는 건 Authorization이다멍!" },
  { id: 103, question: "SQL에서 사용자에게 접속 권한이나 오브젝트 생성 권한을 부여하는 명령어는?", options: [{ text: "GRANT", score: 20 }, { text: "REVOKE", score: -10 }], comment: "정답! 권한 부여는 GRANT, 회수는 REVOKE다멍!" },
  { id: 104, question: "ARP 메시지를 이용해 상대방의 패킷을 가로채는 중간자 공격 기법은?", options: [{ text: "ARP 스푸핑", score: 20 }, { text: "IP 스니핑", score: -5 }], comment: "정답! 주소 결정 프로토콜의 약점을 노린 공격이다멍!" },
  { id: 105, question: "모듈이 다른 모듈의 내부 논리를 제어하기 위해 제어 신호를 사용하는 결합도는?", options: [{ text: "제어 결합도(Control)", score: 20 }, { text: "자료 결합도", score: -10 }], comment: "정답! 권리 전도 현상이 발생할 수 있다멍!" },
  { id: 106, question: "OSI 7계층 중 데이터의 인코딩/디코딩 및 압축을 담당하는 계층은?", options: [{ text: "표현 계층 (Presentation)", score: 20 }, { text: "세션 계층", score: -10 }], comment: "정답! 데이터의 형식을 정의하는 6계층이다멍!" },
  { id: 107, question: "UML 관계 중 클래스들 사이의 '전체 또는 부분' 관계를 나타내는 것은?", options: [{ text: "집약 관계 (Aggregation)", score: 20 }, { text: "일반화 관계", score: -10 }], comment: "정답! 마름모 기호로 표시하는 관계다멍!" },
  { id: 108, question: "테스트 케이스 구성 요소 중 특정 값을 입력하기 위해 준비된 데이터 세트는?", options: [{ text: "테스트 데이터", score: 20 }, { text: "테스트 조건", score: -5 }], comment: "정답! 실행에 필요한 실제 값을 말한다멍!" },
  { id: 109, question: "입력과 결과 간의 논리적 관계를 AND, OR, NOT 등의 연산자로 표현하는 테스트 기법은?", options: [{ text: "원인-결과 그래프", score: 20 }, { text: "동등 분할", score: -10 }], comment: "정답! 블랙박스 테스트 기법의 하나다멍!" },
  { id: 110, question: "미국 표준(NIST) 대칭키 암호 알고리즘으로, 키 길이가 실질적으로 56비트인 것은?", options: [{ text: "DES", score: 20 }, { text: "AES", score: -5 }], comment: "정답! 64비트 블록 암호인 DES다멍!" },
  { id: 111, question: "네트워크 계층(3계층)의 대표적인 장비로 경로를 선택해 패킷을 전달하는 것은?", options: [{ text: "라우터", score: 20 }, { text: "스위치", score: -10 }], comment: "정답! IP 주소를 기반으로 동작한다멍!" },
  { id: 112, question: "결합도(Coupling) 단계 중 가장 독립성이 높고 좋은 결합도는?", options: [{ text: "자료 결합도 (Data)", score: 20 }, { text: "내용 결합도", score: -10 }], comment: "정답! 결합도가 낮을수록 독립성이 높다멍!" },
  { id: 113, question: "OSI 7계층 중 물리계층의 오류와 흐름을 관리하며 MAC 주소를 사용하는 계층은?", options: [{ text: "데이터 링크 계층", score: 20 }, { text: "네트워크 계층", score: -5 }], comment: "정답! 2계층 장비는 브릿지나 스위치가 있다멍!" },
  { id: 114, question: "UML에서 상속 관계(IS-A)를 모델링할 때 사용하는 용어는?", options: [{ text: "일반화 (Generalization)", score: 20 }, { text: "실체화", score: -10 }], comment: "정답! 공통된 특징을 상위 클래스로 묶는 거다멍!" },
  { id: 115, question: "소프트웨어 테스트 기법 중 내부 구조를 보지 않고 요구사항 명세만 확인하는 방식은?", options: [{ text: "블랙박스 테스트", score: 20 }, { text: "화이트박스 테스트", score: -10 }], comment: "정답! 명세 기반 테스트라고도 한다멍!" },
  { id: 116, question: "데이터베이스에서 트랜잭션의 상태 중 모든 연산이 성공적으로 수행된 상태는?", options: [{ text: "Commit", score: 20 }, { text: "Rollback", score: -10 }], comment: "정답! 확정 짓는다는 의미다멍!" },
  { id: 117, question: "시스템을 구성하는 클래스들 사이의 정적인 관계를 표현하는 UML 다이어그램은?", options: [{ text: "클래스 다이어그램", score: 20 }, { text: "유즈 케이스 다이어그램", score: -5 }], comment: "정답! 구조 다이어그램의 대표 주자다멍!" },
  { id: 118, question: "애플리케이션의 동작 과정에서 예상 결과와 실제 결과가 일치하는지 확인하는 명세서는?", options: [{ text: "테스트 케이스", score: 20 }, { text: "요구사항 정의서", score: -10 }], comment: "정답! 설계된 입력값과 조건의 세트다멍!" },
  { id: 119, question: "대칭키 암호화 방식 중 DES의 취약점을 보완하여 만든 128비트 단위의 표준 암호는?", options: [{ text: "AES", score: 20 }, { text: "RSA", score: -10 }], comment: "정답! 현재 가장 널리 쓰이는 대칭키 방식이다멍!" },
  { id: 120, question: "응용 프로그램 간의 통신을 제어하고 대화를 유지 및 관리하는 OSI 계층은?", options: [{ text: "세션 계층 (Session)", score: 20 }, { text: "전송 계층", score: -5 }], comment: "정답! 연결 세션을 관리하는 5계층이다멍!" },
  { id: 121, question: "C언어에서 'a = 10; printf('%d', a++);' 실행 시 출력되는 값은?", options: [{ text: "10", score: 20 }, { text: "11", score: -10 }], comment: "정답! 후위 연산자라 출력 후에 값이 변한다멍!" },
  { id: 122, question: "네트워크 계층에서 IP 패킷을 가로채거나 변조하는 것을 방지하는 보안 프로토콜은?", options: [{ text: "IPSec", score: 20 }, { text: "SSL", score: -10 }], comment: "정답! IP 보안 프로토콜인 IPSec이다멍!" },
  { id: 123, question: "소프트웨어 결함 상태 중, 수정이 완료되어 테스터에게 전달된 상태는?", options: [{ text: "Resolved", score: 20 }, { text: "Assigned", score: -10 }], comment: "정답! 해결되었다는 의미의 Resolved다멍!" },
  { id: 124, question: "파이썬에서 'print('Hello' * 2)' 실행 시 출력 결과는?", options: [{ text: "HelloHello", score: 20 }, { text: "Hello 2", score: -10 }], comment: "정답! 문자열 반복 출력 기능이다멍!" },
  { id: 125, question: "공개키 암호화 알고리즘 중 소인수 분해의 어려움을 이용한 방식은?", options: [{ text: "RSA", score: 20 }, { text: "AES", score: -10 }], comment: "정답! 비대칭키의 대표 주자 RSA다멍!" },
  { id: 126, question: "릴레이션 조작 시 튜플들이 조건에 맞지 않아 삭제되지 않는 현상은?", options: [{ text: "삭제 이상(Deletion Anomaly)", score: 20 }, { text: "갱신 이상", score: -10 }], comment: "정답! 원치 않는 데이터까지 지워지는 현상이다멍!" },
  { id: 127, question: "모듈 내의 모든 요소들이 하나의 단일 기능을 수행할 때의 응집도는?", options: [{ text: "기능적 응집도(Functional)", score: 20 }, { text: "순차적 응집도", score: -10 }], comment: "정답! 가장 높고 좋은 응집도다멍!" },
  { id: 128, question: "사용자가 웹사이트에 자신의 스크립트를 삽입하여 공격하는 기법은?", options: [{ text: "XSS (Cross Site Scripting)", score: 20 }, { text: "CSRF", score: -5 }], comment: "정답! 클라이언트 측을 노리는 공격이다멍!" },
  { id: 129, question: "자바에서 추상 메서드를 하나만 가지는 인터페이스를 부르는 명칭은?", options: [{ text: "함수형 인터페이스", score: 20 }, { text: "마커 인터페이스", score: -10 }], comment: "정답! 람다식으로 표현 가능한 인터페이스다멍!" },
  { id: 130, question: "입력값의 경계에서 오류가 발생할 확률이 높다는 점을 이용한 테스트 기법은?", options: [{ text: "경계값 분석", score: 20 }, { text: "동등 분할", score: -10 }], comment: "정답! 0, 100 같은 경계치를 확인한다멍!" },
  { id: 131, question: "전체 프로그램 중 특정 부분만 수정하고 다시 테스트하는 것은?", options: [{ text: "회귀 테스트(Regression)", score: 20 }, { text: "회복 테스트", score: -10 }], comment: "정답! 사이드 이펙트를 확인하는 필수 과정이다멍!" },
  { id: 132, question: "데이터베이스에서 부분 함수 종속성을 제거하여 만드는 정규형은?", options: [{ text: "제2정규형(2NF)", score: 20 }, { text: "제1정규형", score: -10 }], comment: "정답! 완전 함수 종속으로 만드는 과정이다멍!" },
  { id: 133, question: "HTTP와 SSL/TLS를 결합하여 보안을 강화한 프로토콜은?", options: [{ text: "HTTPS", score: 20 }, { text: "SFTP", score: -10 }], comment: "정답! 우리가 매일 쓰는 안전한 주소다멍!" },
  { id: 134, question: "정적 분석 도구 중 하나로, 코드의 복잡도를 측정하는 지표는?", options: [{ text: "순환 복잡도(Cyclomatic)", score: 20 }, { text: "결합도", score: -5 }], comment: "정답! McCabe의 순환 복잡도다멍!" },
  { id: 135, question: "비동기식 자바스크립트와 XML을 사용하여 웹 페이지를 갱신하는 기술은?", options: [{ text: "AJAX", score: 20 }, { text: "REST", score: -10 }], comment: "정답! 화면 새로고침 없이 데이터를 가져온다멍!" },
  { id: 136, question: "소프트웨어 아키텍처 패턴 중 데이터, 표현, 제어로 분리하는 패턴은?", options: [{ text: "MVC 패턴", score: 20 }, { text: "레이어 패턴", score: -10 }], comment: "정답! Model, View, Controller의 약자다멍!" },
  { id: 137, question: "C언어 'for(i=0; i<5; i++)' 문은 몇 번 반복되는가?", options: [{ text: "5번", score: 20 }, { text: "4번", score: -10 }], comment: "정답! 0부터 4까지 총 5번이다멍!" },
  { id: 138, question: "파일 시스템의 종류 중 윈도우에서 주로 사용하며 보안 기능이 강화된 것은?", options: [{ text: "NTFS", score: 20 }, { text: "FAT32", score: -10 }], comment: "정답! 대용량과 보안에 강한 방식이다멍!" },
  { id: 139, question: "UI 설계에서 사용자의 실수를 방지하고 안전하게 보호하는 원칙은?", options: [{ text: "안전성", score: 20 }, { text: "학습성", score: -5 }], comment: "정답! 오류가 발생해도 복구 가능해야 한다멍!" },
  { id: 140, question: "데이터베이스에서 중복 데이터를 최소화하고 무결성을 유지하는 과정은?", options: [{ text: "정규화(Normalization)", score: 20 }, { text: "역정규화", score: -10 }], comment: "정답! 이상 현상을 방지하는 핵심 작업이다멍!" },
  { id: 141, question: "디스크 구성 방식 중 미러링(Mirroring)을 통해 가용성을 높이는 RAID 단계는?", options: [{ text: "RAID 1", score: 20 }, { text: "RAID 0", score: -10 }], comment: "정답! 똑같은 데이터를 두 번 쓰는 방식이다멍!" },
  { id: 142, question: "한 객체의 상태가 변하면 의존하는 다른 객체들에게 통지하는 디자인 패턴은?", options: [{ text: "옵저버(Observer) 패턴", score: 20 }, { text: "어댑터(Adapter) 패턴", score: -10 }], comment: "정답! 상태 변화를 감시하는 패턴이다멍!" },
  { id: 143, question: "C언어에서 '*ptr = &a;' 처럼 주소값을 저장하는 변수 타입을 무엇이라 하나멍?", options: [{ text: "포인터(Pointer)", score: 20 }, { text: "배열(Array)", score: -10 }], comment: "정답! 주소의 화살표 역할을 한다멍!" },
  { id: 144, question: "결함 관리 프로세스 중 결함이 실제로 수정되지 않아 반려된 상태는?", options: [{ text: "Rejected", score: 20 }, { text: "Fixed", score: -10 }], comment: "정답! 결함이 아니거나 수정 거부된 상태다멍!" },
  { id: 145, question: "네트워크 주소를 내부와 외부로 변환하여 보안을 강화하는 기술은?", options: [{ text: "NAT", score: 20 }, { text: "DNS", score: -5 }], comment: "정답! 사설 IP를 공인 IP로 바꿔준다멍!" },
  { id: 146, question: "Java에서 'try-catch' 문 뒤에 무조건 실행되는 블록은?", options: [{ text: "finally", score: 20 }, { text: "throw", score: -10 }], comment: "정답! 에러가 나든 안 나든 실행된다멍!" },
  { id: 147, question: "데이터베이스에서 이행 함수 종속성을 제거하여 만드는 정규형은?", options: [{ text: "제3정규형(3NF)", score: 20 }, { text: "BCNF", score: -10 }], comment: "정답! '도부이결다조'의 '이'에 해당한다멍!" },
  { id: 148, question: "애플리케이션 테스트 중 개발자도 테스터도 아닌 제3자가 수행하는 테스트는?", options: [{ text: "제3자 테스트", score: 20 }, { text: "단위 테스트", score: -10 }], comment: "정답! 객관성을 높이기 위한 테스트다멍!" },
  { id: 149, question: "여러 개의 하드디스크를 하나처럼 관리하여 속도와 안전성을 높이는 기술은?", options: [{ text: "RAID", score: 20 }, { text: "SSD", score: -5 }], comment: "정답! Redundant Array of Independent Disks의 약자다멍!" },
  { id: 150, question: "서로 다른 하드웨어나 소프트웨어를 연결해주는 중간 단계 소프트웨어는?", options: [{ text: "미들웨어(Middleware)", score: 20 }, { text: "펌웨어", score: -10 }], comment: "정답! 중간에서 통신을 돕는 역할이다멍!" },
  { id: 151, question: "UML 관계 중 'Is-Part-Of' 관계이며 독립성이 강한 전체-부분 관계는?", options: [{ text: "집약 관계", score: 20 }, { text: "합성 관계", score: -10 }], comment: "정답! 부분 객체가 전체에 속하지만 독립적인 거다멍!" },
  { id: 152, question: "소프트웨어 아키텍처 중 계층 구조를 가지며 인접 계층과만 통신하는 패턴은?", options: [{ text: "계층(Layered) 패턴", score: 20 }, { text: "클라이언트-서버 패턴", score: -10 }], comment: "정답! 가장 일반적인 아키텍처 구조다멍!" },
  { id: 153, question: "SQL에서 결과 중복을 제거하고 하나만 표시할 때 사용하는 키워드는?", options: [{ text: "DISTINCT", score: 20 }, { text: "UNIQUE", score: -10 }], comment: "정답! 깨끗하게 하나만 뽑아낼 때 쓴다멍!" },
  { id: 154, question: "테스트 단계 중 시스템의 전체적인 기능과 성능이 명세와 일치하는지 확인하는 것은?", options: [{ text: "시스템 테스트", score: 20 }, { text: "인수 테스트", score: -10 }], comment: "정답! 통합 테스트 다음 단계다멍!" },
  { id: 155, question: "C언어에서 'char *s = 'Hello';' 일 때 s[1]의 값은?", options: [{ text: "'e'", score: 20 }, { text: "'H'", score: -10 }], comment: "정답! 인덱스는 0부터 시작해서 1은 두 번째 글자다멍!" },
  { id: 156, question: "사용자가 의도하지 않은 명령을 실행하게 만드는 웹 보안 공격은?", options: [{ text: "CSRF", score: 20 }, { text: "XSS", score: -10 }], comment: "정답! 사이트 간 요청 위조 공격이다멍!" },
  { id: 157, question: "데이터베이스에서 기본키가 아닌 속성이 기본키의 일부에만 종속되는 현상은?", options: [{ text: "부분 함수 종속", score: 20 }, { text: "이행 함수 종속", score: -10 }], comment: "정답! 이걸 제거해야 2정규형이 된다멍!" },
  { id: 158, question: "프로세스들이 서로 자원을 점유한 채 무한정 기다리는 상태는?", options: [{ text: "교착 상태(Deadlock)", score: 20 }, { text: "기아 현상", score: -5 }], comment: "정답! 상점비환 4가지 조건이 필요하다멍!" },
  { id: 159, question: "기존 코드를 변경하지 않고 기능을 확장할 수 있어야 한다는 설계 원칙은?", options: [{ text: "개방-폐쇄 원칙(OCP)", score: 20 }, { text: "단일 책임 원칙", score: -10 }], comment: "정답! 확장엔 열려있고 수정엔 닫혀있어야 한다멍!" },
  { id: 160, question: "애플리케이션의 응답 시간, 처리량 등을 확인하여 병목 지점을 찾는 테스트는?", options: [{ text: "성능 테스트", score: 20 }, { text: "보안 테스트", score: -10 }], comment: "정답! 시스템의 효율성을 검증한다멍!" },
];

const studyData = [
  { title: "디자인 패턴 (생·구·행)", content: "생성(Factory, Singleton), 구조(Adapter, Bridge), 행위(Observer, State)! 각각의 역할을 구분하는 게 핵심이다멍!" },
  { title: "데이터베이스 정규화", content: "1NF(원자값), 2NF(부분함수 종속 제거), 3NF(이행함수 종속 제거)! '도부이결다조' 앞글자를 따서 외워라멍!" },
  { title: "OSI 7계층", content: "물-데-네-전-세-표-응! 3계층은 라우터(IP), 4계층은 TCP/UDP가 활동하는 영역이다멍!" },
];

const shuffle = (array: any[]) => [...array].sort(() => Math.random() - 0.5);

export default function App() {
  const [gameState, setGameState] = useState<'title' | 'playing' | 'result' | 'review' | 'study'>('title');
  const [gameMode, setGameMode] = useState<GameMode>(null);
  const [quizSet, setQuizSet] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [showComment, setShowComment] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [wrongAnswers, setWrongAnswers] = useState<Question[]>([]);
  const [shuffledOptions, setShuffledOptions] = useState<Option[]>([]);
  
  // 단답형 입력을 위한 상태
  const [userInput, setUserInput] = useState("");
  // 복합형 모드를 위해 개별 문제의 모드를 결정 (문제별로 랜덤하게 선택됨)
  const [currentQuestionMode, setCurrentQuestionMode] = useState<'Normal' | 'Short'>('Normal');

  // 게임 시작 로직
  const startNewGame = (mode: GameMode) => {
    if (mode === 'Code') {
      alert("아직 공사 중이다멍! 🚧 조금만 기다려달라멍!");
      return;
    }
    const shuffledQuiz = shuffle(fullQuizData).slice(0, 20);
    setQuizSet(shuffledQuiz);
    setGameMode(mode);
    setCurrentIdx(0);
    setTotalScore(0);
    setGameState('playing');
    setShowComment(false);
    setUserInput("");
    
    // 첫 문제 모드 및 선택지 설정
    setupQuestion(shuffledQuiz[0], mode);
  };

  // 문제 세팅 (모드에 따라 선택지를 섞거나 입력창 준비)
  const setupQuestion = (question: Question, mode: GameMode) => {
    if (mode === 'Mixed') {
      const isShort = Math.random() > 0.5;
      setCurrentQuestionMode(isShort ? 'Short' : 'Normal');
    } else {
      setCurrentQuestionMode(mode as 'Normal' | 'Short');
    }
    setShuffledOptions(shuffle(question.options));
    setUserInput("");
  };

  // 정답 제출 로직
  const handleAnswer = (isRight: boolean) => {
    setIsCorrect(isRight);
    if (isRight) {
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
        setupQuestion(quizSet[nextIdx], gameMode);
        setShowComment(false);
        setIsCorrect(null);
      } else {
        setGameState('result');
      }
    }, 1800);
  };

  // 단답형 전용 체크
  const checkShortAnswer = () => {
    const q = quizSet[currentIdx];
    const realAnswer = q.options.find(opt => opt.score > 0)?.text || "";
    // 공백 제거 및 소문자 변환(영문 대비)하여 비교
    const isRight = userInput.trim().toLowerCase() === realAnswer.trim().toLowerCase();
    handleAnswer(isRight);
  };

  // --- 1. 시작 화면 (모드 선택 버튼들) ---
  if (gameState === 'title') {
    return (
      <div className="relative w-screen h-screen overflow-hidden flex flex-col">
        <div className="absolute inset-0 bg-cover bg-center -z-10" style={{ backgroundImage: `url(${bgImg})` }}></div>
        <div className="flex-[5] flex flex-col items-center justify-center z-20 text-white pt-10 px-4">
          <h1 className="text-6xl md:text-8xl font-black drop-shadow-2xl italic mb-10 animate-bounce text-center">우겨넣자 정처기!</h1>
          
          <div className="grid grid-cols-2 gap-4 w-full max-w-xl mb-6">
            <button onClick={() => startNewGame('Normal')} className="bg-pink-500 text-white text-xl md:text-2xl p-6 rounded-3xl shadow-[0_8px_0_#be185d] active:translate-y-2 active:shadow-none transition-all font-black">일반모드</button>
            <button onClick={() => startNewGame('Short')} className="bg-indigo-500 text-white text-xl md:text-2xl p-6 rounded-3xl shadow-[0_8px_0_#4338ca] active:translate-y-2 active:shadow-none transition-all font-black">단답형</button>
            <button onClick={() => startNewGame('Code')} className="bg-slate-500 text-white text-xl md:text-2xl p-6 rounded-3xl opacity-70 cursor-not-allowed font-black">코드(준비)</button>
            <button onClick={() => startNewGame('Mixed')} className="bg-amber-500 text-white text-xl md:text-2xl p-6 rounded-3xl shadow-[0_8px_0_#b45309] active:translate-y-2 active:shadow-none transition-all font-black">복합형</button>
          </div>

          <div className="flex gap-4">
            <button onClick={() => setGameState('review')} className="bg-slate-700 text-white px-8 py-4 rounded-2xl font-bold">오답 노트</button>
            <button onClick={() => setGameState('study')} className="bg-amber-600 text-white px-8 py-4 rounded-2xl font-bold">요약 노트</button>
          </div>
        </div>
        <div className="flex-[4] flex items-end justify-around px-20">
          <img src={dog1} className="h-[40vh] object-contain animate-tilt-left" alt="dog1" />
          <img src={dog2} className="h-[40vh] object-contain animate-tilt-right" alt="dog2" />
        </div>
      </div>
    );
  }

  // --- 2. 오답 노트 / 3. 요약 노트 (기존과 동일하므로 유지) ---
  if (gameState === 'review' || gameState === 'study') {
    const isReview = gameState === 'review';
    return (
      <div className={`w-screen h-screen ${isReview ? 'bg-slate-100' : 'bg-amber-50'} p-8 overflow-y-auto flex flex-col items-center`}>
        <h2 className="text-4xl font-black mb-8">{isReview ? '오답노트' : '요약노트'}</h2>
        <div className="w-full max-w-4xl flex-grow">
          {isReview ? (
            wrongAnswers.length === 0 ? <p className="text-center text-2xl font-bold text-slate-400 mt-20">아직은 살려줄게🐾</p> :
            wrongAnswers.map(q => (
              <div key={q.id} className="bg-white p-6 rounded-3xl shadow-md border-l-8 border-red-400 mb-4">
                <p className="text-xl font-bold mb-2">Q. {q.question}</p>
                <p className="text-pink-600 font-bold italic">💡 {q.comment}</p>
              </div>
            ))
          ) : (
            studyData.map((item, idx) => (
              <div key={idx} className="bg-white p-8 rounded-[2.5rem] shadow-xl border-2 border-amber-200 mb-6">
                <h3 className="text-2xl font-black text-amber-600 mb-4">{item.title}</h3>
                <p className="text-xl leading-relaxed text-slate-700">{item.content}</p>
              </div>
            ))
          )}
        </div>
        <button onClick={() => setGameState('title')} className="mt-10 bg-slate-800 text-white px-12 py-5 rounded-full text-2xl font-black">🏠 메인으로</button>
      </div>
    );
  }

  // --- 4. 게임 중 화면 (핵심 로직 변경점) ---
  if (gameState === 'playing' && quizSet.length > 0) {
    const q = quizSet[currentIdx];
    return (
      <div className="relative w-screen h-screen flex flex-col items-center bg-cover bg-center" style={{ backgroundImage: `url(${gameBg})` }}>
        <div className="w-full max-w-4xl px-6 pt-10 flex justify-between items-center text-white font-black text-2xl drop-shadow-md">
          <div className="bg-black/40 px-6 py-2 rounded-full">Q {currentIdx + 1} / 20</div>
          <div className="bg-pink-500 px-6 py-2 rounded-full shadow-lg">💕 {totalScore}점</div>
        </div>
        
        <div className="w-[90%] max-w-4xl mt-6 bg-white/90 rounded-[3rem] p-8 md:p-12 shadow-2xl border-[6px] border-pink-200 relative">
          <h2 className="text-2xl md:text-3xl font-black text-slate-800 text-center leading-snug">
            {showComment ? (isCorrect ? "⭕ 정답이다멍!" : "다시.") : `"${q.question}"`}
          </h2>
        </div>

        <div className="flex-grow flex items-center justify-center relative w-full">
          {showComment && !isCorrect && <img src={imgF} className="absolute z-30 w-48 animate-ping" alt="F" />}
          <img src={showComment && isCorrect ? charHappy : charNormal} className="h-[30vh] md:h-[40vh] object-contain drop-shadow-2xl" alt="character" />
        </div>

        {/* 하단 입력/선택 영역 */}
        <div className="w-full max-w-4xl px-6 pb-12 z-20">
          {showComment ? (
            <div className="bg-black/60 p-8 rounded-3xl text-white text-center text-2xl font-bold border-2 border-white/30">{q.comment}</div>
          ) : (
            currentQuestionMode === 'Short' ? (
              <div className="flex flex-col gap-4">
                <input 
                  autoFocus
                  type="text" 
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && checkShortAnswer()}
                  placeholder="정답을 입력해라멍! (엔터)"
                  className="w-full p-6 rounded-2xl text-2xl font-bold text-center border-4 border-pink-300 shadow-xl outline-none focus:border-pink-500"
                />
                <button onClick={checkShortAnswer} className="bg-pink-500 text-white py-4 rounded-2xl text-2xl font-black shadow-lg">제출하기!</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {shuffledOptions.map((opt, i) => (
                  <button key={i} onClick={() => handleAnswer(opt.score > 0)} className="bg-white hover:bg-pink-100 text-slate-800 text-xl md:text-2xl font-black py-5 rounded-2xl shadow-[0_6px_0_#ddd] active:translate-y-1 active:shadow-none transition-all border-2 border-slate-200">
                    {opt.text}
                  </button>
                ))}
              </div>
            )
          )}
        </div>
        <button onClick={() => { if(window.confirm("그만둘래?")) setGameState('title'); }} className="absolute bottom-6 left-6 w-16 h-16 bg-black/50 text-white rounded-full text-3xl">🏠</button>
      </div>
    );
  }

  // --- 5. 최종 결과 화면 (기존 유지) ---
  const result = (totalScore >= 80) 
    ? { img: resGood, txt: "눈아 이제 코딩 공부해도 돼\n나 간식사줘", col: "text-pink-600" }
    : (totalScore >= 60) 
    ? { img: resNormal, txt: "공부 더 해\n구름이랑 같이 안 살거야?", col: "text-blue-600" }
    : { img: resBad, txt: "누나. 공부 좀 해\n누나가 구름이 대신 집 지키려고?", col: "text-gray-600" };

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center p-6 bg-pink-50 overflow-y-auto">
      <div className="bg-white p-12 rounded-[4rem] shadow-2xl text-center max-w-2xl border-[12px] border-white my-10">
        <h2 className="text-4xl font-black mb-6 italic">성적표 발표다멍!</h2>
        <img src={result.img} className="w-64 h-64 mx-auto object-cover rounded-3xl mb-6 shadow-lg" alt="result" />
        <div className={`text-9xl font-black mb-6 ${result.col}`}>{totalScore}<span className="text-4xl">점</span></div>
        <p className="text-2xl font-black text-slate-800 mb-10 whitespace-pre-wrap">{result.txt}</p>
        <button onClick={() => setGameState('title')} className="bg-slate-800 text-white px-16 py-6 rounded-full text-2xl font-black">🏠 메인으로</button>
      </div>
    </div>
  );
}