const express = require('express');
const router = express.Router();
const db = require('../../models/index');
const my_funcs = require('../../my_funcs/my_funcs');
const { Op } = require("sequelize");

//検索フォームを送信
router.get('/', (req,res,next)=>{
    if(my_funcs.login_check(req,res,'/top')){
        var data={
            title:'Search product',
            head1:'既にレビューされた製品を検索できます。',
            head2:'',
            /* default value */
            form_default: {
                name:'検索したい製品名',
            }
        }
        res.render('target/search', data);
    }
});
//返ってきたフォームから検索
router.post('/', (req,res,next)=>{
    if(my_funcs.login_check(req,res,'/top')){
        const loginuser=req.user;
        db.Evtarget.findAll({
            where:{
                name: {[Op.like]:'%'+req.body.name+'%'}
            },
            include: [{model: db.Review}],
        })
        .then(targets=>{
            for(let target of targets) {
                console.log(target.name);
                console.log(target.manufac);
                console.log(target.Reviews.length)
            }
            var data={
                title:'Search product result',
                head1:'製品検索結果',
                head2:'',
                content:targets,
                form_default:{
                    name:'検索したい製品名',
                }
            }
            res.render('target/search-result', data);
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