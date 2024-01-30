export const typeDefs = `#graphql
  scalar Date


  input DateRange {
    # от
    gte: Date
    # до
    lte: Date
  }


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
    date
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
    profile: Profile!
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
    name: String
    email: String!
    signUpDate: Date!
  }
  
  type User {
    id: ID!
    name: String
  }
  
  type Category {
    id: ID!
    name: String!
    photo: String
    createdAt: Date!
    updatedAt: Date!
  }
  
  input CategoryAddInput {
    name: String!
    photo: String
  }
  
  input CategoryUpdateInput {
    name: String!
    photo: String
  }
  
  input CategoryGetManyInput {
    name: String
    ids: [String!]
    pagination: PaginationInput
    sorting: SortingInput
    createdAt: DateRange
    updatedAt: DateRange
  }
  
  input ProductAddInput {
    name: String!
    photo: String
    desc: String
    price: Float!
    categoryId: String!
  }
  
  input ProductUpdateInput {
    name: String
    photo: String
    desc: String
    price: Float
    oldPrice: Float
    categoryId: String
  }
  
  input ProductGetManyInput {
    name: String
    ids: [String!]
    categoryIds: [String!]
    pagination: PaginationInput
    sorting: SortingInput
    createdAt: DateRange
    updatedAt: DateRange
  }

enum OperationType {
    Cost
    Profit
}
  
  input OperationAddInput {
    name: String!
    desc: String
    amount: Float!
    date: Date!
    type: OperationType!
    categoryId: String!
  }
  
  input OperationUpdateInput {
    name: String
    desc: String
    amount: Float
    date: Date
    type: OperationType
    categoryId: String
  }
  
  input OperationGetManyInput {
    type: OperationType
    name: String
    ids: [String!]
    categoryIds: [String!]
    pagination: PaginationInput
    sorting: SortingInput
    date: DateRange
    createdAt: DateRange
    updatedAt: DateRange
  }
  
  input ProductInput {
    id: ID!
    quantity: Int!
  }
  
  input OrderAddInput {
    products: [ProductInput!]!
    status: OrderStatus
  }
  
  input OrderUpdateInput {
    products: [ProductInput!]
    status: OrderStatus
  }
  
  input OrderGetManyInput {
    ids: [String!]
    productIds: [String!]
    userId: String
    status: OrderStatus
    pagination: PaginationInput
    sorting: SortingInput
    createdAt: DateRange
    updatedAt: DateRange
  }
  
  type StandardParams {
    id: ID!
  }
  
  type Product {
    id: ID!
    name: String!
    photo: String
    desc: String
    createdAt: Date!
    updatedAt: Date!
    oldPrice: Float
    price: Float!
    category: Category!
  }
  
  type Cost {
    id: ID!
    name: String!
    desc: String
    date: Date!
    createdAt: Date!
    updatedAt: Date!
    amount: Float!
    category: Category!
    type: String!
  }
  
  type Profit {
    id: ID!
    name: String!
    desc: String
    date: Date!
    createdAt: Date!
    updatedAt: Date!
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
    _id: ID!
    product: Product!
    quantity: Int!
  }
  
  type Order {
    id: ID!
    products: [OrderProduct!]!
    user: User!
    status: OrderStatus!
    createdAt: Date!
    updatedAt: Date!
  }


  input ChangePasswordInput {
    password: String!
    newPassword: String!
  }

  input UpdateProfileInput {
    name: String!
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
    signup(email: String!, password: String!, commandId: String!): AuthResult!
    signin(email: String!, password: String!): AuthResult!
    update(input: UpdateProfileInput!): Profile!
    password: ProfilePasswordMutations
  }

  type CategoriesResponse {
    data: [Category]
    pagination: ResponsePagination!
    sorting: Sorting!
  }

  type ProductsResponse {
    data: [Product]
    pagination: ResponsePagination!
    sorting: Sorting!
  }

  type OperationsResponse {
    data: [Operation]
    pagination: ResponsePagination!
    sorting: Sorting!
  }

  type OrdersResponse {
    data: [Order]
    pagination: ResponsePagination!
    sorting: Sorting!
  }

  type CategoryQueries {
    getOne(id: ID!): Category
    getMany(input: CategoryGetManyInput): CategoriesResponse!
  }

  type ProductQueries {
    getOne(id: ID!): Product
    getMany(input: ProductGetManyInput): ProductsResponse!
  }

  type OperationQueries {
    getOne(id: ID!): Operation
    getMany(input: OperationGetManyInput): OperationsResponse!
  }

  type OrderQueries {
    getOne(id: ID!): Order
    getMany(input: OrderGetManyInput): OrdersResponse!
  }

  type Query {
    profile: Profile
    categories: CategoryQueries!
    products: ProductQueries!
    operations: OperationQueries!
    orders: OrderQueries!
  }

  type CategoryMutations {
    add(input: CategoryAddInput!): Category!
    put(id: ID!, input: CategoryUpdateInput!): Category!
    patch(id: ID!, input: CategoryUpdateInput!): Category!
    remove(id: ID!): Category!
  }

  type ProductMutations {
    add(input: ProductAddInput!): Product!
    put(id: ID!, input: ProductUpdateInput!): Product!
    patch(id: ID!, input: ProductUpdateInput!): Product!
    remove(id: ID!): Product!
  }

  type OperationMutations {
    add(input: OperationAddInput!): Operation!
    put(id: ID!, input: OperationUpdateInput!): Operation!
    patch(id: ID!, input: OperationUpdateInput!): Operation!
    remove(id: ID!): Operation!
  }

  type OrderMutations {
    add(input: OrderAddInput!): Order!
    put(id: ID!, input: OrderUpdateInput!): Order!
    patch(id: ID!, input: OrderUpdateInput!): Order!
    remove(id: ID!): Order!
  }

  type Mutation {
    profile: ProfileMutations
    categories: CategoryMutations!
    products: ProductMutations!
    operations: OperationMutations!
    orders: OrderMutations!
  }
`;
