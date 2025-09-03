# ScholarSift API Documentation

This documentation provides details about the ScholarSift API, including endpoints, request/response formats, and authentication.

## Table of Contents

- [Authentication](#authentication)
- [API Endpoints](#api-endpoints)
  - [OpenAI Integration](#openai-integration)
  - [Supabase Integration](#supabase-integration)
  - [Zotero Integration](#zotero-integration)
- [Data Models](#data-models)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [Versioning](#versioning)

## Authentication

ScholarSift uses token-based authentication for API access. Premium tier users receive an API key that must be included in the `Authorization` header of all requests.

```
Authorization: Bearer YOUR_API_KEY
```

## API Endpoints

### OpenAI Integration

- [OpenAI API Documentation](./openai.md)

### Supabase Integration

- [Supabase API Documentation](./supabase.md)

### Zotero Integration

- [Zotero API Documentation](./zotero.md)

## Data Models

### User

```json
{
  "id": "string",
  "email": "string",
  "subscriptionTier": "free | basic | premium",
  "summariesUsed": "number",
  "summariesLimit": "number"
}
```

### Summary

```json
{
  "id": "string",
  "userId": "string",
  "title": "string",
  "url": "string",
  "summary": "string",
  "keyFindings": ["string"],
  "dateCreated": "ISO8601 date string"
}
```

## Error Handling

All API endpoints return standard HTTP status codes:

- `200 OK`: Request successful
- `400 Bad Request`: Invalid request parameters
- `401 Unauthorized`: Invalid or missing API key
- `403 Forbidden`: Valid API key but insufficient permissions
- `404 Not Found`: Resource not found
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

Error responses follow this format:

```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": {}
  }
}
```

## Rate Limiting

API rate limits vary by subscription tier:

- Free: 5 requests per day
- Basic: 50 requests per day
- Premium: 1000 requests per day

Rate limit headers are included in all responses:

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1620000000
```

## Versioning

The ScholarSift API uses versioning to ensure backward compatibility. The current version is `v1`.

API versions are specified in the URL path:

```
https://api.scholarsift.com/v1/summaries
```

When a new version is released, the previous version will be supported for at least 6 months.

