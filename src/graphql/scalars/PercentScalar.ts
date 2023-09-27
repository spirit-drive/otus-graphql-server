import { UserInputError } from 'apollo-server-express';
import { GraphQLScalarType, Kind } from 'graphql';

const checkValue = (value: unknown) => {
  if (typeof value === 'number' && 0 <= value && value <= 100) {
    return value;
  }
  throw new UserInputError('percent cant be less 0 or more 100');
};

export const PercentScalar = new GraphQLScalarType({
  name: 'Percent',
  description: 'between 0 and 100',
  parseValue: checkValue,
  serialize: checkValue,
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return checkValue(parseInt(ast.value, 10));
    }
    throw new UserInputError('percent cant be less 0 or more 100');
  },
});
