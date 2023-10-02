export const typeDefs = `#graphql
  scalar Date

  type Pagination {
    pageSize: Int!
    pageNumber: Int!
  }
  
  input PaginationInput {
    pageSize: Int
    pageNumber: Int
  }
  
  enum SortType {
    ASC
    DESC
  }
  
  enum SortField {
    id
    createdAt
    updatedAt
    name
  }
  
  type Sorting {
    type: SortType!
    field: SortField!
  }
  
  input SortingInput {
    type: SortType
    field: SortField
  }
  
  type ResponsePagination {
    pageSize: Int!
    pageNumber: Int!
    total: Int!
  }
  
  type AuthResult {
    token: String!
  }
  
  input SignUpBody {
    email: String!
    password: String!
    commandId: String!
  }
  
  input SignInBody {
    email: String!
    password: String!
  }
  
  input ChangePasswordBody {
    password: String!
    newPassword: String!
  }
  
  type ChangePasswordResult {
    success: Boolean!
  }
  
  input UpdateProfileBody {
    name: String!
  }
  
  type Profile {
    id: ID!
    nickname: String!
    email: String!
    signUpDate: Date!
  }
  
  type User {
    id: ID!
    nickname: String!
  }
  
  type Category {
    id: ID!
    name: String!
    photo: String
    createdAt: String!
    updatedAt: String!
  }
  
  input CategoryAddInput {
    name: String!
  }
  
  input CategoryUpdateInput {
    name: String!
  }
  
  input CategoryGetManyInput {
    name: String
    ids: [String!]
    pagination: PaginationInput
    sorting: SortingInput
  }
  
  input ProductAddInput {
    name: String!
    photo: String
    desc: String
    price: Float!
    categoryId: String!
  }
  
  input ProductUpdateInput {
    name: String!
    photo: String
    desc: String
    price: Float!
    categoryId: String!
  }
  
  input ProductGetManyInput {
    name: String
    ids: [String!]
    pagination: PaginationInput
    sorting: SortingInput
  }
  
  input OperationAddInput {
    name: String!
    desc: String
    amount: Float!
    categoryId: String!
  }
  
  input OperationUpdateInput {
    name: String!
    desc: String
    amount: Float!
    categoryId: String!
  }
  
  input OperationGetManyInput {
    name: String
    ids: [String!]
    pagination: PaginationInput
    sorting: SortingInput
  }
  
  input ProductInput {
    id: ID!
    quantity: Int!
  }
  
  input OrderAddInput {
    products: [ProductInput!]!
    userId: String!
    status: OrderStatus!
  }
  
  input OrderUpdateInput {
    products: [ProductInput!]!
    userId: String!
    status: OrderStatus!
  }
  
  input OrderGetManyInput {
    ids: [String!]
    productIds: [String!]
    userId: String
    status: OrderStatus
    pagination: PaginationInput
    sorting: SortingInput
  }
  
  type StandardParams {
    id: ID!
  }
  
  type Product {
    id: ID!
    name: String!
    photo: String
    desc: String
    createdAt: String!
    updatedAt: String!
    oldPrice: Float
    price: Float!
    category: Category!
  }
  
  type Cost {
    id: ID!
    name: String!
    desc: String
    createdAt: String!
    updatedAt: String!
    amount: Float!
    category: Category!
    type: String!
  }
  
  type Profit {
    id: ID!
    name: String!
    desc: String
    createdAt: String!
    updatedAt: String!
    amount: Float!
    category: Category!
    type: String!
  }
  
  union Operation = Profit | Cost
  
  enum OrderStatus {
    PendingConfirmation
    Processing
    Packaging
    WaitingForDelivery
    InTransit
    Delivered
    ReturnRequested
    OrderCancelled
  }
  
  type OrderProduct {
    id: ID!
    product: Product!
    quantity: Int!
  }
  
  type Order {
    id: ID!
    products: [OrderProduct!]!
    user: User!
    status: OrderStatus!
    createdAt: String!
    updatedAt: String!
  }


  input ChangePasswordInput {
    password: String!
    newPassword: String!
  }

  input UpdateProfileInput {
    nickname: String!
  }

  type AuthResult {
    token: String!
  }

  type ResetPassword {
    success: Boolean!
  }

  type ProfilePasswordMutations {
    change(input: ChangePasswordInput!): ResetPassword!
  }

  type ProfileMutations {
    signup(nickname: String!, password: String!): AuthResult!
    signin(nickname: String!, password: String!): AuthResult!
    update(input: UpdateProfileInput!): Profile!
    password: ProfilePasswordMutations
  }

  type Query {
    profile: Profile
  }

  type Mutation {
    profile: ProfileMutations
  }
`;