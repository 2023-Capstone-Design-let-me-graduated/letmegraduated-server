| url | method | request body | description | response data type | 개발 여부 |
| --- | --- | --- | --- | --- | --- |
| /signup/email | POST | email{string} | nodemailer 모듈로 랜덤 수 16자리 보내서 클라이언트로 16자리 전달 | secretcode{string} | O |
| /signup | POST | userid{string}, password{string}, major{string}, email{string}, semesterlist{Array} | 아이디 비번, 전공, 이메일, 수강학기를 받아서 나머지는 기본 설정 완료 후 회원 가입 | 완료시 message{string} | O |
| /login | POST | username{string}, password{string} | 로그인 후 passport 세션을 서버에 저장 | 실패시 : message(status:404){string},    성공시 : message(status:200){string} | O |
| /logout | GET |  | 실패시 : message(status:404){string} 성공시 : message(status:200){string} |  | O |
| /main | GET |  | 취득 학점, 전공필수, 전공 학점, 교양 학점, 자격기준 조건 | object(array) | O |
| /main | PUT | req.body.userid, req.body.swap_t_f{bool} | 영어 졸업인증 요건 true/false로 업데이트 | 리턴 없음 | X |
| /major/semester | GET |  | 유저가 들은 수강학기 | object(array) | X |
| /major/semester | GET | 선택된수강학기{string} | 선택된 수강학기의 모든 전공 과목 리스트를 꺼내온다. | object(array) | X |
| /major | PUT | majorlist{array}, majorscore{number} | 유저데이터 변경하고 미수강한 전필 과목, 남은 전공 학점 출력 | {subject: ,score: number(int)}{Object} | X |
| /minor/semester | GET |  | 유저가 들은 수강학기 | object(array) | X |
| /minor/semester | GET | 선택된수강학기{string} | 선택된 수강학기의 모든 교양 과목 리스트를 꺼내온다. | minor{기초교양: [], 교양필수: []}(object) | X |
| /minor | PUT | 기초교양리스트{array},교양필수리스트{array},minorscore{int} | 기초교양, 교양필수리스트, 교양 학점, 총학점 업데이트 |  | X |
| /exam | POST | testType{string} | 유저가 주간, 야간에 따라 시험 종류에 따른 제한 조건 출력 | object(array) | O |
| /exam | PUT | check{boolean} | 성적이 졸업요건에 따라 유저데이터의 eng를 true 아니면 false 로 업데이트 |  | O |
| /user | DELETE |  | 이메일 보내고 userid 삭제 | message(status:200){string} | O |