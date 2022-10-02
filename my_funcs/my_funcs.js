module.exports = {
    collect_err_msg: function (validation_err){
        var result = '<ul class="text-danger">';
        for (let result_err of validation_err.errors){
            result += '<li>' + result_err.message + '</li>';
        }
        result += '</ul>';
        return result;
    },
    login_check: function (req,res,back_url){
        if(req.user==undefined){
            console.log('to %s',back_url)
            res.redirect(back_url);
            return false;
        }
        else{
            console.log('login ok.');
            return true;
        }
    }
};