export const typeDefs = `#graphql
  scalar Date

  type User {
    id: ID!
    nickname: String!
    signUpDate: Date!
  }

  type Profile {
    id: ID!
    nickname: String!
    signUpDate: Date!
  }

  enum AnimalType {
    Cat
    Dog
    Bird
  }

  enum DiseaseType {
    cold
    broken
    parasites
    stomach
  }

  input DiseaseInput { 
    type: DiseaseType!
    name: String!
    desc: String
  }

  type Disease { 
    id: ID!
    type: DiseaseType!
    name: String!
    desc: String
  }

  input MedicineInput {
    name: String!
    heal: [DiseaseType!]!
  }

  type Medicine {
    id: ID!
    name: String!
    heal: [DiseaseType!]!
  }

  type Cat {
    id: ID!
    name: String!
    comment: String
    age: Int
    doctor: User
    diseases: [Disease]!
    updatedAt: Date
  }

  type Dog {
    id: ID!
    name: String!
    comment: String
    age: Int
    doctor: User
    diseases: [Disease]!
    updatedAt: Date
  }

  type Bird {
    id: ID!
    name: String!
    comment: String
    age: Int
    doctor: User
    diseases: [Disease]!
    updatedAt: Date
  }

  union Animal = Bird | Dog | Cat

  input AnimalAddInput {
    doctorId: ID
    diseaseIds: [ID!]
    name: String!
    comment: String
    age: Int
    type: AnimalType!
  }

  input AnimalUpdateInput {
    doctorId: ID
    diseaseIds: [ID!]
    name: String
    comment: String
    age: Int
    type: AnimalType
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
    animals: [Animal!]!
    users: [User!]!
    medicines: [Medicine!]!
    diseases: [Disease!]!
  }

  type Subscription {
    updatedAnimal: Animal!
    updatedUser: User!
    updatedMedicine: Medicine!
    updatedDisease: Disease!
    removedAnimal: Animal!
    removedUser: User!
    removedMedicine: Medicine!
    removedDisease: Disease!
  }

  type Mutation {
    profile: ProfileMutations
    addAnimal(input: AnimalAddInput!): Animal!
    updateAnimal(id: ID!, input: AnimalUpdateInput!, partial: Boolean): Animal!
    addMedicine(input: MedicineInput!): Medicine!
    updateMedicine(id: ID!, input: MedicineInput!): Medicine!
    addDisease(input: DiseaseInput!): Disease!
    updateDisease(id: ID!, input: DiseaseInput!): Disease!
  }
`;
