import { APIGatewayProxyEvent } from 'aws-lambda';
import { handler } from '../index';

describe('Hello World Lambda', () => {
  const mockEvent = (): APIGatewayProxyEvent => ({
    body: null,
    headers: {},
    multiValueHeaders: {},
    httpMethod: 'GET',
    isBase64Encoded: false,
    path: '/hello',
    pathParameters: null,
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    stageVariables: null,
    requestContext: {} as any,
    resource: '',
  });

  it('should return hello world message', async () => {
    const event = mockEvent();
    const response = await handler(event);
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual({
      message: 'Hello World',
    });
  });
}); 