// src/pages/Profile.jsx
import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { fetchMyGigs, deleteGig } from '../api/gigApi'
import { fetchMyBids } from '../api/bidApi'
import BidList from '../components/BidList'
import EditGigModal from '../components/EditGigModal'
import { 
  Mail, Briefcase, Award, CheckCircle, Clock, 
  XCircle, Pencil, Trash2, X 
} from 'lucide-react'
import toast from 'react-hot-toast'
import { formatCurrency } from '../utils/currency'

const Profile = () => {
  const { user } = useAuth()
  
  // Tab State
  const [activeTab, setActiveTab] = useState('gigs') // 'gigs' or 'bids'
  
  // Data State
  const [myGigs, setMyGigs] = useState([])
  const [myBids, setMyBids] = useState([])
  const [loading, setLoading] = useState(true)

  // Modal State
  const [selectedGigForProposals, setSelectedGigForProposals] = useState(null)
  const [editingGig, setEditingGig] = useState(null)

  useEffect(() => {
    loadProfileData()
  }, [])

  const loadProfileData = async () => {
    try {
      setLoading(true)
      const [gigsData, bidsData] = await Promise.all([
        fetchMyGigs(),
        fetchMyBids()
      ])
      setMyGigs(gigsData)
      setMyBids(bidsData)
    } catch (error) {
      toast.error('Failed to load profile data')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (gigId) => {
    if (window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      try {
        await deleteGig(gigId)
        toast.success('Gig deleted successfully')
        setMyGigs(myGigs.filter(g => g._id !== gigId))
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete gig')
      }
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* 1. Header Section - Stacked on Mobile */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row items-center md:items-start text-center md:text-left space-y-4 md:space-y-0 md:space-x-6">
        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-3xl md:text-4xl font-bold text-white shrink-0">
          {user?.name?.charAt(0) || 'U'}
        </div>
        
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 truncate">{user?.name}</h1>
          <div className="flex items-center justify-center md:justify-start space-x-2 text-gray-500 mt-2 text-sm md:text-base">
            <Mail className="w-4 h-4 shrink-0" />
            <span className="truncate">{user?.email}</span>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-3 justify-center md:justify-start">
             <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium whitespace-nowrap">
               {myGigs.length} Jobs Posted
             </span>
             <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium whitespace-nowrap">
               {myBids.length} Applications Sent
             </span>
          </div>
        </div>
      </div>

      {/* 2. Tabs Navigation - Full width touch targets on mobile */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('gigs')}
          className={`flex-1 pb-4 px-2 md:px-6 font-medium text-sm md:text-lg transition-colors relative focus:outline-none ${
            activeTab === 'gigs' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <Briefcase className="w-4 h-4 md:w-5 md:h-5" />
            <span>My Posted Jobs</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('bids')}
          className={`flex-1 pb-4 px-2 md:px-6 font-medium text-sm md:text-lg transition-colors relative focus:outline-none ${
            activeTab === 'bids' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <Award className="w-4 h-4 md:w-5 md:h-5" />
            <span>My Applications</span>
          </div>
        </button>
      </div>

      {/* 3. Content Area */}
      {loading ? (
        <div className="text-center py-10">Loading data...</div>
      ) : (
        <div className="min-h-[300px]">
          
          {/* --- TAB 1: MY GIGS --- */}
          {activeTab === 'gigs' && (
            <div className="space-y-4">
              {myGigs.length === 0 ? (
                <div className="text-center py-10 text-gray-500 border-2 border-dashed rounded-xl">
                  <Briefcase className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                  <p>You haven't posted any jobs yet.</p>
                </div>
              ) : (
                myGigs.map((gig) => (
                  <div key={gig._id} className="bg-white p-4 md:p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition">
                    {/* Header: Title & Status */}
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 md:gap-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg md:text-xl text-gray-900 leading-tight">{gig.title}</h3>
                        <p className="text-gray-500 text-sm mt-1">Posted on {new Date(gig.createdAt).toLocaleDateString()}</p>
                      </div>
                      <span className={`self-start px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        gig.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {gig.status}
                      </span>
                    </div>

                    {/* Footer: Budget & Actions */}
                    <div className="mt-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <span className="font-semibold text-gray-700 bg-gray-50 px-3 py-1 rounded-md">
                        Budget: {formatCurrency(gig.budget)}
                      </span>
                      
                      {/* Action Buttons - Stack/Wrap on mobile */}
                      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                        <button 
                          onClick={() => setSelectedGigForProposals(gig)}
                          className="flex-1 md:flex-none text-center text-blue-600 font-medium hover:underline text-sm py-2 px-2 bg-blue-50 md:bg-transparent rounded-md md:rounded-none"
                        >
                          View Proposals
                        </button>
                        
                        <div className="hidden md:block h-4 w-px bg-gray-300"></div>
                        
                        <button 
                          onClick={() => setEditingGig(gig)}
                          className="flex-1 md:flex-none flex items-center justify-center gap-1 text-gray-600 hover:text-blue-600 text-sm font-medium transition py-2 px-2 border md:border-none rounded-md"
                        >
                          <Pencil className="w-4 h-4" /> <span className="md:hidden lg:inline">Edit</span>
                        </button>
                        
                        <button 
                          onClick={() => handleDelete(gig._id)}
                          className="flex-1 md:flex-none flex items-center justify-center gap-1 text-gray-600 hover:text-red-600 text-sm font-medium transition py-2 px-2 border md:border-none rounded-md"
                        >
                          <Trash2 className="w-4 h-4" /> <span className="md:hidden lg:inline">Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* --- TAB 2: MY BIDS --- */}
          {activeTab === 'bids' && (
            <div className="space-y-4">
              {myBids.length === 0 ? (
                <div className="text-center py-10 text-gray-500 border-2 border-dashed rounded-xl">
                  <Award className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                  <p>You haven't applied to any jobs yet.</p>
                </div>
              ) : (
                myBids.map((bid) => (
                  <div key={bid._id} className="bg-white p-4 md:p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-900 leading-tight">
                          {bid.gigId ? bid.gigId.title : 'Deleted Gig'}
                        </h3>
                        <p className="text-gray-600 mt-2 text-sm italic border-l-2 border-gray-200 pl-3">
                          "{bid.message}"
                        </p>
                      </div>
                      
                      {/* Price - Row on mobile, Col on Desktop */}
                      <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto bg-gray-50 md:bg-transparent p-3 md:p-0 rounded-lg">
                        <span className="text-xs text-gray-500 md:order-2">Bid Amount</span>
                        <span className="font-bold text-lg text-gray-900 md:order-1">{formatCurrency(bid.price)}</span>
                      </div>
                    </div>
                    
                    {/* Footer */}
                    <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                      <span className="text-sm text-gray-500 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        Applied: {new Date(bid.createdAt).toLocaleDateString()}
                      </span>
                      
                      {/* STATUS BADGES */}
                      <div className="self-start md:self-auto">
                        {bid.status === 'pending' && (
                          <span className="flex items-center space-x-1 text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full text-sm font-medium">
                            <Clock className="w-4 h-4" /> <span>Pending</span>
                          </span>
                        )}
                        {bid.status === 'hired' && (
                          <span className="flex items-center space-x-1 text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm font-medium">
                            <CheckCircle className="w-4 h-4" /> <span>Hired!</span>
                          </span>
                        )}
                        {bid.status === 'rejected' && (
                          <span className="flex items-center space-x-1 text-red-600 bg-red-50 px-3 py-1 rounded-full text-sm font-medium">
                            <XCircle className="w-4 h-4" /> <span>Rejected</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {/* --- MODAL 1: EDIT GIG --- */}
      {editingGig && (
        <EditGigModal 
          gig={editingGig}
          onClose={() => setEditingGig(null)}
          onSuccess={() => {
            setEditingGig(null)
            loadProfileData()
          }}
        />
      )}

      {/* --- MODAL 2: VIEW PROPOSALS --- */}
      {selectedGigForProposals && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-4 md:p-6 relative shadow-2xl">
            <button 
              onClick={() => setSelectedGigForProposals(null)}
              className="absolute top-4 right-4 p-2 text-gray-500 hover:bg-gray-100 rounded-full transition"
            >
              <X className="w-6 h-6" />
            </button>
            
            <BidList 
              gigId={selectedGigForProposals._id} 
              gigTitle={selectedGigForProposals.title} 
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile