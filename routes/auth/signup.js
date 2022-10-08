const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require('../../models/index');
const { check, validationResult } = require('express-validator');
const my_funcs = require('../../my_funcs/my_funcs');

router.get('/', (req, res, next)=> {
    var data={
        title:'ユーザ登録',
        errormsg:'',
        form_default: {
            name:"ユーザ名（１～１００文字）",
            mail: "メールアドレス",
            pass:"",
            repass:""
        }
    };
    res.render('auth/signup', data);
});

router.post('/', [
    // express-validator
    check('pass', 'パスワードは必須です。').notEmpty(),
    check('pass', 'パスワードは4~500文字で入力してください。').custom(value => {
        return 4<=value.length;
    })
], (req, res, next)=> {
    // express-validatorをcheck
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        
        // express-validator-error
        var result = '<ul class="text-danger">';
        var result_arr = errors.array();
        for(var n in result_arr) {
          result += '<li>' + result_arr[n].msg + '</li>'
        }
        result += '</ul>';

        var data = {
            title: 'ユーザ登録',
            errormsg: result,
            form_default: req.body
        }
        res.render('auth/signup', data);
    }else{
        // pass express-validator
        // ユーザ名の唯一性と、パスワードの一致を確認してユーザをデータベースに追加
        let errormsg='error: ';
        var flg=true;
        
        const newname=req.body.name;
        db.User.count({
            where: {
                name:newname
            }
        }).then(cnt => {
            // nameの重複check
            if(cnt!=0){
                console.log('Already this name exist, so user must change name.');
                errormsg=errormsg+'この名前は既に使われています。';
                flg=false;
            }
            // passwordが確認用と等しいかcheck
            if(req.body.pass!=req.body.repass){
                errormsg=errormsg+'確認用とパスワードが一致しません。';
                flg=false;
            }

            // エラーがあればサインアップフォームを再送信
            if(!flg){
                console.log(errormsg);
                var data={
                    title:'ユーザ登録',
                    errormsg:errormsg,
                    form_default: req.body
                }
                res.render('auth/signup', data);
                return;
            }

            // Userを作成してみる
            db.sequelize.sync()
            .then(async () => db.User.create({
                name: req.body.name,
                pass: await bcrypt.hash(req.body.pass, Number(process.env.SALT_ROUNDS)),
                mail: req.body.mail
            })
            .then((usr) => {
                // pass sequelize-validation
                console.log('create user.');
                res.redirect('/signin');
            })
            .catch(err => {
                // sequelize-validation-error
                console.log("detect User-validation-error");

                // prepare error-message
                var result = my_funcs.collect_err_msg(err);

                var data={
                    title: 'ユーザ登録',
                    errormsg: result,
                    form_default: req.body
                }
                res.render('auth/signup', data);
            }))
        })
    }
    
});

module.exports = router;