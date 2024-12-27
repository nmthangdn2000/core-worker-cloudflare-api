export enum ERROR_MESSAGES {
  // 1001 - 1010: Auth
  UsernameAlreadyExists = 1001,
  UsernameOrPasswordIncorrect = 1002,
  OldPasswordIncorrect = 1003,
  ValidationError = 1004,
  EmailAlreadyExist = 1005,

  // 1011 - 1020: User
  UserNotFound = 1011,

  // 1021 - 1030: Category
  CategoryNotFound = 1021,

  // 1031 - 1040: Product
  ProductNotFound = 1031,

  // 1041 - 1050: Order
  OrderNotFound = 1041,
  OrderNotAllowUpdate = 1042,
  OrderNotAllowDelete = 1043,
}
