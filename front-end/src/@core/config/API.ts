export const API = {
  HOST: "http://localhost:3000",
  LOGIN: "",
  ROLES: {
    ADMIN: 'Admin',
    USER: 'User'
  },
  SEARCH: {
    BASE: "api/search"
  },
  USER: {
    BASE: "api/user",
    UPDATE: 'update'
  },
  CATEGORY: {
    BASE: "api/category",
    TYPE: "query"
  },
  PRODUCT: {
    BASE: "api/product",
    FEEDBACK: "feedback",
    UNLINK: "unlink",
    GET_BY_CATEGORY: "category",
    RELATED_PRODUCT: "filter"
  },
  ORDER: {
    BASE: "api/order"
  }

}
