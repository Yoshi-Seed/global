import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { serveStatic } from 'hono/cloudflare-workers'

type Bindings = {
  OPENAI_API_KEY: string
  ASSISTANT_ID?: string
}

const app = new Hono<{ Bindings: Bindings }>()

// Enable CORS and logging
app.use('/api/*', cors())
app.use('/api/*', logger())

// Serve static files
app.use('/static/*', serveStatic({ root: './public' }))

// Rate limiting store (in-memory for simplicity)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// Rate limiting middleware
const rateLimit = (maxRequests: number, windowMs: number) => {
  return async (c: any, next: any) => {
    const ip = c.req.header('CF-Connecting-IP') || c.req.header('X-Forwarded-For') || 'unknown'
    const now = Date.now()
    const key = `rate_limit:${ip}`
    
    const record = rateLimitStore.get(key)
    
    if (!record || now > record.resetTime) {
      rateLimitStore.set(key, { count: 1, resetTime: now + windowMs })
      return next()
    }
    
    if (record.count >= maxRequests) {
      return c.json({ error: '使用頻度制限に達しました。少し時間をおいて再度お試しください。' }, 429)
    }
    
    record.count++
    return next()
  }
}

// Content filtering for medical safety
const filterContent = (content: string): { safe: boolean; message?: string } => {
  const emergencyKeywords = ['救急', '緊急', '意識不明', '呼吸停止', '心停止', '大量出血', '自殺', '自害']
  const medicalAdviceKeywords = ['診断', '治療法', '薬の処方', '手術', '病気の特定']
  
  for (const keyword of emergencyKeywords) {
    if (content.includes(keyword)) {
      return {
        safe: false,
        message: '緊急の医療状況と思われます。直ちに119番（救急）または最寄りの医療機関にご相談ください。このチャットでは緊急対応はできません。'
      }
    }
  }
  
  for (const keyword of medicalAdviceKeywords) {
    if (content.includes(keyword)) {
      return {
        safe: false,
        message: '申し訳ございませんが、具体的な医療診断や治療法についてはお答えできません。必ず医療従事者にご相談ください。'
      }
    }
  }
  
  return { safe: true }
}

// Store for Assistant threads
const threadStore = new Map<string, string>()

