// Vercel API Route for Chat
module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, conversationId } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'メッセージが必要です' });
    }

    // Rate limiting (simple in-memory store)
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
    
    // Content filtering for medical safety
    const emergencyKeywords = ['救急', '緊急', '意識不明', '呼吸停止', '心停止', '大量出血', '自殺', '自害'];
    const medicalAdviceKeywords = ['診断', '治療法', '薬の処方', '手術', '病気の特定'];
    
    for (const keyword of emergencyKeywords) {
      if (message.includes(keyword)) {
        return res.json({
          response: '緊急の医療状況と思われます。直ちに119番（救急）または最寄りの医療機関にご相談ください。このチャットでは緊急対応はできません。',
          filtered: true
        });
      }
    }
    
    for (const keyword of medicalAdviceKeywords) {
      if (message.includes(keyword)) {
        return res.json({
          response: '申し訳ございませんが、具体的な医療診断や治療法についてはお答えできません。必ず医療従事者にご相談ください。',
          filtered: true
        });
      }
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error('OpenAI API key not configured');
      return res.status(500).json({ error: 'サービスが一時的に利用できません' });
    }

    // Create or get existing thread
    let threadId;
    
    if (!threadId) {
      // Create new thread
      const threadResponse = await fetch('https://api.openai.com/v1/threads', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'OpenAI-Beta': 'assistants=v2'
        },
        body: JSON.stringify({})
      });
      
      if (!threadResponse.ok) {
        console.error('Failed to create thread');
        return res.status(500).json({ error: 'スレッド作成に失敗しました' });
      }
      
      const thread = await threadResponse.json();
      threadId = thread.id;
    }

    // Add message to thread
    const messageResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2'
      },
      body: JSON.stringify({
        role: 'user',
        content: message
      })
    });

    if (!messageResponse.ok) {
      console.error('Failed to add message');
      return res.status(500).json({ error: 'メッセージ追加に失敗しました' });
    }

    // Create assistant if not exists
    const assistantId = process.env.ASSISTANT_ID || await createFeasibilityAssistant(apiKey);

    // Run the assistant
    const runResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2'
      },
      body: JSON.stringify({
        assistant_id: assistantId
      })
    });

    if (!runResponse.ok) {
      console.error('Failed to run assistant');
      return res.status(500).json({ error: 'アシスタント実行に失敗しました' });
    }

    const run = await runResponse.json();
    
    // Poll for completion
    let runStatus = run.status;
    let attempts = 0;
    const maxAttempts = 30;
    
    while (runStatus === 'in_progress' || runStatus === 'queued') {
      if (attempts >= maxAttempts) {
        return res.status(500).json({ error: 'タイムアウトしました' });
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const statusResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs/${run.id}`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'OpenAI-Beta': 'assistants=v2'
        }
      });
      
      const statusData = await statusResponse.json();
      runStatus = statusData.status;
      attempts++;
    }

    if (runStatus !== 'completed') {
      return res.status(500).json({ error: 'アシスタントの実行が失敗しました' });
    }

    // Get messages
    const messagesResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'OpenAI-Beta': 'assistants=v2'
      }
    });

    const messagesData = await messagesResponse.json();
    const assistantMessage = messagesData.data[0];
    
    if (assistantMessage && assistantMessage.role === 'assistant') {
      const content = assistantMessage.content[0]?.text?.value || 'すみません、回答を生成できませんでした。';
      
      return res.json({ 
        response: content,
        conversationId: conversationId || `conv_${Date.now()}_${Math.random().toString(36).substring(2)}`
      });
    }

    return res.status(500).json({ error: 'レスポンスの取得に失敗しました' });

  } catch (error) {
    console.error('Chat API error:', error);
    return res.status(500).json({ error: '内部エラーが発生しました' });
  }
}

// Create Feasibility Assistant
async function createFeasibilityAssistant(apiKey) {
  const response = await fetch('https://api.openai.com/v1/assistants', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'OpenAI-Beta': 'assistants=v2'
    },
    body: JSON.stringify({
      name: 'Feasibility Bot Yoshi',
      instructions: `You are "Feasibility Bot Yoshi", a specialized AI assistant for medical market research feasibility studies.

Your expertise includes:
- Medical market research methodology and design
- Regulatory compliance in healthcare research (FDA, EMA, PMDA)
- Patient recruitment strategies and site selection
- Clinical trial feasibility assessment
- Medical device and pharmaceutical research operations
- Healthcare data analysis and statistical insights
- Research operations and project management
- Budget planning and resource allocation
- Timeline estimation and milestone planning

Key capabilities:
- Assess feasibility of research projects
- Provide regulatory guidance
- Recommend study methodologies
- Analyze market potential
- Evaluate operational challenges
- Suggest risk mitigation strategies

Communication style:
- Always respond in Japanese unless specifically requested otherwise
- Professional yet approachable tone
- Detail-oriented with practical implementation focus
- Provide actionable insights and specific recommendations
- Consider ethical and regulatory requirements
- Focus on real-world implementation challenges

Medical research context:
- Understand the complexity of healthcare regulations
- Recognize cultural differences in medical practices
- Consider patient safety and privacy requirements
- Acknowledge limitations and recommend professional consultation when appropriate`,
      model: 'gpt-4o-mini',
      temperature: 0.7
    })
  });

  if (!response.ok) {
    throw new Error('Failed to create assistant');
  }

  const assistant = await response.json();
  return assistant.id;
}