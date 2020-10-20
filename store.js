const store = {};

class BasicUserStore {
  constructor(userId) {
    this.userId = userId
    this.visited = new Set(),
    this.history = []
  }
}

const createUser = (userId) => {
  store[userId] = new BasicUserStore(userId)
}
const getStore = () => {
  return store;
}
const getUserStore = (userId) => {
  return store[userId];
}
const getVisited = (userId) => {
  return store[userId].visited
}
const getHistory = (userId) => {
  return store[userId].history
}
const visit = (userId, entry) => {
  store[userId].history.push(entry)
  store[userId].visited.add(entry)
}
const goBack = (userId) => {
  return store[userId].history.pop()
}
const isVisited = (userId, entry) => {
  return store[userId].visited.has(entry)
}

module.exports = {
  createUser,
  getStore,
  getUserStore,
  getVisited,
  getHistory,
  visit,
  goBack,
  isVisited
};
