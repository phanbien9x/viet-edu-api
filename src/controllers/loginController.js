import md5 from 'md5';
import { login } from '../models/user.js';

export function userLogin(req, res) {
  if (!req.body) {
    res.status(400).send({
      message: 'Content can not be empty!',
    });
  }
  console.log(req.body);
  let userInfo = {
    username: req.body.username,
    password: md5(`${process.env.PASSWORD_DUMMY_STRING}${req.body.password}`),
  };
  if (req.body.access_token) {
    userInfo = { access_token: req.body.access_token };
  }
  login(userInfo, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || 'Incorrect username or password.',
      });
    else res.send(data);
  });
}