// Chat API endpoint - Assistants API for Custom GPT Integration
app.post('/api/chat', rateLimit(10, 60000), async (c) => {
  try {
    const { message, conversationId } = await c.req.json()
    
    if (!message || typeof message !== 'string') {
      return c.json({ error: 'メッセージが必要です' }, 400)
    }
    
    // Content filtering
    const filterResult = filterContent(message)
    if (!filterResult.safe) {
      return c.json({ 
        response: filterResult.message,
        filtered: true 
      })
    }
    
    const apiKey = c.env.OPENAI_API_KEY
    if (!apiKey) {
      console.error('OpenAI API key not configured')
      return c.json({ error: 'サービスが一時的に利用できません' }, 500)
    }

    // Create or get existing thread
    let threadId = threadStore.get(conversationId || 'default')
    
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
      })
      
      if (!threadResponse.ok) {
        console.error('Failed to create thread')
        return c.json({ error: 'スレッド作成に失敗しました' }, 500)
      }
      
      const thread = await threadResponse.json()
      threadId = thread.id
      threadStore.set(conversationId || 'default', threadId)
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
    })

    if (!messageResponse.ok) {
      console.error('Failed to add message')
      return c.json({ error: 'メッセージ追加に失敗しました' }, 500)
    }

    // Create assistant if not exists (or use existing)
    const assistantId = c.env.ASSISTANT_ID || await createFeasibilityAssistant(apiKey)

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
    })

    if (!runResponse.ok) {
      console.error('Failed to run assistant')
      return c.json({ error: 'アシスタント実行に失敗しました' }, 500)
    }

    const run = await runResponse.json()
    
    // Poll for completion
    let runStatus = run.status
    let attempts = 0
    const maxAttempts = 30
    
    while (runStatus === 'in_progress' || runStatus === 'queued') {
      if (attempts >= maxAttempts) {
        return c.json({ error: 'タイムアウトしました' }, 500)
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const statusResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs/${run.id}`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'OpenAI-Beta': 'assistants=v2'
        }
      })
      
      const statusData = await statusResponse.json()
      runStatus = statusData.status
      attempts++
    }

    if (runStatus !== 'completed') {
      return c.json({ error: 'アシスタントの実行が失敗しました' }, 500)
    }

    // Get messages
    const messagesResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'OpenAI-Beta': 'assistants=v2'
      }
    })

    const messagesData = await messagesResponse.json()
    const assistantMessage = messagesData.data[0]
    
    if (assistantMessage && assistantMessage.role === 'assistant') {
      const content = assistantMessage.content[0]?.text?.value || 'すみません、回答を生成できませんでした。'
      
      return c.json({ 
        response: content,
        conversationId: conversationId || `conv_${Date.now()}_${Math.random().toString(36).substring(2)}`
      })
    }

    return c.json({ error: 'レスポンスの取得に失敗しました' }, 500)
  } catch (error) {
    console.error('Chat API error:', error)
    return c.json({ error: '内部エラーが発生しました' }, 500)
  }
})

// Create Feasibility Assistant
async function createFeasibilityAssistant(apiKey: string): Promise<string> {
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
  })

  if (!response.ok) {
    throw new Error('Failed to create assistant')
  }

  const assistant = await response.json()
  return assistant.id
}

// Health check
app.get('/api/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Main page
app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="ja">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>医療系リサーチ AI チャット</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <style>
          .chat-container {
            height: 500px;
            overflow-y: auto;
          }
          .message {
            animation: fadeIn 0.3s ease-in;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .typing-indicator {
            display: none;
          }
          .typing-indicator.active {
            display: block;
          }
        </style>
    </head>
    <body class="bg-gray-50">
        <div class="container mx-auto px-4 py-8 max-w-4xl">
            <!-- Header -->
            <div class="bg-white rounded-lg shadow-md p-6 mb-6">
                <h1 class="text-2xl font-bold text-gray-800 mb-2">
                    <i class="fas fa-stethoscope text-blue-600 mr-2"></i>
                    Feasibility Bot Yoshi
                </h1>
                <p class="text-gray-600 mb-2">医療系マーケットリサーチのフィージビリティスタディ専門AIアシスタント</p>
                <div class="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full inline-block">
                    <i class="fas fa-robot mr-1"></i>
                    カスタムGPT統合版
                </div>
            </div>

            <!-- 利用規約・注意事項 -->
            <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6" id="disclaimer">
                <div class="flex">
                    <div class="flex-shrink-0">
                        <i class="fas fa-exclamation-triangle text-yellow-400"></i>
                    </div>
                    <div class="ml-3">
                        <p class="text-sm text-yellow-800">
                            <strong>重要な注意事項：</strong><br>
                            • このチャットは情報提供のみを目的としており、医学的助言や診断は提供しません<br>
                            • 健康に関する具体的なご相談は必ず医療従事者にお尋ねください<br>
                            • 緊急時は119番または最寄りの医療機関にご連絡ください<br>
                            • 会話ログは24時間後に自動削除されます
                        </p>
                        <div class="mt-3">
                            <label class="inline-flex items-center">
                                <input type="checkbox" id="agreeTerms" class="form-checkbox">
                                <span class="ml-2 text-sm text-yellow-800">上記の注意事項に同意してチャットを開始します</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Chat Interface -->
            <div class="bg-white rounded-lg shadow-md" id="chatInterface" style="display: none;">
                <!-- Messages -->
                <div class="chat-container p-4 border-b" id="chatMessages">
                    <div class="message text-center text-gray-500 text-sm">
                        チャットを開始してください
                    </div>
                </div>

                <!-- Typing Indicator -->
                <div class="typing-indicator p-4 border-b">
                    <div class="flex items-center text-gray-500">
                        <div class="flex space-x-1">
                            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s;"></div>
                            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s;"></div>
                        </div>
                        <span class="ml-2">回答を生成中...</span>
                    </div>
                </div>

                <!-- Input Area -->
                <div class="p-4">
                    <div class="flex space-x-2">
                        <input 
                            type="text" 
                            id="messageInput" 
                            placeholder="メッセージを入力してください..."
                            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            maxlength="500"
                        >
                        <button 
                            id="sendButton"
                            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                        >
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                    <div class="text-xs text-gray-500 mt-2">
                        <span id="charCount">0</span>/500文字 | 1分間に10回まで送信可能
                    </div>
                </div>
            </div>
        </div>

        <script src="/static/chat.js"></script>
    </body>
    </html>
  `)
})

export default app