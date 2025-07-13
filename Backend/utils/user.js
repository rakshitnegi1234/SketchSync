export const users = [];


export const addUser = ({ name, userId, roomId, host, presenter,  socketId}) => {
  const user = { name, userId, roomId, host, presenter,socketId };
  users.push(user);
  return users.filter((user) => user.roomId === roomId);
};


export const removeUser = (id) => {
  const index = users.findIndex((user) => user.userId === id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};


export const getUser = (id) => {
  return users.find((user) => user.socketId=== id);
}

export const getUsersInRoom = (roomId) => {
  return users.filter((user) => user.roomId === roomId);
}


