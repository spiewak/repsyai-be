import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import OpenAI from 'openai';

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

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const VALID_TRAINING_GOALS = ['Strength', 'Endurance', 'Bulking'] as const;

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Request body is required' }),
      };
    }

    const request: WorkoutRequest = JSON.parse(event.body);

    // Validate trainingGoal
    if (!request.trainingGoal || typeof request.trainingGoal !== 'string') {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'trainingGoal is required and must be a string' }),
      };
    }

    if (!VALID_TRAINING_GOALS.includes(request.trainingGoal as typeof VALID_TRAINING_GOALS[number])) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          message: `Invalid trainingGoal. Must be one of: ${VALID_TRAINING_GOALS.join(', ')}` 
        }),
      };
    }

    // Validate time range
    if (request.time < 15 || request.time > 180) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Time must be between 15 and 180 minutes' }),
      };
    }

    // Validate bodyParts
    if (!request.bodyParts || typeof request.bodyParts !== 'object') {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'bodyParts must be an object' }),
      };
    }

    const requiredBodyParts = ['Chest', 'Legs', 'Back', 'Abs'];
    const missingBodyParts = requiredBodyParts.filter(part => !(part in request.bodyParts));
    
    if (missingBodyParts.length > 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          message: `Missing required body parts: ${missingBodyParts.join(', ')}` 
        }),
      };
    }

    const invalidBodyParts = Object.entries(request.bodyParts)
      .filter(([key, value]) => !requiredBodyParts.includes(key) || typeof value !== 'boolean')
      .map(([key]) => key);

    if (invalidBodyParts.length > 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          message: `Invalid body parts or values: ${invalidBodyParts.join(', ')}` 
        }),
      };
    }

    // Create prompt based on the request
    const selectedBodyParts = Object.entries(request.bodyParts)
      .filter(([_, selected]) => selected)
      .map(([part]) => part)
      .join(', ');

    if (selectedBodyParts.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'At least one body part must be selected' }),
      };
    }

    const prompt = `Create a ${request.time}-minute ${request.trainingGoal.toLowerCase()} workout plan focusing on: ${selectedBodyParts}. 
    Include specific exercises, sets, reps, and rest periods. Format the response in a clear, structured way.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }]
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        workoutPlan: completion.choices[0].message.content,
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