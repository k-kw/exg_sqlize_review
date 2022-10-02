const express = require('express');
const router = express.Router();
const db = require('../../models/index');
const { check, validationResult } = require('express-validator');
const my_funcs = require('../../my_funcs/my_funcs');

/* send review-form */
router.get('/', (req,res,next)=>{
    if(my_funcs.login_check(req,res,'/top')){
        var data={
            title:'review form',
            head1:'',
            /* default value */
            form_default: {
                name:'レビューしたい製品名',
                manufac: "製品の製造／販売社",
                star:"1~5で評価",
                comment:"1~100文字以内で入力してください。（スペースでもよい）",
                purchasedate:""
            }
        }
        res.render('review/create', data);
    }
});

/* review create */
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
            console.log('findOrCreate in Evtarget-table.')

            db.sequelize.sync()
            .then(() => db.Review.create({
                userId: loginuser.id,
                evtargetId: target.id,
                comment: req.body.comment,
                star: req.body.star,
                purchasedate: req.body.purchasedate
            })
            .then(review => {
                console.log('create review and to usertop.');
                res.redirect('/usertop');
            })
            .catch(err => {
                // Review-validation-error
                console.log("detect Review-validation-error");
                console.log(err);
                // prepare error-message
                var result = my_funcs.collect_err_msg(err);

                var data={
                    title: 'review form',
                    head1: result,
                    form_default: req.body
                }
                res.render('review/create', data);
            })
            );
        })
        .catch(err => {
            // Evtarget-validation-error
            console.log("detect Evtarget-validation-error");
            // prepare error-message
            var result = my_funcs.collect_err_msg(err);

            var data={
                title: 'review form',
                head1: result,
                form_default: req.body
            }
            res.render('review/create', data);
        })
    }
});

module.exports = router;