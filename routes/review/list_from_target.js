const express = require('express');
const router = express.Router();
const db = require('../../models/index');
const my_funcs = require('../../my_funcs/my_funcs');
const { Op } = require("sequelize");

//受け取ったtgidを使ってリスト表示
router.get('/', (req,res,next)=>{
    if(my_funcs.login_check(req,res,'/top')){
        const loginuser=req.user;
        //console.log(req.query.tgid);
        db.Evtarget.findByPk(req.query.tgid, {
            include:[{
                model: db.Review,
                include: db.User
            }],
            order:[
                [{model: db.Review},'purchasedate','DESC']
            ],
        })
        .then(target => {
            var data={
                title:'this product\'s reviews ',
                head1: '製造社: '+target.manufac+', '+'製品名: '+target.name+' のレビュー一覧',
                head2:'',
                content: target.Reviews,
                tgid: req.query.tgid
            }
            res.render('review/list_from_target', data);
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