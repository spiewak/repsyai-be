import { APIGatewayProxyEvent } from 'aws-lambda';
import { handler } from '../index';

describe('Workout Planner Lambda', () => {
  const mockEvent = (body: any): APIGatewayProxyEvent => ({
    body: JSON.stringify(body),
    headers: {},
    multiValueHeaders: {},
    httpMethod: 'POST',
    isBase64Encoded: false,
    path: '/workout',
    pathParameters: null,
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    stageVariables: null,
    requestContext: {} as any,
    resource: '',
  });

  it('should return 400 if request body is missing', async () => {
    const event = mockEvent(null);
    const response = await handler(event);
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toEqual({
      message: 'Request body is required',
    });
  });

  it('should return 400 if time is outside valid range', async () => {
    const event = mockEvent({
      trainingGoal: 'Strength',
      time: 10,
      bodyParts: {
        Chest: true,
        Legs: false,
        Back: false,
        Abs: false,
      },
    });
    const response = await handler(event);
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toEqual({
      message: 'Time must be between 15 and 180 minutes',
    });
  });

  it('should return 400 if time is above valid range', async () => {
    const event = mockEvent({
      trainingGoal: 'Strength',
      time: 200,
      bodyParts: {
        Chest: true,
        Legs: false,
        Back: false,
        Abs: false,
      },
    });
    const response = await handler(event);
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toEqual({
      message: 'Time must be between 15 and 180 minutes',
    });
  });

  it('should return 400 if training goal is invalid', async () => {
    const event = mockEvent({
      trainingGoal: 'Invalid',
      time: 60,
      bodyParts: {
        Chest: true,
        Legs: false,
        Back: false,
        Abs: false,
      },
    });
    const response = await handler(event);
    expect(response.statusCode).toBe(400);
  });
}); 