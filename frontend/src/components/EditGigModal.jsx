// src/components/EditGigModal.jsx
import { useState } from 'react'
import { X, Briefcase, FileText } from 'lucide-react'
import { updateGig } from '../api/gigApi'
import toast from 'react-hot-toast'
import { formatForInput } from '../utils/currency'

const EditGigModal = ({ gig, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: gig.title,
    description: gig.description,
    budget: formatForInput(gig.budget) // Use formatForInput
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await updateGig(gig._id, {
        ...formData,
        budget: parseFloat(formData.budget) // No currency conversion needed
      })
      toast.success('Gig updated successfully')
      onSuccess()
    } catch (error) {
      toast.error('Failed to update gig')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold">Edit Job Post</h2>
          <button onClick={onClose}><X className="w-6 h-6 text-gray-500 hover:text-black" /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                className="input-field pl-10"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Budget (₹)</label>
            <div className="relative">
              <span className="absolute left-3 top-3 w-5 h-5 text-gray-400 flex items-center justify-center font-bold">₹</span>
              <input
                type="number"
                className="input-field pl-10"
                value={formData.budget}
                onChange={(e) => setFormData({...formData, budget: e.target.value})}
                required
                min="1"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Enter amount in Indian Rupees</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <textarea
                className="input-field pl-10 min-h-[120px] resize-none"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditGigModal