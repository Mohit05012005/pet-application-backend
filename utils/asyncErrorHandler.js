module.exports = function(funn){
    return function(req,resp,next){
        funn(req,resp,next).catch((err)=>{
            // console.log(err);
            next(err);

         })
    }
        
}