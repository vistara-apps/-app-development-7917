import React, { useState } from 'react'
import PaperSummarizer from './PaperSummarizer'
import RecentSummaries from './RecentSummaries'
import SubscriptionCard from './SubscriptionCard'

export default function Dashboard() {
  const [summaries, setSummaries] = useState([
    {
      id: '1',
      title: 'Attention Is All You Need',
      url: 'https://arxiv.org/abs/1706.03762',
      summary: 'This paper introduces the Transformer architecture, a novel neural network architecture based solely on attention mechanisms. The model achieves state-of-the-art results on machine translation tasks while being more parallelizable and requiring significantly less time to train.',
      keyFindings: [
        'Eliminated recurrence and convolutions entirely',
        'Achieved new state-of-the-art BLEU scores',
        'Significantly faster training time'
      ],
      dateCreated: '2024-01-15T10:30:00Z'
    }
  ])

  const addSummary = (newSummary) => {
    setSummaries(prev => [newSummary, ...prev])
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-4xl font-semibold text-gray-900 mb-2">Welcome back!</h1>
        <p className="text-gray-600">Get instant insights from research papers with AI-powered summaries.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <PaperSummarizer onSummaryCreated={addSummary} />
          <RecentSummaries summaries={summaries} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <SubscriptionCard />
        </div>
      </div>
    </div>
  )
}