const express = require('express');
const userController = require('./../controller/userController');
const authRouters = express.Router();       // here we have created a new resource router.

authRouters.route('/user_log')
.get(userController.getdata)
.post(userController.signUp)
.delete(userController.deletedData);

authRouters.route('/log-in')
.post(userController.log_in);

authRouters.route('/:id')
.delete(userController.deleteDataById);

authRouters.route('/forgetPassword')
.post(userController.forgetPassword);

authRouters.route('/resetPassword/:token')
.patch(userController.resetPassword);



module.exports = authRouters;