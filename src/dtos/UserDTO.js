// dtos/UserDTO.js

class UserLoginDTO {
  constructor(user) {
    this._id = user?._id || null;
    this.username = user?.username || "";
    this.email = user?.email || "";
    this.fullName = user?.fullName || "";
    this.birthDay = user?.birthDay || "";
    this.gender = user?.gender || "";
    this.bio = user?.bio || "";
    this.hometown = user?.hometown || "";
    this.currentTown = user?.currentTown || "";
    this.currentLocation = user?.currentLocation || {};
    this.yearsOfMoving = user?.yearsOfMoving || "";
    this.occupation = user?.occupation || "";
    this.profileImage = user?.profileImage || "";
    this.coverImage = user?.coverImage || "";
    this.hobbyList = user?.hobbyList || [];
    this.friendsList = user?.friendsList?.map((friend) => ({
      userId: new UserFriendlistDTO(friend?.userId),
      status: friend?.status,
    }));
  }
}

class UserRegisterDTO {
  constructor(user) {
    this._id = user?._id || null;
    this.username = user?.username || "";
    this.email = user?.email || "";
    this.fullName = user?.fullName || "";
    this.birthDay = user?.birthDay || "";
    this.gender = user?.gender || "";
    this.bio = user?.bio || "";
    this.hometown = user?.hometown || "";
    this.currentTown = user?.currentTown || "";
    this.currentLocation = user?.currentLocation || {};
    this.yearsOfMoving = user?.yearsOfMoving || "";
    this.occupation = user?.occupation || "";
    this.profileImage = user?.profileImage || "";
    this.coverImage = user?.coverImage || "";
    this.hobbyList = user?.hobbyList || [];
    this.friendsList = user?.friendsList?.map((friend) => ({
      ...new UserFriendlistDTO(friend?.userId),
      status: friend?.status,
    }));
  }
}

class UserFetchDTO {
  constructor(user) {
    this._id = user?._id || null;
    this.username = user?.username || "";
    this.email = user?.email || "";
    this.fullName = user?.fullName || "";
    this.birthDay = user?.birthDay || "";
    this.gender = user?.gender || "";
    this.bio = user?.bio || "";
    this.hometown = user?.hometown || "";
    this.currentTown = user?.currentTown || "";
    this.currentLocation = user?.currentLocation || {};
    this.yearsOfMoving = user?.yearsOfMoving || "";
    this.occupation = user?.occupation || "";
    this.profileImage = user?.profileImage || "";
    this.coverImage = user?.coverImage || "";
    this.hobbyList = user?.hobbyList || [];
    this.friendsList = user?.friendsList?.map((friend) => ({
      ...new UserFriendlistDTO(friend?.userId),
      status: friend?.status,
    }));
  }
}

class UserUpdateDTO {
  constructor(user) {
    this._id = user?._id || null;
    this.username = user?.username || "";
    this.email = user?.email || "";
    this.fullName = user?.fullName || "";
    this.birthDay = user?.birthDay || "";
    this.gender = user?.gender || "";
    this.bio = user?.bio || "";
    this.hometown = user?.hometown || "";
    this.currentTown = user?.currentTown || "";
    this.currentLocation = user?.currentLocation || {};
    this.yearsOfMoving = user?.yearsOfMoving || "";
    this.occupation = user?.occupation || "";
    this.profileImage = user?.profileImage || "";
    this.coverImage = user?.coverImage || "";
    this.hobbyList = user?.hobbyList || [];
    this.friendsList = user?.friendsList?.map((friend) => ({
      ...new UserFriendlistDTO(friend?.userId),
      status: friend?.status,
    }));
  }
}

class UserDeleteDTO {
  constructor(user) {
    this._id = user?._id || null;
    this.fullName = user?.fullName || "";
    this.email = user?.email || "";
  }
}

module.exports = {
  UserLoginDTO,
  UserRegisterDTO,
  UserFetchDTO,
  UserUpdateDTO,
  UserDeleteDTO,
};
