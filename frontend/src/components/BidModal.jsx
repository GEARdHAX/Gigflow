// src/components/BidModal.jsx
import { useState } from 'react'
import { X, MessageSquare } from 'lucide-react'
import { placeBid } from '../api/bidApi'
import toast from 'react-hot-toast'
import { formatCurrency } from '../utils/currency'

const BidModal = ({ gig, onClose, onSuccess }) => {
  const [bidData, setBidData] = useState({
    price: '',
    message: ''
  })
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      await placeBid({
        gigId: gig._id,
        price: parseFloat(bidData.price), // No currency conversion needed
        message: bidData.message
      })
      
      toast.success('🎉 Bid submitted successfully!')
      onSuccess()
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to submit bid';
      
      if (errorMessage.includes('already placed a bid')) {
        toast.error('⚠️ You have already applied for this job!');
        onClose();
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl flex justify-between items-center z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Submit Proposal</h2>
            <p className="text-sm text-gray-500 mt-1">
              For: <span className="font-semibold">{gig.title}</span> (Budget: {formatCurrency(gig.budget)})
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-gray-500 font-bold">₹</span>
                <span>Your Bid Amount (₹)</span>
              </div>
            </label>
            <input
              type="number"
              step="1"
              min="1"
              max={gig.budget}
              className="input-field w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder={`Enter amount in rupees (Max ${formatCurrency(gig.budget)})`}
              value={bidData.price}
              onChange={(e) => setBidData({...bidData, price: e.target.value})}
              required
            />
            <p className="text-xs text-gray-500 mt-1">Enter your bid amount in Indian Rupees</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-gray-500" />
                <span>Cover Letter</span>
              </div>
            </label>
            <textarea
              className="input-field w-full p-3 border rounded-lg min-h-[150px] focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              value={bidData.message}
              onChange={(e) => setBidData({...bidData, message: e.target.value})}
              placeholder="Why are you the best fit for this job?"
              required
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-blue-300 flex items-center"
            >
              {submitting ? 'Submitting...' : 'Submit Proposal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BidModal