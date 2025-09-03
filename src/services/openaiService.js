import OpenAI from 'openai'

// Initialize OpenAI client with API key from environment variables
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Note: In production, API calls should be made from a backend service
})

/**
 * Extracts content from a paper URL or DOI
 * @param {string} paperUrl - URL or DOI of the paper
 * @returns {Promise<string>} - Paper content as text
 */
async function extractPaperContent(paperUrl) {
  try {
    // Handle DOI format (convert to URL if needed)
    if (paperUrl.startsWith('10.') && !paperUrl.startsWith('http')) {
      paperUrl = `https://doi.org/${paperUrl}`;
    }
    
    // For demo purposes, we'll simulate content extraction
    // In a real implementation, you would:
    // 1. Use a PDF extraction library or API for PDF papers
    // 2. Use web scraping for HTML papers
    // 3. Use publisher APIs when available
    
    if (paperUrl.includes('arxiv')) {
      // Simulate ArXiv paper extraction
      return `This is the extracted content from ArXiv paper at ${paperUrl}. 
      In a real implementation, we would extract the full text content from the PDF.`;
    } else if (paperUrl.includes('doi.org')) {
      // Simulate DOI resolution and content extraction
      return `This is the extracted content from the paper with DOI ${paperUrl}.
      In a real implementation, we would resolve the DOI and extract content from the publisher's site.`;
    } else {
      // Generic extraction for other URLs
      return `This is the extracted content from the paper at ${paperUrl}.
      In a real implementation, we would use appropriate extraction methods based on the URL format and content type.`;
    }
  } catch (error) {
    console.error('Error extracting paper content:', error);
    throw new Error('Failed to extract paper content. Please check the URL or DOI and try again.');
  }
}

/**
 * Generates a summary of a research paper using OpenAI API
 * @param {string} paperUrl - URL or DOI of the paper to summarize
 * @returns {Promise<Object>} - Object containing title, summary, and key findings
 */
export async function generateSummary(paperUrl) {
  try {
    // Extract paper content
    const paperContent = await extractPaperContent(paperUrl);
    
    // Call OpenAI API to generate summary
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo", // Use appropriate model based on needs and budget
      messages: [
        {
          role: "system",
          content: `You are an expert research assistant that helps researchers understand academic papers.
          Given the content of a research paper, provide a concise summary and extract key findings.
          Focus on the main contributions, methodology, and results.
          Format your response as JSON with the following fields:
          - title: The title of the paper
          - summary: A concise summary of the paper (150-200 words)
          - keyFindings: An array of 3-5 key findings or contributions (each 10-15 words)`
        },
        {
          role: "user",
          content: `Please summarize the following research paper content:\n\n${paperContent}`
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 1000,
      temperature: 0.3
    });
    
    // Parse the response
    const response = JSON.parse(completion.choices[0].message.content);
    
    // Validate response format
    if (!response.title || !response.summary || !Array.isArray(response.keyFindings)) {
      throw new Error('Invalid response format from AI service');
    }
    
    return {
      title: response.title,
      summary: response.summary,
      keyFindings: response.keyFindings
    };
    
  } catch (error) {
    console.error('Error generating summary:', error);
    
    // Handle different error types
    if (error.name === 'RateLimitError') {
      throw new Error('API rate limit exceeded. Please try again later.');
    } else if (error.name === 'AuthenticationError') {
      throw new Error('API authentication failed. Please check your API key.');
    } else if (error.message.includes('content')) {
      throw new Error('Could not extract content from the provided paper URL. Please check the URL and try again.');
    } else {
      throw new Error('Failed to generate summary. Please try again.');
    }
  }
}
