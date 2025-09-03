import React, { useState } from 'react'
import { FileText, ExternalLink } from 'lucide-react'
import ActionStatus from './ActionStatus'
import { useAuth } from '../context/AuthContext'
import { generateSummary } from '../services/openaiService'

export default function PaperSummarizer({ onSummaryCreated }) {
  const [url, setUrl] = useState('')
  const [status, setStatus] = useState('idle')
  const [summary, setSummary] = useState(null)
  const { user } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!url.trim()) return

    if (user.summariesUsed >= user.summariesLimit) {
      setStatus('error')
      return
    }

    setStatus('pending')
    setSummary(null)

    try {
      const result = await generateSummary(url)
      
      const newSummary = {
        id: Date.now().toString(),
        title: result.title,
        url: url,
        summary: result.summary,
        keyFindings: result.keyFindings,
        dateCreated: new Date().toISOString()
      }

      setSummary(newSummary)
      onSummaryCreated(newSummary)
      setStatus('success')
      setUrl('')

      // Update user's summary count
      user.summariesUsed += 1
    } catch (error) {
      console.error('Error generating summary:', error)
      setStatus('error')
    }
  }

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-md">
          <FileText className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Summarize Paper</h2>
          <p className="text-gray-600">Enter a paper URL or DOI to get instant insights</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="paper-url" className="block text-sm font-medium text-gray-700 mb-2">
            Paper URL or DOI
          </label>
          <input
            id="paper-url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="input"
            placeholder="https://arxiv.org/abs/1706.03762 or 10.1038/nature..."
            required
          />
        </div>

        <ActionStatus status={status} />

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={status === 'pending' || !url.trim() || user.summariesUsed >= user.summariesLimit}
            className="btn-primary flex-1"
          >
            {status === 'pending' ? 'Generating Summary...' : 'Generate Summary'}
          </button>
        </div>

        {user.summariesUsed >= user.summariesLimit && (
          <div className="p-4 bg-warning/10 rounded-md">
            <p className="text-sm text-warning font-medium">
              You've reached your summary limit. Upgrade to continue summarizing papers.
            </p>
          </div>
        )}
      </form>

      {summary && (
        <div className="mt-8 p-6 bg-gray-50 rounded-lg animate-slide-up">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900">{summary.title}</h3>
            <a
              href={summary.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-primary hover:text-primary/80 text-sm"
            >
              <ExternalLink className="h-4 w-4" />
              View Paper
            </a>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Summary</h4>
              <p className="text-gray-700 leading-relaxed">{summary.summary}</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Key Findings</h4>
              <ul className="space-y-1">
                {summary.keyFindings.map((finding, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-700">{finding}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}