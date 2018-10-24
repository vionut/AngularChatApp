require('dotenv').config();
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

exports.user_login = function(req, res) {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email, password: password }, function(err, user) {
    if (err)
      return res.status(500).json({
        error: err,
        message: 'An error occured'
      });
    if (!user)
      return res.status(500).json({
        error: true,
        message: 'Could not find user'
      });
    const token = jwt.sign({ user }, process.env.TOKEN_SECRET, {
      expiresIn: 43200
    });
    res.status(200).json({
      response: { user, token },
      message: 'Successfully found the user'
    });
  });
};

exports.users_get = function(req, res) {
  const token = req.header('Authorization');
  if (!token)
    return res.status(401).json({
      error: true,
      message: 'Unauthorized'
    });
  User.find({}, function(err, users) {
    if (err)
      return res.status(500).json({
        error: err,
        message: 'An error occured'
      });
    res.status(200).json({
      response: { users },
      message: 'Successfully retrieved the users'
    });
  });
};

exports.user_get = function(req, res) {
  const token = req.header('Authorization');
  if (!token)
    return res.status(401).json({
      error: true,
      message: 'Unauthorized'
    });
  const userId = req.query.userId;
  User.findById(userId, function(err, user) {
    if (err)
      return res.status(500).json({
        error: err,
        message: 'An error occured'
      });
    res.status(200).json({
      response: { user },
      message: 'Successfully retrieved the users'
    });
  });
};

exports.user_create = function(req, res) {
  let user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    role: 'user'
  });
  user.save(function(err) {
    if (err)
      return res.status(500).json({
        error: err,
        message: 'Could not create user'
      });
    const token = jwt.sign({ user }, process.env.TOKEN_SECRET, {
      expiresIn: 43200
    });
    res.status(200).json({
      response: { user, token },
      message: 'Successfully created user'
    });
  });
};

exports.user_update = function(req, res) {
  const token = req.header('Authorization');
  if (!token)
    return res.status(401).json({
      error: true,
      message: 'Unauthorized'
    });
  User.findOneAndUpdate(
    { _id: req.body.id },
    {
      $set: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        role: req.body.role
      }
    },
    function(err, user) {
      if (err)
        return res.status(500).json({
          error: err,
          message: 'Could not update user'
        });
      if (!user)
        return res.status(500).json({
          error: true,
          message: 'Could not find user, did not update'
        });
      res.status(200).json({
        response: 'User Updated',
        message: 'Successfully updated user'
      });
    }
  );
};

exports.user_delete = function(req, res) {
  const token = req.header('Authorization');
  if (!token)
    return res.status(401).json({
      error: true,
      message: 'Unauthorized'
    });
  User.findOneAndDelete({ _id: req.query.userId }, function(err) {
    if (err)
      return res.status(500).json({
        error: err,
        message: 'Could not update user'
      });
    res.status(200).json({
      response: 'User Deleted',
      message: 'Successfully deleted user'
    });
  });
};
