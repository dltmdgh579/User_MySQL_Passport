

module.exports = function(router, passport){
    console.log('user_passport 호출됨');

    router.route('/').get(function(req, res){
        console.log('/ 패스로 요청됨');

        var id = req.user;
        if(!id) res.render('login.ejs');
        res.render('home.ejs', {'id':id});
    });

    router.route('/login').get(function(req, res){
        console.log('/login 패스로 GET 요청됨');

        res.render('login.ejs', {message: req.flash('loginMessage', '로그인')});
    });

    router.route('/login').post(passport.authenticate('local-login', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    }));

    router.route('/join').get(function(req, res){
        console.log('/join 패스로 GET 요청됨');

        res.render('join.ejs', {message: req.flash('joinMessage', '회원가입')});
    });

    router.route('/join').post(passport.authenticate('local-join', {
        successRedirect: '/',
        failureRedirect: '/join',
        failureFlash: true
    }));

    router.route('/logout').get(function(req, res){
        console.log('/logout 패스로 GET 요청됨');

        req.logout();
        res.redirect('/login');
    });

}