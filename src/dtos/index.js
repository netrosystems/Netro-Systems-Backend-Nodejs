// dtos/index.js

const {
  AdminLoginDTO,
  AdminRegisterDTO,
  AdminFetchDTO,
  AdminUpdateDTO,
  AdminDeleteDTO,
} = require("./AdminDTO");
const { AuthDTO } = require("./AuthDTO");
const { GroupDTO, GroupGetDTO } = require("./GroupDTO");
const {
  UserLoginDTO,
  UserRegisterDTO,
  UserFetchDTO,
  UserUpdateDTO,
  UserDeleteDTO,
} = require("./UserDTO");

module.exports = {
  AdminLoginDTO,
  AdminRegisterDTO,
  AdminFetchDTO,
  AdminUpdateDTO,
  AdminDeleteDTO,
  AuthDTO,
  GroupDTO,
  GroupGetDTO,
  UserLoginDTO,
  UserRegisterDTO,
  UserFetchDTO,
  UserUpdateDTO,
  UserDeleteDTO,
};
