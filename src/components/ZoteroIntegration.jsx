import React, { useState } from 'react'
import { BookOpen, ExternalLink, Check, AlertCircle } from 'lucide-react'
import { 
  authenticateWithZotero, 
  getUserLibraries, 
  getLibraryItems,
  exportSummaryToZotero
} from '../services/zoteroService'
import ActionStatus from './ActionStatus'

export default function ZoteroIntegration({ summary, onClose }) {
  const [status, setStatus] = useState('idle')
  const [step, setStep] = useState('authenticate') // authenticate, selectLibrary, selectItem, complete
  const [zoteroAuth, setZoteroAuth] = useState(null)
  const [libraries, setLibraries] = useState([])
  const [selectedLibrary, setSelectedLibrary] = useState(null)
  const [items, setItems] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Handle Zotero authentication
  const handleAuthenticate = async () => {
    setStatus('pending')
    try {
      const result = await authenticateWithZotero()
      if (result.success) {
        setZoteroAuth(result.userData)
        // Fetch libraries after successful authentication
        const librariesResult = await getUserLibraries(result.userData.apiKey)
        if (librariesResult.success) {
          setLibraries(librariesResult.libraries)
          setStep('selectLibrary')
        } else {
          throw new Error(librariesResult.error || 'Failed to fetch libraries')
        }
        setStatus('success')
      } else {
        throw new Error(result.error || 'Authentication failed')
      }
    } catch (error) {
      console.error('Zotero authentication error:', error)
      setStatus('error')
    }
  }

  // Handle library selection
  const handleSelectLibrary = async (library) => {
    setSelectedLibrary(library)
    setStatus('pending')
    
    try {
      const result = await getLibraryItems(
        zoteroAuth.apiKey,
        library.type,
        library.id
      )
      
      if (result.success) {
        setItems(result.items)
        setStep('selectItem')
        setStatus('success')
      } else {
        throw new Error(result.error || 'Failed to fetch library items')
      }
    } catch (error) {
      console.error('Error fetching library items:', error)
      setStatus('error')
    }
  }

  // Handle item selection and export
  const handleExportToItem = async (item) => {
    setSelectedItem(item)
    setStatus('pending')
    
    try {
      const result = await exportSummaryToZotero(
        zoteroAuth.apiKey,
        summary,
        {
          libraryType: selectedLibrary.type,
          libraryID: selectedLibrary.id,
          itemKey: item.key
        }
      )
      
      if (result.success) {
        setStep('complete')
        setStatus('success')
      } else {
        throw new Error(result.error || 'Failed to export summary')
      }
    } catch (error) {
      console.error('Error exporting summary:', error)
      setStatus('error')
    }
  }

  // Filter items based on search query
  const filteredItems = searchQuery.trim()
    ? items.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.creators && item.creators.some(creator => 
          `${creator.firstName} ${creator.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
        ))
      )
    : items

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-md">
          <BookOpen className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Zotero Integration</h2>
          <p className="text-gray-600">Export your summary to Zotero</p>
        </div>
      </div>

      <ActionStatus status={status} />

      {step === 'authenticate' && (
        <div className="space-y-4">
          <p className="text-gray-700">
            Connect to your Zotero account to export summaries directly to your reference library.
          </p>
          
          <div className="flex gap-3">
            <button
              onClick={handleAuthenticate}
              disabled={status === 'pending'}
              className="btn-primary flex-1"
            >
              {status === 'pending' ? 'Connecting...' : 'Connect to Zotero'}
            </button>
            <button onClick={onClose} className="btn-secondary">
              Cancel
            </button>
          </div>
        </div>
      )}

      {step === 'selectLibrary' && (
        <div className="space-y-4">
          <p className="text-gray-700 mb-4">
            Select a library to export your summary to:
          </p>
          
          <div className="space-y-2">
            {libraries.map(library => (
              <div
                key={library.id}
                onClick={() => handleSelectLibrary(library)}
                className="p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer flex justify-between items-center"
              >
                <div>
                  <h3 className="font-medium text-gray-900">{library.name}</h3>
                  <p className="text-xs text-gray-500">
                    {library.type === 'user' ? 'Personal Library' : 'Group Library'}
                  </p>
                </div>
                <ExternalLink className="h-4 w-4 text-gray-400" />
              </div>
            ))}
          </div>
          
          <button onClick={() => setStep('authenticate')} className="btn-secondary">
            Back
          </button>
        </div>
      )}

      {step === 'selectItem' && (
        <div className="space-y-4">
          <p className="text-gray-700 mb-2">
            Select an item to attach your summary to:
          </p>
          
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input"
            />
          </div>
          
          <div className="max-h-60 overflow-y-auto space-y-2">
            {filteredItems.length === 0 ? (
              <p className="text-center text-gray-500 py-4">
                {searchQuery.trim() 
                  ? 'No items match your search query.' 
                  : 'No items found in this library.'}
              </p>
            ) : (
              filteredItems.map(item => (
                <div
                  key={item.key}
                  onClick={() => handleExportToItem(item)}
                  className="p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer"
                >
                  <h3 className="font-medium text-gray-900 mb-1">{item.title}</h3>
                  <div className="flex justify-between">
                    <p className="text-xs text-gray-500">
                      {item.creators?.map(c => `${c.lastName}, ${c.firstName}`).join('; ')}
                    </p>
                    <p className="text-xs text-gray-500">{item.date}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={() => setStep('selectLibrary')} 
              className="btn-secondary"
              disabled={status === 'pending'}
            >
              Back
            </button>
            <button onClick={onClose} className="btn-secondary">
              Cancel
            </button>
          </div>
        </div>
      )}

      {step === 'complete' && (
        <div className="space-y-4">
          <div className="p-4 bg-success/10 rounded-md flex items-center gap-3">
            <Check className="h-5 w-5 text-success" />
            <p className="text-success">Summary successfully exported to Zotero!</p>
          </div>
          
          <p className="text-gray-700">
            Your summary has been added as a note to "{selectedItem?.title}" in your Zotero library.
          </p>
          
          <div className="flex gap-3">
            <button onClick={onClose} className="btn-primary flex-1">
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

