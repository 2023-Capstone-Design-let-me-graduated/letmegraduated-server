| url           | method | request body                                                                        | description                                                                       | response data type                                                         | 개발 여부 |
| ------------- | ------ | ----------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | -------------------------------------------------------------------------- | --------- |
| /signup/email | POST   | email{string}                                                                       | nodemailer 모듈로 랜덤 수 자리 보내서 클라이언트로 16자리 전달                    | secretcode{json}                                                           | O         |
| /signup       | POST   | userid{string}, password{string}, major{string}, email{string}, semesterlist{Array} | 아이디 비번, 전공, 이메일, 수강학기를 받아서 나머지는 기본 설정 완료 후 회원 가입 | 완료시 message{json}                                                       | O         |
| /login        | POST   | userid{string}, password{string}                                                    | 로그인 후 passport 세션을 서버에 저장                                             | 실패시 : message(status:404){string}, 성공시 : message(status:200){object} | O         |
| /logout       | GET    |                                                                                     | 실패시 : message(status:404){string} 성공시 : message(status:200){string}         |                                                                            | O         |
| /main         | GET    |                                                                                     | 취득 학점, 전공필수, 전공 학점, 교양 학점, 자격기준 조건                          | object(array)                                                              |
report = { score : {int},
                m_need_score : {int}, 
                m_score : {int},
                s_score : {int},
               n_score : {int},
               engcheck : {bool}, } | O |
| /main | PUT | engcheck{bool} | 영어 졸업인증 요건 true/false로 업데이트 | 리턴 없음 | O |
| /major/semester | GET |  | 유저가 들은 수강학기 | {array} | O |
| /major/semester | POST | selectedSemester{string} | 선택된 수강학기의 모든 전공 과목 리스트를 꺼내온다. | object(array) (ex) major = { need: [], choice: [] , foundamental: []}; | O |
| /major | PUTA | need{array}, choice{array}, foundamental{array}, | 유저 데이터를 변경하고 전공 졸업 요건에 관련된 데이터를 출력한다. | object(array)
report = { state : {bool},
                checkState : {bool},
            m_need_checkState : {bool},
            capstoneState : {bool},
            m_b_check: {bool},
            m_b_list: {array},
           m_score : {int},
           m_need_score : {int},
          m_need_list : {array}, }
 | O |
| /minor/semester | GET | semester{array} | 유저가 들은 수강학기 | {array} | O |
| /minor/semester | POST | selectedSemester{string} | 선택된 수강학기의 모든 교양 과목 리스트를 꺼내온다. | object(array) (ex) { need: [], foundamental: []} | O |
| /minor | PUT | sFoundamentalList{array}
sNeedList{array} | 기초교양, 교양필수리스트, 교양 학점, 총학점 업데이트 하고 리스트를 꺼내온다. | object(array)
report = { state : {bool},
                 checkState : {bool},
              sFoundamentalList : {bool},
             sNeedList : {bool}, s_score : {int},
            s_fundamental_list : {array},
           s_need_list : {array}, } | O |
| /normal | PUT | score{int} | 수강한 일반과목 총학점을 유저 데이터에 저장한다. | 리턴없음 | O |
| /exam | POST | testType{string}, score{string} | 유저가 주간, 야간에 따라 시험 종류에 따른 제한 조건을 꺼내서 통과되는지 확인 | {object}
check{boolean}
condition{array} | O |
| /user | DELETE |  | 이메일 보내고 userid 삭제 | message(status:200){string} | O |