const fs = require('fs');
 

// fs.readFile('./readFile.txt','utf-8',(err,str)=>{
//     if(err){
//         console.log(err);
//     }
//     else{
//         console.log(str);
//     }
// });
// console.log("before reading ");

function main(){
    const real = fs.readFileSync('./readFile.txt','utf8');
    console.log(real);
    console.log("after the reading ");
}

main().catch((err)=>{
    console.log(err);
})


