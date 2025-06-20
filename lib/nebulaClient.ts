// lib/nebulaClient.ts

import axios from 'axios';

const NEBULA_API_URL = 'https://nebula-api.thirdweb.com/chat';
const SECRET_KEY = '90vaNnrksFerdA9Q-xrZ0VN3wUIi7l0sa9AZ1hbBmYjAVe0sEpX449O0szN_27OFmKXaFgb8p0CXFhFqhd4DGQ';

export async function callNebula(message: string, userId: string = 'default-user') {
  try {
    const response = await axios.post(
      NEBULA_API_URL,
      {
        message,
        user_id: userId,
        stream: false,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-secret-key': SECRET_KEY,
        },
      }
    );

    console.log('Nebula Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Nebula API error:', error);
    return { error: 'Failed to call Nebula API' };
  }
}