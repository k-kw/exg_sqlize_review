const express = require('express');
const { sequelize } = require('../../models/index');
const router = express.Router();
const db = require('../../models/index');
const my_funcs = require('../../my_funcs/my_funcs');

router.get('/', (req,res,next)=>{
    // check login
    if(my_funcs.login_check(req,res,'/top')){
        // send del-warning-page
        db.Review.findByPk(req.query.rvid, {
            include: [{model: db.Evtarget}, {model: db.User}]
        })
        .then(review => {
            var data = {
                title: 'Delete review',
                head1: 'このレビューを削除する場合は削除を押してください。',
                content: review
            };
            res.render('review/del', data);
        })
        .catch(err => {
            // 見つからない場合
            console.log(err);
            var data = {
                title: 'Hello!',
                content: 'レビューは削除できませんでした。'
            };
            res.render('usertop', data);
        })

    }
});

router.get('/exe', (req,res,next)=>{
    // check login
    if(my_funcs.login_check(req,res,'/top')){
        const loginuser=req.user;

        db.Review.findByPk(req.query.rvid, {
            include: [{model: db.Evtarget}, {model: db.User}]
        })
        .then(review => {
            if(review.User.id == loginuser.id){
                db.sequelize.sync()
                .then(() => review.destroy()
                .then(() => {
                    res.redirect('/review/user_list');
                })
                .catch(err => {
                    console.log(err);
                    var data = {
                        title: 'Hello!',
                        content: 'レビューは削除できませんでした。'
                    };
                    res.render('usertop', data);
                })
                )
            }else{
                // ユーザとレビューの所有者が一致しない
                console.log("login-user and this review-user do not match.");
                var data = {
                    title: 'Hello!',
                    content: 'レビューは削除できませんでした。'
                };
                res.render('usertop', data);
            }
        })
        .catch(err => {
            // 見つからない場合
            console.log(err);
            var data = {
                title: 'Hello!',
                content: 'レビューは削除できませんでした。'
            };
            res.render('usertop', data);
        })
    }
});



module.exports = router;