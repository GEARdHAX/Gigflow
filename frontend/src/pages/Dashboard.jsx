// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { fetchGigs } from '../api/gigApi'
import { fetchMyBids } from '../api/bidApi'
import GigCard from '../components/GigCard'
import BidModal from '../components/BidModal'
import BidList from '../components/BidList'
import { Search, Briefcase, X } from 'lucide-react'

const Dashboard = () => {
  const { user } = useAuth()
  
  const [gigs, setGigs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [appliedGigIds, setAppliedGigIds] = useState(new Set()) 
  const [selectedGigForBid, setSelectedGigForBid] = useState(null)
  const [selectedGigForManagement, setSelectedGigForManagement] = useState(null)

  useEffect(() => {
    loadData()
  }, [searchQuery, user])

  const loadData = async () => {
    try {
      setLoading(true)
      const promises = [fetchGigs(searchQuery)]
      if (user) promises.push(fetchMyBids())

      const results = await Promise.all(promises)
      setGigs(results[0])

      if (results[1]) {
        const ids = new Set(results[1].map(bid => bid.gigId?._id || bid.gigId))
        setAppliedGigIds(ids)
      } else {
        setAppliedGigIds(new Set())
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGigAction = (gig) => {
    const gigOwnerId = gig.ownerId?._id || gig.ownerId
    if (user && user._id === gigOwnerId) {
      setSelectedGigForManagement(gig)
    } else {
      setSelectedGigForBid(gig)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* --- HERO SECTION --- */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          {user ? `Welcome back, ${user.name}!` : 'Find your next gig'}
        </h1>
        <p className="text-gray-600">
          Browse the latest opportunities or post your own job.
        </p>
      </div>

      {/* --- RESPONSIVE SEARCH BAR --- */}
      <div className="card p-4 md:p-6 mb-8 bg-white rounded-xl shadow-sm border border-gray-100">
        <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search jobs..."
              className="input-field pl-12 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button 
            type="button" 
            onClick={loadData} 
            className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Search
          </button>
        </form>
      </div>

      {/* --- GIGS GRID --- */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">
            Open Opportunities ({gigs.length})
          </h2>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading opportunities...</div>
        ) : gigs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg border border-dashed">
            <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700">No jobs found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your search terms</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {gigs.map((gig) => (
              <GigCard 
                key={gig._id} 
                gig={gig} 
                user={user}
                onBidClick={handleGigAction}
                hasApplied={appliedGigIds.has(gig._id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* --- MODALS --- */}
      {selectedGigForBid && (
        <BidModal
          gig={selectedGigForBid}
          onClose={() => setSelectedGigForBid(null)}
          onSuccess={() => {
            setSelectedGigForBid(null)
            loadData()
          }}
        />
      )}

      {selectedGigForManagement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-4 md:p-6 relative shadow-2xl">
            <button 
              onClick={() => setSelectedGigForManagement(null)}
              className="absolute top-4 right-4 p-2 text-gray-500 hover:bg-gray-100 rounded-full transition"
            >
              <X className="w-6 h-6" />
            </button>
            <BidList 
              gigId={selectedGigForManagement._id} 
              gigTitle={selectedGigForManagement.title} 
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard