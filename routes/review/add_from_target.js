const express = require('express');
const router = express.Router();
const db = require('../../models/index');
const my_funcs = require('../../my_funcs/my_funcs');
const { Op } = require("sequelize");

//受け取ったtgidを使ってレビューを作成する
//作成フォームを送信
router.get('/', (req,res,next)=>{
    if(my_funcs.login_check(req,res,'/top')){
        const loginuser=req.user;
        //console.log(req.query.tgid);
        db.Evtarget.findByPk(req.query.tgid, {})
        .then(target => {
            var data={
                title:'Add review to the product',
                head1: '製造社: '+target.manufac+', '+'製品名: '+target.name+' にレビューを追加',
                head2:'',
                tgid: req.query.tgid,
                /* default value */
                form_default: {
                    star:"1~5で評価",
                    comment:"1~100文字以内で入力してください。（スペースでもよい）",
                    purchasedate:""
                }

            }
            res.render('review/add_from_target', data);
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
//返ってきたフォームから作成
router.post('/', (req,res,next)=>{
    if(my_funcs.login_check(req,res,'/top')){
        const loginuser=req.user;
        //console.log(req.query.tgid);
        //作成
        db.sequelize.sync()
        .then(() => db.Review.create({
            userId: loginuser.id,
            evtargetId: req.query.tgid,
            comment: req.body.comment,
            star: req.body.star,
            purchasedate: req.body.purchasedate
        })
        //成功
        .then(review => {
            console.log('create review and to usertop.');
            res.redirect('/usertop');
        })
        //失敗
        .catch(err => {
            // Review-validation-error
            console.log("detect Review-validation-error");
            console.log(err);
            // prepare error-message
            var result = my_funcs.collect_err_msg(err);

            db.Evtarget.findByPk(req.query.tgid, {})
            .then(target => {
                //console.log(result);
                var data={
                    title:'Add review to the product',
                    head1: '製造社: '+target.manufac+', '+'製品名: '+target.name+' にレビューを追加',
                    head2: result,
                    tgid: req.query.tgid,
                    /* default value */
                    form_default: req.body
                }
                res.render('review/add_from_target', data);
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

            
        })
        );
    }
});
module.exports = router;