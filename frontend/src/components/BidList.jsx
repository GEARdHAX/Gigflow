// src/components/BidList.jsx
import { useState, useEffect } from 'react'
import { fetchBids, hireFreelancer } from '../api/bidApi'
import { CheckCircle, XCircle, Clock, MessageSquare, BarChart3 } from 'lucide-react'
import toast from 'react-hot-toast'
import { formatCurrency } from '../utils/currency'

const BidList = ({ gigId, gigTitle }) => {
  const [bids, setBids] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadBids()
  }, [gigId])

  const loadBids = async () => {
    try {
      setLoading(true)
      const data = await fetchBids(gigId)
      setBids(data)
    } catch (error) {
      toast.error('Failed to load bids')
    } finally {
      setLoading(false)
    }
  }

  const handleHire = async (bidId, freelancerName) => {
    if (!window.confirm(`Are you sure you want to hire ${freelancerName}?`)) return;

    try {
      await hireFreelancer(bidId)
      toast.success(`🎉 Successfully hired ${freelancerName}!`)
      loadBids() 
    } catch (error) {
      toast.error(error.response?.data?.message || 'Hiring failed')
    }
  }

  // Helper to determine badge color based on score
  const getScoreColor = (score) => {
    if (score >= 80) return 'bg-green-100 text-green-700 border-green-200';
    if (score >= 50) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    return 'bg-gray-100 text-gray-600 border-gray-200';
  }

  if (loading) return <div className="p-8 text-center text-gray-500">Loading proposals...</div>
  console.log(bids)

  return (
    <div className="bg-white">
      <div className="border-b pb-4 mb-4 flex justify-between items-end">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Manage Proposals</h3>
          <p className="text-gray-500 text-sm">Job: {gigTitle}</p>
        </div>
        <div className="text-xs text-gray-400 italic">
          * Sorted by ATS Match Score
        </div>
      </div>

      <div className="space-y-4">
        {bids.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed">
            <MessageSquare className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500">No proposals received yet.</p>
          </div>
        ) : (
          bids.map((bid) => (
            <div 
              key={bid._id} 
              className={`border rounded-xl p-5 transition-all ${
                bid.status === 'hired' ? 'border-green-300 bg-green-50 ring-1 ring-green-300' :
                bid.status === 'rejected' ? 'border-red-100 bg-red-50 opacity-60' :
                'border-gray-200 hover:shadow-md'
              }`}
            >
              <div className="flex flex-col md:flex-row justify-between gap-4">
                {/* LEFT SIDE: Candidate Info */}
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-bold text-lg text-gray-900">
                      {bid.freelancerId?.name || 'Unknown User'}
                    </span>
                    
                    {/* ATS SCORE BADGE */}
                    <div className={`flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-bold border ${getScoreColor(bid.atsScore)}`}>
                      <BarChart3 className="w-3 h-3" />
                      <span>{bid.atsScore || 0}% Match</span>
                    </div>
                  </div>
                  
                  <div className="text-green-700 font-bold mb-2">{formatCurrency(bid.price)}</div>
                  
                  <p className="text-gray-600 mb-3 text-sm leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">
                    "{bid.message}"
                  </p>
                  
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="w-3 h-3 mr-1" />
                    Applied: {new Date(bid.createdAt).toLocaleDateString()}
                  </div>
                </div>

                {/* RIGHT SIDE: Actions */}
                <div className="flex flex-col items-end justify-center min-w-[140px] space-y-3 pl-4 md:border-l border-gray-100">
                  {bid.status === 'pending' && (
                    <button
                      onClick={() => handleHire(bid._id, bid.freelancerId?.name)}
                      className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Hire</span>
                    </button>
                  )}
                  
                  {bid.status === 'hired' && (
                    <div className="flex flex-col items-center text-green-600">
                      <CheckCircle className="w-8 h-8 mb-1" />
                      <span className="font-bold text-sm">HIRED</span>
                    </div>
                  )}
                  
                  {bid.status === 'rejected' && (
                    <div className="flex flex-col items-center text-red-400">
                      <XCircle className="w-8 h-8 mb-1" />
                      <span className="font-bold text-sm">REJECTED</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default BidList