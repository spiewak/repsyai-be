import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Configuration, OpenAIApi } from 'openai';

interface WorkoutRequest {
  trainingGoal: 'Strength' | 'Endurance' | 'Bulking';
  time: number;
  bodyParts: {
    Chest: boolean;
    Legs: boolean;
    Back: boolean;
    Abs: boolean;
  };
}

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Request body is required' }),
      };
    }

    const request: WorkoutRequest = JSON.parse(event.body);

    // Validate time range
    if (request.time < 15 || request.time > 180) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Time must be between 15 and 180 minutes' }),
      };
    }

    // Create prompt based on the request
    const selectedBodyParts = Object.entries(request.bodyParts)
      .filter(([_, selected]) => selected)
      .map(([part]) => part)
      .join(', ');

    const prompt = `Create a ${request.time}-minute ${request.trainingGoal.toLowerCase()} workout plan focusing on: ${selectedBodyParts}. 
    Include specific exercises, sets, reps, and rest periods. Format the response in a clear, structured way.`;

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        workoutPlan: completion.data.choices[0].message?.content,
      }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
}; 