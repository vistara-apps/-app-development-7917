import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || 'demo-key',
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true,
})

export async function generateSummary(paperUrl) {
  try {
    // Simulate API delay for demo
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // In a real implementation, you would:
    // 1. Extract paper content from the URL
    // 2. Send content to OpenAI for summarization
    // 3. Parse and return the structured response
    
    // For demo purposes, return mock data based on URL
    if (paperUrl.includes('1706.03762') || paperUrl.toLowerCase().includes('attention')) {
      return {
        title: 'Attention Is All You Need',
        summary: 'This paper introduces the Transformer architecture, a novel neural network architecture based solely on attention mechanisms. The model achieves state-of-the-art results on machine translation tasks while being more parallelizable and requiring significantly less time to train. The architecture eliminates recurrence and convolutions entirely, relying instead on attention mechanisms to draw global dependencies between input and output.',
        keyFindings: [
          'Eliminated recurrence and convolutions entirely',
          'Achieved new state-of-the-art BLEU scores on WMT translation tasks',
          'Significantly faster training time due to parallelization',
          'Self-attention mechanism captures long-range dependencies effectively'
        ]
      }
    }
    
    // Mock response for other papers
    const mockTitles = [
      'Deep Learning for Computer Vision: A Comprehensive Survey',
      'Advances in Natural Language Processing with Transformers',
      'Quantum Computing: Current State and Future Prospects',
      'Machine Learning in Healthcare: Applications and Challenges'
    ]
    
    const randomTitle = mockTitles[Math.floor(Math.random() * mockTitles.length)]
    
    return {
      title: randomTitle,
      summary: 'This research paper presents novel approaches and methodologies in its respective field. The authors conduct comprehensive experiments and provide detailed analysis of their findings. The work contributes significantly to the current understanding and opens new avenues for future research. The methodology is robust and the results are statistically significant.',
      keyFindings: [
        'Novel methodology outperforms existing approaches',
        'Comprehensive experimental validation across multiple datasets',
        'Significant improvements in accuracy and efficiency',
        'Practical applications demonstrated in real-world scenarios'
      ]
    }
    
  } catch (error) {
    console.error('Error generating summary:', error)
    throw new Error('Failed to generate summary. Please try again.')
  }
}

// Real OpenAI implementation (commented out for demo)
/*
export async function generateSummary(paperUrl) {
  try {
    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-001",
      messages: [
        {
          role: "system",
          content: "You are an expert research assistant. Given a research paper URL, provide a concise summary and key findings. Format your response as JSON with fields: title, summary, keyFindings (array)."
        },
        {
          role: "user",
          content: `Please summarize the research paper at: ${paperUrl}`
        }
      ],
      max_tokens: 1000,
      temperature: 0.3
    })
    
    const response = JSON.parse(completion.choices[0].message.content)
    return response
  } catch (error) {
    console.error('Error generating summary:', error)
    throw new Error('Failed to generate summary. Please try again.')
  }
}
*/