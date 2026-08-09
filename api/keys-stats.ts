import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getAllApiKeysInfo } from '../src/lib/apiKeyHelper.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const statsData = await getAllApiKeysInfo();
    return res.status(200).json({
      success: true,
      ...statsData
    });
  } catch (error: any) {
    console.error('Error fetching API key stats:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to retrieve API key statistics'
    });
  }
}
