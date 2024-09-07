const apifeatures = require('./../utils/apifeatures');
const pet_model = require('./../models/petschema');
const customError = require('./../utils/customError');
const asyncErrorHandler = require('./../utils/asyncErrorHandler');
 
//  const kee = new customError("hii",400)
// console.log(kee.isOperational);


exports.allpetdata = asyncErrorHandler(async(req,resp,next)=>{
        const features = new apifeatures(pet_model.find(),req.query).filter().sort().limitFields().pagination();
          let realq = await features.query;
          if(!realq){
            const err = new customError('this Id document is not found!',404);
           
             return next(err);
           }

       resp.status(200).json({
        status: "success",
        data: {
              realq
        }
       }) 
})

exports.createonepet = asyncErrorHandler(async(req,resp)=>{
        const data = req.body;
        // console.log(data);
        const createpet = await pet_model.create(data);
           resp.status(201).json({
              status: 'success',
              createpet
           }) 
})

exports.getonepet = asyncErrorHandler(async(req,resp,next)=>{
        const {id} = req.params;
       const value =  await pet_model.findById(id);
       if(!value){
          const error = new customError('this Id document is not found!',404);
          console.log(error);
          return next(error);
       }
        resp.status(200).json({
           status: "success",
           data: {
             value
           }
        })
})

exports.updateonepet = asyncErrorHandler(async(req,resp,next)=>{
    
          const {id} = req.params;
       const updatedPetInfo = await pet_model.findByIdAndUpdate(id,req.body,{new: true,runValidators: true});
       if(!updatedPetInfo){
          const err = new customError('this Id document is not found!',404);
          return next(err);
       }
       
       resp.status(200).json({
            status: "success",
            updated_record: {
                updatedPetInfo
            }
         }) 
})

exports.deleteonepet = asyncErrorHandler(async(req,resp,next)=>{
        const id = req.params.id;
     const deleteDoc = await pet_model.findByIdAndDelete(id);
     if(!deleteDoc){
        const err = new customError('this Id document is not found!',404);
        next(err);
       }
     resp.status(200).json({
        status: "success",
        deleted_record: {
            deleteDoc
        }
     }) 
})

exports.mylimit = async(req,resp)=>{
    const excludeFields  = ['sort','page','limit','fields'];
    const queryObj = {...req.query};     //shallow copy
    excludeFields.forEach((el)=>{
        delete queryObj[el];
    })
    queryObj.name = "mohit";
    console.log(req.query);
    console.log(queryObj);
   const data = req.query;
 const movie = await pet_model.find(data); 
 resp.status(200).json({
    movie
 })

}
