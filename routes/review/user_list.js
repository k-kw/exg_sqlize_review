const express = require('express');
const { sequelize } = require('../../models/index');
const router = express.Router();
const db = require('../../models/index');
const my_funcs = require('../../my_funcs/my_funcs');

router.get('/', (req,res,next)=>{
    // check login
    if(my_funcs.login_check(req,res,'/top')){

        
        const loginuser=req.user;
        
        // get login-user-reviews
        db.Review.findAll({
            where: {userId: loginuser.id},
            include: [{model: db.Evtarget}],
            order:[['createdAt','DESC']]
        }).then(reviews => {
            console.log("get %d"+" review", reviews.length);
            var data={
                title: 'Your reviews',
                content: reviews
            }
            res.render('review/user_list', data);

        });
    }

});



module.exports = router;