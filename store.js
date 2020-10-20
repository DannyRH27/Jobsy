const store = {};

class UserStore {
  constructor(userId) {
    this.userId = userId
    this.visited = new Set(),
    this.history = []
  }

  getVisited() {
    return this.visited
  }
  
  getHistory() {
    return this.history
  }
  
  visit(entry) {
    this.history.push(entry)
    this.visited.add(entry)
  }
  
  lastVisited() {
    // this returns "home" if you can't go back anymore
    if (this.history.length) this.history.pop()
    return this.history.length ? this.history[this.history.length - 1] : "home"
  }
  
  isVisited(entry) {
    return this.visited.has(entry)
  }
}

const createUser = (userId) => {
  store[userId] = new UserStore(userId)
}

const getStore = () => {
  return store;
}

const getUserStore = (userId) => {
  return store[userId];
}

module.exports = {
  createUser,
  getStore,
  getUserStore
};
