import React from 'react'
import { Clock, ExternalLink } from 'lucide-react'

export default function RecentSummaries({ summaries }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-secondary/10 rounded-md">
          <Clock className="h-6 w-6 text-secondary" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Recent Summaries</h2>
          <p className="text-gray-600">Your previously generated paper insights</p>
        </div>
      </div>

      {summaries.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No summaries yet. Generate your first summary above!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {summaries.map((summary) => (
            <div key={summary.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-gray-900 line-clamp-2">{summary.title}</h3>
                <div className="flex items-center gap-2 ml-4">
                  <span className="text-sm text-gray-500">{formatDate(summary.dateCreated)}</span>
                  <a
                    href={summary.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
              
              <p className="text-gray-700 text-sm mb-3 line-clamp-3">{summary.summary}</p>
              
              <div className="flex flex-wrap gap-2">
                {summary.keyFindings.slice(0, 2).map((finding, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"
                  >
                    {finding.length > 50 ? finding.substring(0, 50) + '...' : finding}
                  </span>
                ))}
                {summary.keyFindings.length > 2 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                    +{summary.keyFindings.length - 2} more
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}