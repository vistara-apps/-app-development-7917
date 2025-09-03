# OpenAI Integration API

ScholarSift uses OpenAI's API to generate summaries of research papers. This document describes the integration and how it's used within the application.

## Overview

The OpenAI integration is used to:

1. Generate concise summaries of research papers
2. Extract key findings from papers
3. Provide context and insights about the paper's significance

## API Endpoints

### Generate Summary

```
POST /api/v1/summaries
```

Generates a summary of a research paper from a URL or DOI.

#### Request

```json
{
  "url": "string",
  "options": {
    "maxLength": "number",
    "includeKeyFindings": "boolean",
    "language": "string"
  }
}
```

#### Response

```json
{
  "id": "string",
  "title": "string",
  "summary": "string",
  "keyFindings": ["string"],
  "dateCreated": "ISO8601 date string"
}
```

#### Error Codes

- `400`: Invalid URL or DOI
- `401`: Unauthorized (invalid API key)
- `402`: Payment required (subscription limit reached)
- `429`: Rate limit exceeded
- `500`: Server error

## Implementation Details

### OpenAI Models

ScholarSift uses the following OpenAI models:

- `gpt-4-turbo`: For premium tier users
- `gpt-3.5-turbo`: For free and basic tier users

### Prompt Engineering

The system uses carefully crafted prompts to generate high-quality summaries:

```
You are an expert research assistant that helps researchers understand academic papers.
Given the content of a research paper, provide a concise summary and extract key findings.
Focus on the main contributions, methodology, and results.
Format your response as JSON with the following fields:
- title: The title of the paper
- summary: A concise summary of the paper (150-200 words)
- keyFindings: An array of 3-5 key findings or contributions (each 10-15 words)
```

### Content Extraction

Before sending content to OpenAI, ScholarSift extracts the paper content using:

1. PDF extraction for PDF papers
2. Web scraping for HTML papers
3. Publisher APIs when available

### Response Processing

The raw response from OpenAI is processed to:

1. Validate the JSON structure
2. Extract the title, summary, and key findings
3. Format the response for the client

## Rate Limiting

OpenAI API calls are rate-limited based on the user's subscription tier:

- Free: 5 summaries per month
- Basic: 50 summaries per month
- Premium: Unlimited summaries

## Error Handling

The OpenAI integration includes robust error handling for:

- API rate limits
- Invalid paper URLs
- Content extraction failures
- Malformed API responses

## Security Considerations

- API keys are stored securely and never exposed to clients
- All API requests are made server-side to protect API keys
- Content is validated before processing to prevent prompt injection

## Future Improvements

Planned improvements to the OpenAI integration include:

- Support for more paper formats
- Multi-language summary generation
- Comparative analysis of multiple papers
- Citation extraction and formatting

