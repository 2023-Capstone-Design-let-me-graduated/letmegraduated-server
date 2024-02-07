// users컨트롤러
const userDataClient = require('../testdb');

exports.renderUsers = (req, res, next) => {
    res.send('respond with a resource for users');
}

exports.rendCreatUser = async (req, res, next) => {
    const {username, password, major, semester, m_list, s_list, eng} = req.body;
    try {
        const userId = await userDataClient.createUser(username, password, major, semester, m_list, s_list, eng);
        res.status(201).json({userId});
    } catch (err) {
        console.error(err);
    }
}

exports.renderuserid = (req, res, next) => {

}