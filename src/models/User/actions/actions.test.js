/**
 * @jest-environment node
 * */
import mongoose from 'mongoose';
import { signup } from './signup';
import { signin } from './signin';
import { changePassword } from './changePassword';
import { update } from './update';
import { UserModel } from '../User';
import { getCode, resetPassword } from './resetPassword';

describe('User actions', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/art-shop-test', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    mongoose.set('useFindAndModify', false);
    Object.assign(mongoose, { Promise: global.Promise });
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  describe('signup', () => {
    // Для создание записи для тестов
    // describe('create data for test', () => {
    //   it('create user for tests', async () => {
    //     await signup(
    //       undefined,
    //       { password: 'password', email: 'exist-test2@test.com', nickname: 'exist_nickname2' },
    //       undefined
    //     );
    //   });
    //   it('create user for tests', async () => {
    //     await signup(
    //       undefined,
    //       { password: 'password', email: 'exist-test@test.com', nickname: 'exist_nickname' },
    //       undefined
    //     );
    //   });
    // });

    it('invalid nickname', async () => {
      const response = await signup(
        undefined,
        { password: 'password', email: 'email@email.ru', nickname: 'n' },
        undefined
      );
      expect(response.toString()).toBe('DataBaseError: ValidationError: nickname: "n" is not valid nickname');
    });

    it('nickname is exist', async () => {
      const response = await signup(
        undefined,
        { password: 'password', email: 'email@email.ru', nickname: 'exist_nickname' },
        undefined
      );
      expect(response.toString()).toBe('AccountAlreadyExistError: User with nickname "exist_nickname" already exist');
    });

    it('email is exist', async () => {
      const response = await signup(
        undefined,
        { password: 'password', email: 'exist-test@test.com', nickname: 'nickname' },
        undefined
      );
      expect(response.toString()).toBe('AccountAlreadyExistError: User with email "exist-test@test.com" already exist');
    });

    it('invalid email', async () => {
      const response = await signup(
        undefined,
        { password: 'password', email: 'exist-testtest.com', nickname: 'nickname' },
        undefined
      );
      expect(response.toString()).toBe(
        'DataBaseError: ValidationError: email: "exist-testtest.com" is not valid email'
      );
    });

    it('invalid password', async () => {
      const response = await signup(
        undefined,
        { password: 'pass', email: 'test@test.com', nickname: 'nickname' },
        undefined
      );
      expect(response.toString()).toBe('InvalidPasswordError: password "pass" is not valid');
    });

    it('success', async () => {
      const response = await signup(
        undefined,
        { password: 'password', email: 'test@test.com', nickname: 'nickname' },
        undefined
      );
      expect(response.token).toBeDefined();
      expect(response.user).toBeDefined();
      await UserModel.findByIdAndDelete(response.user._id);
    });
  });

  describe('signin', () => {
    it('incorrect email', async () => {
      const response = await signin(undefined, { password: 'password', email: 'test@test.com' }, undefined);
      expect(response.toString()).toBe('IncorrectPasswordOrEmailError: User not found or invalid password');
    });

    it('incorrect password', async () => {
      const response = await signin(undefined, { password: 'passwo', email: 'exist-test@test.com' }, undefined);
      expect(response.toString()).toBe('IncorrectPasswordOrEmailError: User not found or invalid password');
    });

    it('success', async () => {
      const response = await signin(undefined, { password: 'password', email: 'exist-test@test.com' }, undefined);
      expect(response.token).toBeDefined();
      expect(response.user).toBeDefined();
    });
  });

  describe('changePassword', () => {
    it('token is required', async () => {
      const response = await changePassword(undefined, { password: 'password', newPassword: 'new' });
      expect(response.toString()).toBe('TokenRequiredError: token is required');
    });

    it('token is not valid', async () => {
      const response = await changePassword(
        undefined,
        { password: 'password', newPassword: 'new' },
        { token: 'token' }
      );
      expect(response.toString()).toBe('JsonWebTokenError: jwt malformed');
    });

    it('invalid new password', async () => {
      const auth = await signin(undefined, { password: 'password', email: 'exist-test@test.com' }, undefined);
      const response = await changePassword(
        undefined,
        { password: 'password', newPassword: 'new' },
        { token: auth.token }
      );
      expect(response.toString()).toBe('InvalidPasswordError: new is not valid password');
    });

    it('same new password', async () => {
      const auth = await signin(undefined, { password: 'password', email: 'exist-test@test.com' }, undefined);
      const response = await changePassword(
        undefined,
        { password: 'password', newPassword: 'password' },
        { token: auth.token }
      );
      expect(response.toString()).toBe('SamePasswordsError: the new password must be different from the old one');
    });

    it('success', async () => {
      const auth = await signin(undefined, { password: 'password', email: 'exist-test@test.com' }, undefined);
      const response1 = await changePassword(
        undefined,
        { password: 'password', newPassword: 'newPassword' },
        { token: auth.token }
      );
      expect(response1.token).toBeDefined();
      expect(response1.user).toBeDefined();

      // изменить пароль обратно
      const response2 = await changePassword(
        undefined,
        { password: 'newPassword', newPassword: 'password' },
        { token: auth.token }
      );
      expect(response2.token).toBeDefined();
      expect(response2.user).toBeDefined();
    });
  });

  describe('resetPassword', () => {
    describe('getCode', () => {
      it('token is required', async () => {
        const response = await getCode();
        expect(response.toString()).toBe('TokenRequiredError: token is required');
      });

      it('token is not valid', async () => {
        const response = await getCode(undefined, undefined, { token: 'token' });
        expect(response.toString()).toBe('JsonWebTokenError: jwt malformed');
      });

      it('success', async () => {
        const auth = await signin(undefined, { password: 'password', email: 'exist-test@test.com' }, undefined);
        const response = await getCode(undefined, undefined, { token: auth.token });
        expect(response.token).toBeDefined();
        expect(response.user).toBeDefined();
        expect(response.code).toBeDefined();
        expect(response.user.resetPassword).toBeDefined();
        expect(response.user.resetPassword.deadline).toBeDefined();
        expect(response.user.resetPassword.code).toBeDefined();
      });
    });

    describe('resetPassword', () => {
      it('token is required', async () => {
        const auth = await signin(undefined, { password: 'password', email: 'exist-test@test.com' }, undefined);
        const response1 = await getCode(undefined, undefined, { token: auth.token });
        expect(response1.token).toBeDefined();
        expect(response1.user).toBeDefined();
        expect(response1.user.resetPassword).toBeDefined();
        expect(response1.user.resetPassword.deadline).toBeDefined();
        expect(response1.user.resetPassword.code).toBeDefined();

        const response2 = await resetPassword(undefined, {
          code: response1.user.resetPassword.code,
          newPassword: 'newPassword',
        });
        expect(response2.toString()).toBe('TokenRequiredError: token is required');
      });

      it('token is not valid', async () => {
        const auth = await signin(undefined, { password: 'password', email: 'exist-test@test.com' }, undefined);
        const response1 = await getCode(undefined, undefined, { token: auth.token });
        expect(response1.token).toBeDefined();
        expect(response1.user).toBeDefined();
        expect(response1.user.resetPassword).toBeDefined();
        expect(response1.user.resetPassword.deadline).toBeDefined();
        expect(response1.user.resetPassword.code).toBeDefined();

        const response2 = await resetPassword(
          undefined,
          { code: response1.user.resetPassword.code, newPassword: 'newPassword' },
          { token: 'token' }
        );
        expect(response2.toString()).toBe('JsonWebTokenError: jwt malformed');
      });

      it('invalid new password', async () => {
        const auth = await signin(undefined, { password: 'password', email: 'exist-test@test.com' }, undefined);
        const response1 = await getCode(undefined, undefined, { token: auth.token });
        expect(response1.token).toBeDefined();
        expect(response1.user).toBeDefined();
        expect(response1.user.resetPassword).toBeDefined();
        expect(response1.user.resetPassword.deadline).toBeDefined();
        expect(response1.user.resetPassword.code).toBeDefined();

        const response2 = await resetPassword(
          undefined,
          { code: response1.user.resetPassword.code, newPassword: 'new' },
          { token: response1.token }
        );
        expect(response2.toString()).toBe('InvalidPasswordError: "new" is not valid password');
      });

      it('invalid code', async () => {
        const auth = await signin(undefined, { password: 'password', email: 'exist-test@test.com' }, undefined);
        const response1 = await getCode(undefined, undefined, { token: auth.token });
        expect(response1.token).toBeDefined();
        expect(response1.user).toBeDefined();
        expect(response1.user.resetPassword).toBeDefined();
        expect(response1.user.resetPassword.deadline).toBeDefined();
        expect(response1.user.resetPassword.code).toBeDefined();

        const response2 = await resetPassword(
          undefined,
          { code: 'code', newPassword: 'newPassword' },
          { token: response1.token }
        );
        expect(response2.toString()).toBe('InvalidResetPasswordError: "code" is not valid code');
      });

      it('success', async () => {
        const auth = await signin(undefined, { password: 'password', email: 'exist-test@test.com' }, undefined);
        const response1 = await getCode(undefined, undefined, { token: auth.token });
        expect(response1.token).toBeDefined();
        expect(response1.user).toBeDefined();
        expect(response1.code).toBeDefined();
        expect(response1.user.resetPassword).toBeDefined();
        expect(response1.user.resetPassword.deadline).toBeDefined();
        expect(response1.user.resetPassword.code).toBeDefined();

        const response2 = await resetPassword(
          undefined,
          { code: response1.code, newPassword: 'newPassword' },
          { token: response1.token }
        );
        expect(response2.token).toBeDefined();
        expect(response2.user).toBeDefined();
        expect(response2.user.resetPassword).toBeDefined();
        expect(response2.user.resetPassword.deadline).toBeDefined();
        expect(response2.user.resetPassword.code).toBeDefined();

        const response3 = await getCode(undefined, undefined, { token: response2.token });
        const response4 = await resetPassword(
          undefined,
          { code: response3.code, newPassword: 'password' },
          { token: response3.token }
        );
        expect(response4.token).toBeDefined();
        expect(response4.user).toBeDefined();
      });
    });
  });

  describe('update', () => {
    it('nickname has existed already', async () => {
      const auth = await signin(undefined, { password: 'password', email: 'exist-test@test.com' }, undefined);
      const response = await update(undefined, { nickname: 'exist_nickname2' }, { token: auth.token });
      expect(response.toString()).toBe('AccountAlreadyExistError: User with nickname "exist_nickname2" already exist');
    });

    it('simple', async () => {
      const auth = await signin(undefined, { password: 'password', email: 'exist-test@test.com' }, undefined);
      const response1 = await update(undefined, { about: 'about', nickname: 'nickname' }, { token: auth.token });
      expect(response1.token).toBeDefined();
      expect(response1.user).toBeDefined();
      expect(response1.user.about).toBe('about');
      expect(response1.user.nickname).toBe('nickname');

      const response2 = await update(undefined, { about: null, nickname: 'exist_nickname' }, { token: auth.token });
      expect(response2.token).toBeDefined();
      expect(response2.user).toBeDefined();
      expect(response2.user.about).toBeNull();
      expect(response2.user.nickname).toBe('exist_nickname');
    });
  });
});
