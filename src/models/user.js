import md5 from 'md5';
import mongoose from 'mongoose';

if (mongoose.models.User) {
  delete mongoose.models.User;
}

const User = mongoose.model(
  'User',
  mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    access_token: { type: String },
  })
);
export default User;

export function create(newUser, result) {
  newUser
    .save()
    .then((res) => {
      console.log('created user: ', { id: res.id, ...newUser });
      result(null, { id: res.id, ...newUser });
    })
    .catch((err) => {
      console.log('error: ', err);
      result(err, null);
    });
}
export function getAll(result) {
  console.log(result);
  User.find()
    .then((res) => {
      console.log('users: ', res);
      result(null, res);
    })
    .catch((err) => {
      console.log('error: ', err);
      result(null, err);
    });
}
export function findById(id, result) {
  console.log(id);
  User.findById(id)
    .then((res) => {
      if (res != null) {
        console.log('found user: ', res);
        result(null, res);
      } else {
        console.log('not found user: ', id);
        result({ kind: 'not_found' }, null);
      }
    })
    .catch((err) => {
      console.log('error: ', err);
      result(null, err);
    });
}
export function updateById(id, body, result) {
  User.updateOne({ _id: id }, body)
    .then((res) => {
      console.log(res);
      if (res.matchedCount > 0) {
        console.log('updated user: ', { id: id, ...body });
        result(null, { id: id, ...body });
      } else {
        console.log('not found user: ', id);
        result({ kind: 'not_found' }, null);
      }
    })
    .catch((err) => {
      console.log('error: ', err);
      result(null, err);
    });
}
export function remove(id, result) {
  User.deleteOne({ _id: id })
    .then((res) => {
      if (res.deletedCount > 0) {
        console.log('deleted User with id: ', id);
        result(null, res);
      } else {
        console.log('not found user: ', id);
        result({ kind: 'not_found' }, null);
      }
    })
    .catch((err) => {
      console.log('error: ', err);
      result(null, err);
    });
}

export function login(userInfo, result) {
  User.findOne(userInfo)
    .then((res) => {
      console.log(res);
      if (res != null) {
        console.log('User login: ', res);
        if (userInfo.access_token == null) {
          userInfo.access_token = md5(`${new Date().getTime()}${userInfo.username}`);
          updateById(res._id, userInfo, () => {});
        }
        result(null, { access_token: userInfo.access_token });
      } else {
        console.log('not found user: ', userInfo);
        result({ kind: 'not_found' }, null);
      }
    })
    .catch((err) => {
      console.log('error: ', err);
      result(null, err);
    });
}
