| url | method | request body | description | response data type | 개발 여부 |
| --- | --- | --- | --- | --- | --- |
| /signup/:email | GET | request.params.email{string} | nodemailer 모듈로 랜덤 수 4자리 보내서 클라이언트로 4자리 전달 | {string} | O |
|  /signup | POST | req.body.userid, req.body.password, req.body.major, req.body.email, req.body.semester | 아이디 비번, 학적, 수강학기, 자격기준 점수 조건(false), 영어 졸업인증 요건,취득 학점, 전공, 교양, 이메일 기본 설정해서 회원 가입 |  |  |
| /login | POST | request.query.userid, request.qrery.passward | 로그인해서 접근, 자동 로그인기능 추가 | 실패시 : 401 |  |
| /login | GET | | 로그인 실패 | state: 404 | O |
| /main/userid | GET |  | 취득 학점, 전공필수, 전공 학점, 교양 학점, 자격기준 점수 조건 |  |  |
| /main/userid | PUT |  | 영어 졸업인증 요건 true/false |  |  |
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
| /setting/:userid | DELETE | request.params.userid | 이메일 보내고 userid 삭제 |  | O |