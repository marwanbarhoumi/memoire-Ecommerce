import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import axios from 'axios';
import authReducer from '../../JS/reducers/authReducer';
import { register } from '../../JS/action/authActions';

describe('authActions', () => {
  let store;
  const navigate = jest.fn();

  beforeEach(() => {
    store = configureStore({
      reducer: { auth: authReducer },
      middleware: [thunk]
    });
    jest.clearAllMocks();
  });

  test('register success', async () => {
    const newUser = { email: 'test@test.com', password: 'password123' };
    axios.post.mockResolvedValue({ data: { msg: 'Success' } });

    await store.dispatch(register(newUser, navigate));
    
    expect(axios.post).toHaveBeenCalledWith(
      'http://localhost:7000/api/auth/signup', 
      newUser
    );
  });
});