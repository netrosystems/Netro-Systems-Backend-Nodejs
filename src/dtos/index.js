// dtos/index.js

const {
  AdminLoginDTO,
  AdminRegisterDTO,
  AdminFetchDTO,
  AdminUpdateDTO,
  AdminDeleteDTO,
} = require("./AdminDTO");
const { AuthDTO } = require("./AuthDTO");
const {
  GroupChatDTO,
  GroupFetchDTO,
  ChatFetchDTO,
  IndividualChatFetchDTO,
  GroupChatFetchDTO,
  ClubChatFetchDTO,
  EventChatFetchDTO,
} = require("./ChatDTO");
const { GroupDTO, GroupGetDTO } = require("./GroupDTO");
const { NotificationFetchDTO } = require("./NotificationDTO");
const {
  UserLoginDTO,
  UserRegisterDTO,
  UserFetchDTO,
  UserFetchWithFriendshipStatusDTO,
  UserUpdateDTO,
  UserDeleteDTO,
  UserFriendlistDTO,
  UserPostDTO,
  UserJobDTO,
  UserGroupDTO,
  UserEventDTO,
  UserClubDTO,
  UserChatDTO,
  UserMeetingDTO,
  UserLastChatDTO,
} = require("./UserDTO");

module.exports = {
  AdminLoginDTO,
  AdminRegisterDTO,
  AdminFetchDTO,
  AdminUpdateDTO,
  AdminDeleteDTO,
  AuthDTO,
  GroupChatDTO,
  GroupFetchDTO,
  ChatFetchDTO,
  IndividualChatFetchDTO,
  GroupChatFetchDTO,
  ClubChatFetchDTO,
  EventChatFetchDTO,
  GroupDTO,
  GroupGetDTO,
  NotificationFetchDTO,
  UserLoginDTO,
  UserRegisterDTO,
  UserFetchDTO,
  UserFetchWithFriendshipStatusDTO,
  UserUpdateDTO,
  UserDeleteDTO,
  UserFriendlistDTO,
  UserPostDTO,
  UserJobDTO,
  UserGroupDTO,
  UserEventDTO,
  UserClubDTO,
  UserChatDTO,
  UserMeetingDTO,
  UserLastChatDTO,
};
