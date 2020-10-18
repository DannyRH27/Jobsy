const store = [];

module.exports = {
  getStore: () => {
    return store;
  },
  addData: (entry) => {
    if (!store.includes(entry)){
      store.push(entry);
    }  
  },
  isIncluded: (entry) => {
    return store.includes(entry)
  }
};
