const express = require('express');
const { sequelize } = require('../../models/index');
const router = express.Router();
const db = require('../../models/index');
const my_funcs = require('../../my_funcs/my_funcs');

router.get('/', (req,res,next)=>{
    // check login
    if(my_funcs.login_check(req,res,'/top')){
        const loginuser=req.user;
        
        db.Review.findByPk(req.query.rvid, {
            include: [{model: db.Evtarget}, {model: db.User}]
        }).then(review => {
            //ログインユーザとレビューの保有者が一致しているか念のため確認
            if(review.User.id!==loginuser.id){
                // 一致していないならユーザのトップ画面へ
                console.log("login-user and this review-user do not match.");
                res.redirect('/usertop');
                return;
            }
            else{
                // 一致していれば編集画面を送信
                console.log("login-user and this review-user match.")
                data = {
                    title: 'edit review',
                    head1: '日付を除いて編集前の値が入力されています。',
                    rvid: req.query.rvid,
                    form_default:{
                        name: review.Evtarget.name,
                        manufac: review.Evtarget.manufac,
                        star: review.star,
                        comment: review.comment,
                        purchasedate: review.purchasedate
                    }
                }
                res.render('review/edit', data);
            }
        });
    }
});

router.post('/', (req,res,next)=>{
    /* check login */
    if(my_funcs.login_check(req,res,'/top')){
        const loginuser=req.user;

        //製品が既に登録済みか確認して、なければ作成
        db.Evtarget.findOrCreate({
            where:{
                name:req.body.name,
                manufac:req.body.manufac
            },
            defaults:{
                name:req.body.name,
                manufac:req.body.manufac
            }
        })
        .then(([target,created]) => {
            console.log('findOrCreate in Evtarget-table.');
            // 該当レビューを更新
            db.sequelize.sync()
            .then(() => db.Review.update({
                evtargetId: target.id,
                comment: req.body.comment,
                star: req.body.star,
                purchasedate: req.body.purchasedate
            },{
                where:{id:req.query.rvid}
            })
            .then(review => {
                console.log('update review and to user-review.');
                res.redirect('/review/user_list');
            })
            .catch(err => {
                // Review-validation-error
                console.log("detect Review-validation-error");
                // prepare error-message
                var result = my_funcs.collect_err_msg(err);

                var data={
                    title: 'edit review',
                    head1: result,
                    rvid: req.query.rvid,
                    form_default: req.body
                }
                res.render('review/edit', data);
            })
            )

        })
        .catch(err => {
            // Evtarget-validation-error
            console.log("detect Evtarget-validation-error");
            // prepare error-message
            var result = my_funcs.collect_err_msg(err);

            var data={
                title: 'edit review',
                head1: result,
                rvid: req.query.rvid,
                form_default: req.body
            }
            res.render('review/edit', data);
        })
    }

});



module.exports = router;