const express = require('express');
const petRouter =  express.Router();          // it return a middleware.
const apifeatures = require('./../utils/apifeatures');
const pet_model = require('./../models/petschema');
const mongoose = require('mongoose');
const userController = require('./../controller/userController');
// route handler function....
const petInfoController = require('./../controller/petInfoController');
const authRouters = require('./authRouters');

petRouter.route('/loginform')
.get(petInfoController.mylimit)

petRouter.route('/')
.post(petInfoController.createonepet)
.get(userController.protect,petInfoController.allpetdata)
// .get(userController.protect,petInfoController.allpetdata)



petRouter.route('/:id')
.get(petInfoController.getonepet)
.patch(petInfoController.updateonepet)
.delete(userController.protect,userController.restrict('admin'),petInfoController.deleteonepet)

module.exports = petRouter;