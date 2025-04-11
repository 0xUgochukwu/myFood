import { describe, it, expect, beforeAll, afterAll, beforeEach, mock, afterEach } from 'bun:test';
import authenticate from '../../../src/middlewares/auth';
import jwt from 'jsonwebtoken';

// Mock jsonwebtoken
mock.module('jsonwebtoken', () => {
  return {
    verify: mock((token, secret, callback) => {
      if (token === 'valid-token') {
        return { email: 'test@example.com' };
      } else {
        throw new Error('Invalid token');
      }
    })
  };
});

describe('Authentication Middleware', () => {
  beforeEach(() => {
    mock.restore(); // Reset mocks before each test
  });

  afterEach(() => {
    mock.restore(); // Cleanup mocks after each test
  });

  it('should set user in request when valid token is provided', () => {
    // Setup
    const req = {
      headers: {
        authorization: 'Bearer valid-token'
      }
    };
    const res = {
      status: mock(code => res),
      json: mock(data => data)
    };
    const next = mock();

    // Act
    authenticate(req as any, res as any, next);

    // Assert
    expect(next).toHaveBeenCalled();
    expect(req).toHaveProperty('user');
    expect(req.user).toHaveProperty('email', 'test@example.com');
  });

  it('should return 401 when no token is provided', () => {
    // Setup
    const req = {
      headers: {}
    };
    const res = {
      status: mock(code => res),
      json: mock(data => data)
    };
    const next = mock();

    // Act
    authenticate(req as any, res as any, next);

    // Assert
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalled();
    const response = res.json.mock.calls[0][0];
    expect(response.message).toBe('Authorization token not provided');
  });

  it('should return 401 when invalid token format is provided', () => {
    // Setup
    const req = {
      headers: {
        authorization: 'InvalidFormat token'
      }
    };
    const res = {
      status: mock(code => res),
      json: mock(data => data)
    };
    const next = mock();

    // Act
    authenticate(req as any, res as any, next);

    // Assert
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalled();
    const response = res.json.mock.calls[0][0];
    expect(response.message).toBe('Invalid authorization format');
  });

  it('should return 401 when token is invalid', () => {
    // Setup
    const req = {
      headers: {
        authorization: 'Bearer invalid-token'
      }
    };
    const res = {
      status: mock(code => res),
      json: mock(data => data)
    };
    const next = mock();

    // Act
    authenticate(req as any, res as any, next);

    // Assert
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalled();
    const response = res.json.mock.calls[0][0];
    expect(response.message).toBe('Invalid token');
  });
}); 