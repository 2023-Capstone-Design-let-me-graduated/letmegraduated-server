| url | method | request body | description | response data type | 개발 여부 |
| --- | --- | --- | --- | --- | --- |
| /signup/:email | GET | request.params.email{string} | nodemailer 모듈로 랜덤 수 4자리 보내서 클라이언트로 4자리 전달 | {string} | O |
|  /signup | POST | req.body.userid, req.body.password, req.body.major, req.body.email, req.body.semester | 아이디 비번, 학적, 수강학기, 자격기준 점수 조건(false), 영어 졸업인증 요건,취득 학점, 전공, 교양, 이메일 기본 설정해서 회원 가입 |  |  |
| /login | POST | request.query.userid, request.query.passward | 로그인해서 접근, 자동 로그인기능 추가 | 실패시 : 404 성공시 : 리다이렉트 /main/userid |  |
| /main/userid | GET | req.body.userid | 취득 학점, 전공필수, 전공 학점, 교양 학점, 자격기준 조건 | object(array) | O |
| /main/userid | PUT | req.body.userid, req.body.swap_t_f{bool} | 영어 졸업인증 요건 true/false로 업데이트 | 리턴 없음 | O |
| /main/userid/semester | GET | req.body.collectionName | 몽고DB에 있는 timtable불러옴2019_1~2023_2 | object(array) | O |
| /main/userid/score | PUT | req.body.userid, req.body.m_score, req.body.s_score | 유저의 전체학점, 전공학점, 교양학점을 업데이트 | 리턴 없음 | O |
| /main/userid/list | PUT | req.body.userid, req.body.listName, req.body.list{array} | 유저의 전공필수, 교양필수 과목을 업데이트 | 리턴 없음 | O |
| /main/userid/engcheck | PUT | req.body.userid, req.body.swap_t_f{bool} | 유저가 영어 졸업인증 신청을 했는지 true/false로 업데이트 | 리턴 없음 | O |
| /major/semester | GET | req.body.collectionName | 몽고DB에서 timetable에 전공필수, 전공선택만 가져옴 | object(array) | O |
| /minor/semester | GET | req.body.collectionName | 몽고DB에서 timetable에 교양필수만 가져옴 | object(array) | O |
| /exam/userid | GET | req.body.major | 유저가 주간, 야간에 따라 시험 종류를 가져옴 | object(array) | O |
| /exam/userid | PUT | req.body.userid | 유저가 졸업이 가능한지 확인하는 여부 true/false로 업데이트 | 리턴 없음 | O |
| /setting/:userid | DELETE | request.params.userid | 이메일 보내고 userid 삭제 | 리턴 없음 | O |





<!-- 
| /major/semester | GET | req.user.userid(session에 담겨있음) | semester중에서 major 전필, 전선 |  |  |
| /major/need | GET | req.user.userid(session에 담겨있음) |  score collection 꺼내서 필요 전공필수 과목, 전공 학점 |  |  |
| /major | GET | req.user.userid(session에 담겨있음) | userid의 수강학기 |  |  |
| /major | PUT | req.user.userid(session에 담겨있음) | userid에 선택된 전공과목, 전공 학점이 업데이트 된다. (중복 허용X) |  |  |
| /minor/userid/semester | GET |  | semester중에서 minor 인데 c_area기준으로 카테고리 나눠서 |  |  |
| /minor/userid/need | GET |  |  score collection 꺼내서 필요 교양 카테고리, 교양 학점 |  |  |
| /minor/userid | GET |  | userid의 수강학기 |  |  |
| /minor/userid | PUT |  | userid에 선택된 교양과목, 교양 학점이 업데이트 된다. (중복 허용X) |  |  |
| /normal/userid | PUT |  | userid의 취득학점 올리기 |  |  |
| /normal/userid | GET |  | userid의 수강학기 |  |  |
| /exam/userid | GET |  | exam안에 있는 종류에 맞는 점수 |  |  |
| /exam/userid | PUT |  | userid에 있는 자격기준 점수 조건 true |  |  |
-->