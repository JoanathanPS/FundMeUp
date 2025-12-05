import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Save, User, Mail, GraduationCap, Calendar, Building, Globe, Upload } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface StudentProfile {
  name: string
  email: string
  field: string
  year: number
  country: string
  institution: string
  bio: string
  wallet: string
}

interface EditProfileModalProps {
  isOpen: boolean
  onClose: () => void
  currentProfile?: Partial<StudentProfile>
  onSave?: (profile: StudentProfile) => void
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onSave
}) => {
  const [formData, setFormData] = useState<StudentProfile>({
    name: currentProfile?.name || '',
    email: currentProfile?.email || '',
    field: currentProfile?.field || '',
    year: currentProfile?.year || 1,
    country: currentProfile?.country || '',
    institution: currentProfile?.institution || '',
    bio: currentProfile?.bio || '',
    wallet: currentProfile?.wallet || ''
  })
  
  const [errors, setErrors] = useState<Partial<Record<keyof StudentProfile, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (field: keyof StudentProfile, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof StudentProfile, string>> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }
    
    if (!formData.field.trim()) {
      newErrors.field = 'Field of study is required'
    }
    
    if (!formData.country.trim()) {
      newErrors.country = 'Country is required'
    }
    
    if (!formData.institution.trim()) {
      newErrors.institution = 'Institution is required'
    }
    
    if (formData.bio.length > 500) {
      newErrors.bio = 'Bio must be less than 500 characters'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validate()) {
      toast.error('Please fix the errors in the form')
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Save to localStorage
      localStorage.setItem('studentProfile', JSON.stringify(formData))
      
      onSave?.(formData)
      toast.success('Profile updated successfully!')
      onClose()
    } catch (error) {
      toast.error('Failed to update profile')
      console.error('Update error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    if (currentProfile) {
      setFormData({
        name: currentProfile?.name || '',
        email: currentProfile?.email || '',
        field: currentProfile?.field || '',
        year: currentProfile?.year || 1,
        country: currentProfile?.country || '',
        institution: currentProfile?.institution || '',
        bio: currentProfile?.bio || '',
        wallet: currentProfile?.wallet || ''
      })
    }
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Edit Profile
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)] space-y-4">
            {/* Name */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <User className="h-4 w-4" />
                <span>Full Name</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Enter your full name"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Mail className="h-4 w-4" />
                <span>Email Address</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="your.email@institution.edu"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Field & Year */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <GraduationCap className="h-4 w-4" />
                  <span>Field of Study</span>
                </label>
                <input
                  type="text"
                  value={formData.field}
                  onChange={(e) => handleChange('field', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    errors.field ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Computer Science"
                />
                {errors.field && <p className="text-red-500 text-xs mt-1">{errors.field}</p>}
              </div>

              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Calendar className="h-4 w-4" />
                  <span>Year of Study</span>
                </label>
                <select
                  value={formData.year}
                  onChange={(e) => handleChange('year', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {[1, 2, 3, 4, 5, 6].map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Institution & Country */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Building className="h-4 w-4" />
                  <span>Institution</span>
                </label>
                <input
                  type="text"
                  value={formData.institution}
                  onChange={(e) => handleChange('institution', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    errors.institution ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="University Name"
                />
                {errors.institution && <p className="text-red-500 text-xs mt-1">{errors.institution}</p>}
              </div>

              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Globe className="h-4 w-4" />
                  <span>Country</span>
                </label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => handleChange('country', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    errors.country ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="India"
                />
                {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <span>Bio</span>
                <span className="text-xs text-gray-500">({formData.bio.length}/500)</span>
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => handleChange('bio', e.target.value)}
                rows={4}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none ${
                  errors.bio ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Tell us about your goals and aspirations..."
              />
              {errors.bio && <p className="text-red-500 text-xs mt-1">{errors.bio}</p>}
            </div>

            {/* Wallet (Read-only) */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <span>Wallet Address</span>
              </label>
              <input
                type="text"
                value={formData.wallet || 'Not connected'}
                disabled
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-500 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default EditProfileModal

