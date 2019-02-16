module.exports = member => {
    var _user = member.client.helpers.get('user');
    _user.initUser(member);
};