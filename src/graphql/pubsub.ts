import { PubSub } from 'graphql-subscriptions';

export const pubsub = new PubSub();

export const pubsubKeys = {
  updatedAnimal: 'updatedAnimal',
  updatedUser: 'updatedUser',
  updatedMedicine: 'updatedMedicine',
  updatedDisease: 'updatedDisease',

  removedAnimal: 'removedAnimal',
  removedUser: 'removedUser',
  removedMedicine: 'removedMedicine',
  removedDisease: 'removedDisease',
};
