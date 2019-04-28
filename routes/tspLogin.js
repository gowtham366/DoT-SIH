var Router = require('express').Router();
var tspSchema = require('../models/tsp_schema');
// const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const requestIp = require('request-ip');

// Router.post('/',(req, res, next) => {
//   // const cipher = crypto.createCipher('aes192', 'password');
//   // let encrypted = cipher.update(req.body.password, 'utf8', 'hex');
//   // encrypted = cipher.final('hex');
//   //
//   // let password = encrypted;
//
//   var user = new tspSchema({
//     operator: req.body.operator,
//     password: bcrypt.hashSync(req.body.password, 10),
//     CreatedIpAddress: requestIp.getClientIp(req)
//   })
//   user.save(function(err, result) {
//     if(err) {
//       res.status(500).json({
//         "result": {
//           status: false,
//           message: 'An error occured while creating',
//           error: err
//         }
//
//       });
//     }
//       res.status(201).json({
//         "result": {
//           status: true,
//           message: 'TSP created successfully',
//           obj: result
//         }
//       });
//   });
// });

Router.post('/signin', function(req, res, next) {
  console.log(req.body);
  tspSchema.findOne({operator: req.body.operator} , function(err, result) {
    if(err) {
      console.log(err);
      res.status(500).json({
        "result": {
          status: false,
          message: 'An error occured while creating',
          error: err
        }
      });
    }
    if(result === null) {
      console.log("null");
      res.status(401).json({
        "result": {
          status: false,
          message: 'Check your operator ID/ password'
        }
      });
    }
    else {
      console.log(req.body.password, "--->",result.password);
      if(!bcrypt.compareSync(req.body.password, result.password)) {
        res.status(401).json({
          "result": {
            status: false,
            message: 'Check your operator ID/ password'
          }
        });
      }
      else {
        // token creation
        var token = jwt.sign({tsp: result}, 'MyS3CR3T', {expiresIn: 7200});
        res.status(200).json({
          "result": {
            status: true,
            message: 'Login Successful',
            token: token,
            userId: result._id,
            operator: result.operator,
            key: result.authKey,
            region: result.region
          }
        });
      }//inner else
    }//outer else
  });
});

module.exports = Router;
