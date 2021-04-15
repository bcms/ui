export const defaultEntryMutations = {
  set<Item extends { _id: string }>(
    srcItems: Item[],
    items: Item | Item[]
  ): void {
    if (items instanceof Array) {
      for (let i = 0; i < items.length; i++) {
        let found = false;
        for (let j = 0; j < srcItems.length; j++) {
          if (srcItems[j]._id === items[i]._id) {
            found = true;
            srcItems[j] = items[i];
            break;
          }
        }
        if (!found) {
          srcItems.push(items[i]);
        }
      }
    } else {
      let found = false;
      for (let i = 0; i < srcItems.length; i++) {
        if (srcItems[i]._id === items._id) {
          found = true;
          srcItems[i] = items;
          break;
        }
      }
      if (!found) {
        srcItems.push(items);
      }
    }
  },
  update<Item extends { _id: string }>(
    srcItems: Item[],
    items: Item | Item[]
  ): void {
    if (items instanceof Array) {
      for (let i = 0; i < items.length; i++) {
        for (let j = 0; j < srcItems.length; j++) {
          if (srcItems[j]._id === items[i]._id) {
            srcItems[j] = items[i];
            break;
          }
        }
      }
    } else {
      for (let i = 0; i < srcItems.length; i++) {
        if (srcItems[i]._id === items._id) {
          srcItems[i] = items;
          break;
        }
      }
    }
  },
  remove<Item extends { _id: string }>(
    srcItems: Item[],
    items: Item | Item[]
  ): void {
    if (items instanceof Array) {
      const removeIds = items.map((e) => e._id);
      while (removeIds.length > 0) {
        const id = removeIds.pop();
        for (let i = 0; i < srcItems.length; i++) {
          if (srcItems[i]._id === id) {
            srcItems.splice(i, 1);
            break;
          }
        }
      }
    } else {
      for (let i = 0; i < srcItems.length; i++) {
        if (srcItems[i]._id === items._id) {
          srcItems.splice(i, 1);
          break;
        }
      }
    }
  },
};

export const defaultEntryGetters = {
  find<Item extends { _id: string }>(
    items: Item[],
    query: (item: Item) => boolean
  ): Item[] {
    const output: Item[] = [];
    for (let i = 0; i < items.length; i++) {
      if (query(items[i])) {
        output.push(items[i]);
      }
    }
    return output;
  },
  findOne<Item extends { _id: string }>(
    items: Item[],
    query: (item: Item) => boolean
  ): Item | undefined {
    for (let i = 0; i < items.length; i++) {
      if (query(items[i])) {
        return items[i];
      }
    }
  },
};
