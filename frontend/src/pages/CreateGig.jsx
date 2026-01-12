// src/pages/CreateGig.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createGig } from '../api/gigApi'
import { Briefcase, FileText } from 'lucide-react'
import toast from 'react-hot-toast'

const CreateGig = () => {
  const [gigData, setGigData] = useState({
    title: '',
    description: '',
    budget: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      await createGig({
        ...gigData,
        budget: parseFloat(gigData.budget) // No currency conversion needed
      })
      
      toast.success('🎉 Job posted successfully!')
      navigate('/')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to post job')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Post a New Job</h1>
        <p className="text-gray-600">Fill in the details below to find the perfect freelancer</p>
      </div>

      <div className="card p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <Briefcase className="w-6 h-6 text-blue-600" />
              <div>
                <h2 className="text-xl font-bold text-gray-900">Job Details</h2>
                <p className="text-gray-600">Tell us what you need done</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Title *
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g., Build a React dashboard with charts"
                  value={gigData.title}
                  onChange={(e) => setGigData({...gigData, title: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                  <textarea
                    className="input-field pl-12 min-h-[200px]"
                    placeholder="Describe the project in detail, including requirements, deliverables, and timeline..."
                    value={gigData.description}
                    onChange={(e) => setGigData({...gigData, description: e.target.value})}
                    required
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Be specific about what you need. Better descriptions attract better proposals.
                </p>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center space-x-3 mb-4">
              <span className="w-6 h-6 text-green-600 font-bold">₹</span>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Budget & Timeline</h2>
                <p className="text-gray-600">Set your budget and expectations</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget (₹) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold">₹</span>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    className="input-field pl-10"
                    placeholder="e.g., 50000"
                    value={gigData.budget}
                    onChange={(e) => setGigData({...gigData, budget: e.target.value})}
                    required
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Enter the budget in Indian Rupees
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary flex items-center space-x-2 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Posting...</span>
                  </>
                ) : (
                  <>
                    <Briefcase className="w-5 h-5" />
                    <span>Post Job</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateGig