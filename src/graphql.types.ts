export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: any; output: any; }
};

export type AuthResult = {
  __typename?: 'AuthResult';
  token: Scalars['String']['output'];
};

export type CategoriesResponse = {
  __typename?: 'CategoriesResponse';
  data?: Maybe<Array<Maybe<Category>>>;
  pagination: ResponsePagination;
  sorting: Sorting;
};

export type Category = {
  __typename?: 'Category';
  createdAt: Scalars['Date']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  photo?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['Date']['output'];
};

export type CategoryAddInput = {
  name: Scalars['String']['input'];
  photo?: InputMaybe<Scalars['String']['input']>;
};

export type CategoryGetManyInput = {
  ids?: InputMaybe<Array<Scalars['String']['input']>>;
  name?: InputMaybe<Scalars['String']['input']>;
  pagination?: InputMaybe<PaginationInput>;
  sorting?: InputMaybe<SortingInput>;
};

export type CategoryMutations = {
  __typename?: 'CategoryMutations';
  add: Category;
  patch: Category;
  put: Category;
  remove: Category;
};


export type CategoryMutationsAddArgs = {
  input: CategoryAddInput;
};


export type CategoryMutationsPatchArgs = {
  id: Scalars['ID']['input'];
  input: CategoryUpdateInput;
};


export type CategoryMutationsPutArgs = {
  id: Scalars['ID']['input'];
  input: CategoryUpdateInput;
};


export type CategoryMutationsRemoveArgs = {
  id: Scalars['ID']['input'];
};

export type CategoryQueries = {
  __typename?: 'CategoryQueries';
  getMany: CategoriesResponse;
  getOne?: Maybe<Category>;
};


export type CategoryQueriesGetManyArgs = {
  input?: InputMaybe<CategoryGetManyInput>;
};


export type CategoryQueriesGetOneArgs = {
  id: Scalars['ID']['input'];
};

export type CategoryUpdateInput = {
  name: Scalars['String']['input'];
  photo?: InputMaybe<Scalars['String']['input']>;
};

export type ChangePasswordBody = {
  newPassword: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type ChangePasswordInput = {
  newPassword: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type ChangePasswordResult = {
  __typename?: 'ChangePasswordResult';
  success: Scalars['Boolean']['output'];
};

export type Cost = {
  __typename?: 'Cost';
  amount: Scalars['Float']['output'];
  category: Category;
  createdAt: Scalars['Date']['output'];
  desc?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  type: Scalars['String']['output'];
  updatedAt: Scalars['Date']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  categories: CategoryMutations;
  profile?: Maybe<ProfileMutations>;
};

export type Operation = Cost | Profit;

export type OperationAddInput = {
  amount: Scalars['Float']['input'];
  categoryId: Scalars['String']['input'];
  desc?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type OperationGetManyInput = {
  ids?: InputMaybe<Array<Scalars['String']['input']>>;
  name?: InputMaybe<Scalars['String']['input']>;
  pagination?: InputMaybe<PaginationInput>;
  sorting?: InputMaybe<SortingInput>;
};

export type OperationUpdateInput = {
  amount: Scalars['Float']['input'];
  categoryId: Scalars['String']['input'];
  desc?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type Order = {
  __typename?: 'Order';
  createdAt: Scalars['Date']['output'];
  id: Scalars['ID']['output'];
  products: Array<OrderProduct>;
  status: OrderStatus;
  updatedAt: Scalars['Date']['output'];
  user: User;
};

export type OrderAddInput = {
  products: Array<ProductInput>;
  status: OrderStatus;
  userId: Scalars['String']['input'];
};

export type OrderGetManyInput = {
  ids?: InputMaybe<Array<Scalars['String']['input']>>;
  pagination?: InputMaybe<PaginationInput>;
  productIds?: InputMaybe<Array<Scalars['String']['input']>>;
  sorting?: InputMaybe<SortingInput>;
  status?: InputMaybe<OrderStatus>;
  userId?: InputMaybe<Scalars['String']['input']>;
};

export type OrderProduct = {
  __typename?: 'OrderProduct';
  id: Scalars['ID']['output'];
  product: Product;
  quantity: Scalars['Int']['output'];
};

export enum OrderStatus {
  Delivered = 'Delivered',
  InTransit = 'InTransit',
  OrderCancelled = 'OrderCancelled',
  Packaging = 'Packaging',
  PendingConfirmation = 'PendingConfirmation',
  Processing = 'Processing',
  ReturnRequested = 'ReturnRequested',
  WaitingForDelivery = 'WaitingForDelivery'
}

export type OrderUpdateInput = {
  products: Array<ProductInput>;
  status: OrderStatus;
  userId: Scalars['String']['input'];
};

export type Pagination = {
  __typename?: 'Pagination';
  pageNumber: Scalars['Int']['output'];
  pageSize: Scalars['Int']['output'];
};

export type PaginationInput = {
  pageNumber?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
};

export type Product = {
  __typename?: 'Product';
  category: Category;
  createdAt: Scalars['Date']['output'];
  desc?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  oldPrice?: Maybe<Scalars['Float']['output']>;
  photo?: Maybe<Scalars['String']['output']>;
  price: Scalars['Float']['output'];
  updatedAt: Scalars['Date']['output'];
};

export type ProductAddInput = {
  categoryId: Scalars['String']['input'];
  desc?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  photo?: InputMaybe<Scalars['String']['input']>;
  price: Scalars['Float']['input'];
};

export type ProductGetManyInput = {
  ids?: InputMaybe<Array<Scalars['String']['input']>>;
  name?: InputMaybe<Scalars['String']['input']>;
  pagination?: InputMaybe<PaginationInput>;
  sorting?: InputMaybe<SortingInput>;
};

export type ProductInput = {
  id: Scalars['ID']['input'];
  quantity: Scalars['Int']['input'];
};

export type ProductUpdateInput = {
  categoryId: Scalars['String']['input'];
  desc?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  photo?: InputMaybe<Scalars['String']['input']>;
  price: Scalars['Float']['input'];
};

export type Profile = {
  __typename?: 'Profile';
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  signUpDate: Scalars['Date']['output'];
};

export type ProfileMutations = {
  __typename?: 'ProfileMutations';
  password?: Maybe<ProfilePasswordMutations>;
  signin: AuthResult;
  signup: AuthResult;
  update: Profile;
};


export type ProfileMutationsSigninArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type ProfileMutationsSignupArgs = {
  commandId: Scalars['String']['input'];
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type ProfileMutationsUpdateArgs = {
  input: UpdateProfileInput;
};

export type ProfilePasswordMutations = {
  __typename?: 'ProfilePasswordMutations';
  change: ResetPassword;
};


export type ProfilePasswordMutationsChangeArgs = {
  input: ChangePasswordInput;
};

export type Profit = {
  __typename?: 'Profit';
  amount: Scalars['Float']['output'];
  category: Category;
  createdAt: Scalars['Date']['output'];
  desc?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  type: Scalars['String']['output'];
  updatedAt: Scalars['Date']['output'];
};

export type Query = {
  __typename?: 'Query';
  categories: CategoryQueries;
  profile?: Maybe<Profile>;
};

export type ResetPassword = {
  __typename?: 'ResetPassword';
  success: Scalars['Boolean']['output'];
};

export type ResponsePagination = {
  __typename?: 'ResponsePagination';
  pageNumber: Scalars['Int']['output'];
  pageSize: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type SignInBody = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type SignUpBody = {
  commandId: Scalars['String']['input'];
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export enum SortField {
  CreatedAt = 'createdAt',
  Id = 'id',
  Name = 'name',
  UpdatedAt = 'updatedAt'
}

export enum SortType {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type Sorting = {
  __typename?: 'Sorting';
  field: SortField;
  type: SortType;
};

export type SortingInput = {
  field?: InputMaybe<SortField>;
  type?: InputMaybe<SortType>;
};

export type StandardParams = {
  __typename?: 'StandardParams';
  id: Scalars['ID']['output'];
};

export type UpdateProfileBody = {
  name: Scalars['String']['input'];
};

export type UpdateProfileInput = {
  name: Scalars['String']['input'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};
