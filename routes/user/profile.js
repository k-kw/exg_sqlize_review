const express = require('express');
const router = express.Router();
const db = require('../../models/index');
const my_funcs = require('../../my_funcs/my_funcs');
const { Op } = require("sequelize");

//ユーザのプロファイルを表示
router.get('/', (req,res,next)=>{
    if(my_funcs.login_check(req,res,'/top')){
        const loginuser=req.user;
        db.User.findByPk(req.query.userid, {
            include:[{
                model: db.Review,
                include: db.Evtarget
            }],
            order:[
                [{model: db.Review},'purchasedate','DESC']
            ],
        })
        .then(user => {
            console.log('search user');
            var data={
                title: user.name+'\'s profile',
                head1: user.name+'のレビュー一覧',
                head2:'',
                content: user.Reviews,
            }
            res.render('user/profile', data);
        })
        .catch(err => {
            console.log(err);
            var data = {
                title: '予期せぬエラーのためあなたのトップページに遷移しました。',
                content: 'ユーザ名: ' + loginuser.name + '<br>' +
                    'メールアドレス: ' + loginuser.mail + ''
            };
            res.render('usertop', data);
        });
    }
});

module.exports = router;