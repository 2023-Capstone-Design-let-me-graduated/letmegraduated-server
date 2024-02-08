| url | method | request body | description | response data type | 개발 여부 |
| --- | --- | --- | --- | --- | --- |
| /signup | GET | request.query.email{string} | nodemailer 모듈로 랜덤 수 4자리 보내서 클라이언트로 4자리 전달 | {string} |  |
|  /signup | POST |  | 아이디 비번, 학적, 수강학기, 자격기준 점수 조건(false), 영어 졸업인증 요건,취득 학점, 전공, 교양 |  |  |
| /login | GET | request.query.userid, request.qrery.passward | 로그인해서 접근, 자동 로그인기능 추가 | state: 200 |  |
| /main/userid | GET |  | 취득 학점, 전공필수, 전공 학점, 교양 학점, 자격기준 점수 조건 |  |  |
| /main/userid | PUT |  | 영어 졸업인증 요건 true/false |  |  |
| /major/userid/semester | GET |  | semester중에서 major 전필, 전선 |  |  |
| /major/userid/need | GET |  |  score collection 꺼내서 필요 전공필수 과목, 전공 학점 |  |  |
| /major/userid | GET |  | userid의 수강학기 |  |  |
| /major/userid | PUT |  | userid에 선택된 전공과목, 전공 학점이 업데이트 된다. (중복 허용X) |  |  |
| /minor/userid/semester | GET |  | semester중에서 minor 인데 c_area기준으로 카테고리 나눠서 |  |  |
| /minor/userid/need | GET |  |  score collection 꺼내서 필요 교양 카테고리, 교양 학점 |  |  |
| /minor/userid | GET |  | userid의 수강학기 |  |  |
| /minor/userid | PUT |  | userid에 선택된 교양과목, 교양 학점이 업데이트 된다. (중복 허용X) |  |  |
| /normal/userid | PUT |  | userid의 취득학점 올리기 |  |  |
| /normal/userid | GET |  | userid의 수강학기 |  |  |
| /exam/userid | GET |  | exam안에 있는 종류에 맞는 점수 |  |  |
| /exam/userid | PUT |  | userid에 있는 자격기준 점수 조건 true |  |  |
| /setting/userid | DELETE |  | userid 삭제 |  |  |