// src/components/GigCard.jsx
import { Calendar, Clock, CheckCircle } from 'lucide-react'
import { formatCurrency } from '../utils/currency'

const GigCard = ({ gig, user, onBidClick, hasApplied }) => {
  const gigOwnerId = gig.ownerId?._id || gig.ownerId
  const gigOwnerName = gig.ownerId?.name || 'Unknown User'
  
  const isOwner = user?._id === gigOwnerId
  const isOpen = gig.status === 'open'

  return (
    <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
      
      {/* Header: Stack Title and Budget on Mobile */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
        <div>
          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors cursor-pointer leading-tight">
            {gig.title}
          </h3>
          
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-1">
            <div className="flex items-center space-x-1">
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center text-xs text-white font-bold">
                {gigOwnerName.charAt(0).toUpperCase()}
              </div>
              <span className="truncate max-w-[100px]">{gigOwnerName}</span>
            </div>
            
            <div className="hidden sm:flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{new Date(gig.createdAt).toLocaleDateString()}</span>
            </div>
            
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              isOpen ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {isOpen ? 'Open' : 'Assigned'}
            </span>
          </div>
        </div>

        {/* Budget Badge */}
        <div className="flex items-center self-start bg-blue-50 px-3 py-2 rounded-lg whitespace-nowrap">
          <span className="text-lg font-bold text-gray-900">{formatCurrency(gig.budget)}</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 mb-6 line-clamp-2 text-sm md:text-base">
        {gig.description}
      </p>

      {/* Footer: Stack Date and Actions on Mobile */}
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between pt-4 border-t border-gray-50">
        <div className="flex items-center text-sm text-gray-500">
          <Clock className="w-4 h-4 mr-1" />
          <span>Posted {new Date(gig.createdAt).toLocaleDateString()}</span>
        </div>

        <div className="flex w-full sm:w-auto">
          {/* Action Buttons - Full width on mobile */}
          {isOwner ? (
            <button
              onClick={() => onBidClick(gig)}
              className="w-full sm:w-auto px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition text-center"
            >
              Manage Bids
            </button>
          ) : hasApplied ? (
            <span className="w-full sm:w-auto px-4 py-2 bg-green-50 text-green-600 border border-green-200 rounded-lg font-medium flex items-center justify-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Applied
            </span>
          ) : isOpen ? (
            <button
              onClick={() => onBidClick(gig)}
              className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition shadow-sm text-center"
            >
              Apply Now
            </button>
          ) : (
            <span className="w-full sm:w-auto px-4 py-2 bg-gray-100 text-gray-400 rounded-lg font-medium cursor-not-allowed text-center">
              Position Filled
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default GigCard