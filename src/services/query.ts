export type QueryServicePrototype = {
  get(): { [key: string]: string };
}

function queryService(): QueryServicePrototype {
  return {
    get() {
      const queries = {};
      const queryString = window.location.href.split('?');
      if (queryString.length === 2) {
        const queryParts = queryString[1].split('&');
        for (var i in queryParts) {
          const query = queryParts[i].split('=');
          if (query.length === 2) {
            queries[query[0]] = decodeURIComponent(query[1]);
          } else {
            console.error('Bad query: ' + queryParts[i]);
          }
        }
      }
      return queries;
    },
  };
}

export const QueryService = queryService();
