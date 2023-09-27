import * as mongoose from 'mongoose';
import { Document, Model } from 'mongoose';
import { generateHash, isValidCode, isValidNickname } from './helpers';
import { Profile } from '../../graphql.types';
import { pubsub, pubsubKeys } from '../../graphql/pubsub';
import { prepareUser } from '../helpers/prepareUser';
import { addOnlineUser, removeOnlineUser } from '../../graphql/onlineUsers';

export type UserMain = Profile & {
  password: string;
};

export type UserClient = Pick<UserMain, 'nickname'>;

export type UserMethods = {
  generateHash: (password: string) => Promise<string>;
  isRightPassword: (password: string) => boolean;
};

export type UserNative = UserMain & UserMethods;

export type UserDocument = Document & UserNative;

export type UserType = Model<UserDocument>;

export const UserSchema = new mongoose.Schema<UserDocument>({
  nickname: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: isValidNickname,
      message: (props): string => `"${props.value}" is not valid nickname`,
    },
  },
  password: {
    required: true,
    type: String,
  },
  signUpDate: {
    required: true,
    type: Date,
    default: () => new Date(),
  },
});

const methods: UserMethods = {
  generateHash,
  isRightPassword(password: string) {
    return isValidCode(password, this.password);
  },
};

Object.assign(UserSchema.methods, methods);

UserSchema.post('save', (doc) => {
  addOnlineUser(doc);
  pubsub.publish(pubsubKeys.updatedUser, { updatedUser: prepareUser(doc) });
});

const removeHook = (doc: UserDocument) => {
  removeOnlineUser(doc);
  pubsub.publish(pubsubKeys.removedUser, { removedUser: prepareUser(doc) });
};

UserSchema.post('deleteOne', removeHook);

UserSchema.post('findOneAndRemove', removeHook);

UserSchema.post('findOneAndDelete', removeHook);

export const UserModel = mongoose.model('User', UserSchema);
