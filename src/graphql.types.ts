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

export type Animal = Bird | Cat | Dog;

export type AnimalAddInput = {
  age?: InputMaybe<Scalars['Int']['input']>;
  comment?: InputMaybe<Scalars['String']['input']>;
  diseaseIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  doctorId?: InputMaybe<Scalars['ID']['input']>;
  name: Scalars['String']['input'];
  type: AnimalType;
};

export enum AnimalType {
  Bird = 'Bird',
  Cat = 'Cat',
  Dog = 'Dog'
}

export type AnimalUpdateInput = {
  age?: InputMaybe<Scalars['Int']['input']>;
  comment?: InputMaybe<Scalars['String']['input']>;
  diseaseIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  doctorId?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<AnimalType>;
};

export type AuthResult = {
  __typename?: 'AuthResult';
  token: Scalars['String']['output'];
};

export type Bird = {
  __typename?: 'Bird';
  age?: Maybe<Scalars['Int']['output']>;
  comment?: Maybe<Scalars['String']['output']>;
  diseases: Array<Maybe<Disease>>;
  doctor?: Maybe<User>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export type Cat = {
  __typename?: 'Cat';
  age?: Maybe<Scalars['Int']['output']>;
  comment?: Maybe<Scalars['String']['output']>;
  diseases: Array<Maybe<Disease>>;
  doctor?: Maybe<User>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export type ChangePasswordInput = {
  newPassword: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Disease = {
  __typename?: 'Disease';
  desc?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  type: DiseaseType;
};

export type DiseaseInput = {
  desc?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  type: DiseaseType;
};

export enum DiseaseType {
  Broken = 'broken',
  Cold = 'cold',
  Parasites = 'parasites',
  Stomach = 'stomach'
}

export type Dog = {
  __typename?: 'Dog';
  age?: Maybe<Scalars['Int']['output']>;
  comment?: Maybe<Scalars['String']['output']>;
  diseases: Array<Maybe<Disease>>;
  doctor?: Maybe<User>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export type Medicine = {
  __typename?: 'Medicine';
  heal: Array<DiseaseType>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type MedicineInput = {
  heal: Array<DiseaseType>;
  name: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addAnimal: Animal;
  addDisease: Disease;
  addMedicine: Medicine;
  profile?: Maybe<ProfileMutations>;
  updateAnimal: Animal;
  updateDisease: Disease;
  updateMedicine: Medicine;
};


export type MutationAddAnimalArgs = {
  input: AnimalAddInput;
};


export type MutationAddDiseaseArgs = {
  input: DiseaseInput;
};


export type MutationAddMedicineArgs = {
  input: MedicineInput;
};


export type MutationUpdateAnimalArgs = {
  id: Scalars['ID']['input'];
  input: AnimalUpdateInput;
  partial?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationUpdateDiseaseArgs = {
  id: Scalars['ID']['input'];
  input: DiseaseInput;
};


export type MutationUpdateMedicineArgs = {
  id: Scalars['ID']['input'];
  input: MedicineInput;
};

export type Profile = {
  __typename?: 'Profile';
  id: Scalars['ID']['output'];
  nickname: Scalars['String']['output'];
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
  nickname: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type ProfileMutationsSignupArgs = {
  nickname: Scalars['String']['input'];
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

export type Query = {
  __typename?: 'Query';
  animals: Array<Animal>;
  diseases: Array<Disease>;
  medicines: Array<Medicine>;
  profile?: Maybe<Profile>;
  users: Array<User>;
};

export type ResetPassword = {
  __typename?: 'ResetPassword';
  success: Scalars['Boolean']['output'];
};

export type Subscription = {
  __typename?: 'Subscription';
  removedAnimal: Animal;
  removedDisease: Disease;
  removedMedicine: Medicine;
  removedUser: User;
  updatedAnimal: Animal;
  updatedDisease: Disease;
  updatedMedicine: Medicine;
  updatedUser: User;
};

export type UpdateProfileInput = {
  nickname: Scalars['String']['input'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID']['output'];
  nickname: Scalars['String']['output'];
  signUpDate: Scalars['Date']['output'];
};
