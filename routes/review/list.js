const express = require('express');
const { sequelize } = require('../../models/index');
const router = express.Router();
const db = require('../../models/index');
const my_funcs = require('../../my_funcs/my_funcs');

router.get('/', (req,res,next)=>{
    if(my_funcs.login_check(req,res,'/top')){
        db.Review.findAll({
            include:[
                {model: db.User}, {model: db.Evtarget}, 
            ],
            order:[
                ['createdAt','DESC']
            ],
        }).then(reviews => {
            var data={
                title:'All reviews',
                content:reviews
            }
            res.render('review/list', data);    
        });
    }
});



module.exports = router;