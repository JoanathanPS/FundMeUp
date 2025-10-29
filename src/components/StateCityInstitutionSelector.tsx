import React, { useState, useEffect } from 'react'
import { AlertCircle, CheckCircle, MapPin } from 'lucide-react'

interface InstitutionSelectorProps {
  selectedState: string
  onStateChange: (state: string) => void
  selectedCity: string
  onCityChange: (city: string) => void
  selectedInstitution: string
  onInstitutionChange: (institution: string) => void
  customInstitution: string
  onCustomInstitutionChange: (institution: string) => void
}

// Indian States and Cities
const INDIAN_STATES_AND_CITIES: Record<string, string[]> = {
  'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Tirupati'],
  'Arunachal Pradesh': ['Itanagar', 'Naharlagun', 'Pasighat', 'Tezu', 'Bomdila'],
  'Assam': ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Nagaon'],
  'Bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Purnia'],
  'Chhattisgarh': ['Raipur', 'Bhilai', 'Bilaspur', 'Korba', 'Raigarh'],
  'Goa': ['Panaji', 'Margao', 'Vasco da Gama', 'Mapusa', 'Ponda'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar'],
  'Haryana': ['Gurgaon', 'Faridabad', 'Panipat', 'Rohtak', 'Karnal'],
  'Himachal Pradesh': ['Shimla', 'Manali', 'Dharamshala', 'Solan', 'Mandi'],
  'Jharkhand': ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Hazaribagh'],
  'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum'],
  'Kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam'],
  'Madhya Pradesh': ['Bhopal', 'Indore', 'Gwalior', 'Jabalpur', 'Ujjain'],
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad'],
  'Manipur': ['Imphal', 'Thoubal', 'Bishnupur', 'Churachandpur', 'Senapati'],
  'Meghalaya': ['Shillong', 'Tura', 'Jowai', 'Nongpoh', 'Williamnagar'],
  'Mizoram': ['Aizawl', 'Lunglei', 'Saiha', 'Champhai', 'Kolasib'],
  'Nagaland': ['Kohima', 'Dimapur', 'Mokokchung', 'Tuensang', 'Wokha'],
  'Odisha': ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur', 'Sambalpur'],
  'Punjab': ['Chandigarh', 'Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala'],
  'Rajasthan': ['Jaipur', 'Jodhpur', 'Kota', 'Bikaner', 'Ajmer'],
  'Sikkim': ['Gangtok', 'Namchi', 'Mangan', 'Gyalshing', 'Singtam'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem'],
  'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam'],
  'Tripura': ['Agartala', 'Dharmanagar', 'Udaipur', 'Kailasahar', 'Belonia'],
  'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Agra', 'Allahabad', 'Varanasi'],
  'Uttarakhand': ['Dehradun', 'Haridwar', 'Roorkee', 'Nainital', 'Mussoorie'],
  'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri'],
  'Delhi': ['New Delhi', 'Central Delhi', 'North Delhi', 'South Delhi', 'East Delhi']
}

// Major Institutions (can be expanded)
const MAJOR_INSTITUTIONS: Record<string, Record<string, string[]>> = {
  'Karnataka': {
    'Bangalore': ['Indian Institute of Science (IISc)', 'Indian Institute of Management Bangalore', 'National Institute of Mental Health and Neurosciences', 'Bangalore University', 'Christ University'],
    'Mysore': ['University of Mysore', 'JSS Academy of Higher Education & Research'],
    'Mangalore': ['Manipal University', 'St. Joseph Engineering College']
  },
  'Maharashtra': {
    'Mumbai': ['Indian Institute of Technology Bombay', 'University of Mumbai', 'Tata Institute of Social Sciences', 'Xavier Institute of Communications'],
    'Pune': ['University of Pune', 'College of Engineering, Pune', 'Fergusson College']
  },
  'Tamil Nadu': {
    'Chennai': ['Indian Institute of Technology Madras', 'Anna University', 'Loyola College', 'Madras Medical College'],
    'Coimbatore': ['Amrita Vishwa Vidyapeetham', 'PSG College of Technology']
  },
  'Kerala': {
    'Thiruvananthapuram': ['University of Kerala', 'College of Engineering Trivandrum'],
    'Kochi': ['Cochin University of Science and Technology', 'Amrita School of Engineering', 'Maharaja\'s College'],
    'Kozhikode': ['Indian Institute of Management Kozhikode', 'National Institute of Technology Calicut']
  },
  'Gujarat': {
    'Ahmedabad': ['Indian Institute of Management Ahmedabad', 'Gujarat University', 'Ahmedabad University'],
    'Surat': ['Veer Narmad South Gujarat University', 'Sardar Vallabhbhai National Institute of Technology']
  },
  'West Bengal': {
    'Kolkata': ['Indian Institute of Technology Kharagpur', 'Jadavpur University', 'Presidency University', 'Calcutta University']
  }
}

const StateCityInstitutionSelector: React.FC<InstitutionSelectorProps> = ({
  selectedState,
  onStateChange,
  selectedCity,
  onCityChange,
  selectedInstitution,
  onInstitutionChange,
  customInstitution,
  onCustomInstitutionChange
}) => {
  const [showCustomInput, setShowCustomInput] = useState(false)
  const [institutionStatus, setInstitutionStatus] = useState<'verified' | 'pending' | 'unknown'>('unknown')

  const cities = selectedState ? INDIAN_STATES_AND_CITIES[selectedState] || [] : []
  const institutions = (selectedState && selectedCity && MAJOR_INSTITUTIONS[selectedState]?.[selectedCity]) || []

  useEffect(() => {
    // Check if institution exists in database
    if (selectedInstitution && selectedInstitution !== 'custom' && selectedInstitution !== 'unknown') {
      setInstitutionStatus('verified')
    } else if (selectedInstitution === 'unknown' || selectedInstitution === 'custom') {
      setInstitutionStatus('pending')
    } else {
      setInstitutionStatus('unknown')
    }
  }, [selectedInstitution])

  useEffect(() => {
    // Reset institution when state or city changes
    onInstitutionChange('')
    setShowCustomInput(false)
  }, [selectedState, selectedCity])

  return (
    <div className="space-y-6">
      {/* State Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          State <span className="text-red-500">*</span>
        </label>
        <select
          value={selectedState}
          onChange={(e) => onStateChange(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          required
        >
          <option value="">Select your state</option>
          {Object.keys(INDIAN_STATES_AND_CITIES).map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
      </div>

      {/* City Selector */}
      {selectedState && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            City <span className="text-red-500">*</span>
          </label>
          <select
            value={selectedCity}
            onChange={(e) => onCityChange(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            required
          >
            <option value="">Select your city</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Institution Selector */}
      {selectedCity && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Institution <span className="text-red-500">*</span>
          </label>
          
          {institutions.length > 0 ? (
            <select
              value={selectedInstitution}
              onChange={(e) => {
                const value = e.target.value
                onInstitutionChange(value)
                if (value === 'unknown') {
                  setShowCustomInput(true)
                } else {
                  setShowCustomInput(false)
                }
              }}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              required
            >
              <option value="">Select your institution</option>
              {institutions.map((inst) => (
                <option key={inst} value={inst}>
                  {inst}
                </option>
              ))}
              <option value="unknown">My institution is not listed</option>
            </select>
          ) : (
            <input
              type="text"
              value={customInstitution}
              onChange={(e) => onCustomInstitutionChange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Enter your institution name"
              required
            />
          )}

          {/* Custom Institution Input */}
          {(showCustomInput || selectedInstitution === 'unknown') && (
            <div className="mt-4">
              <input
                type="text"
                value={customInstitution}
                onChange={(e) => onCustomInstitutionChange(e.target.value)}
                className="w-full px-4 py-3 border border-yellow-300 dark:border-yellow-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Enter your institution name"
                required
              />
              
              {/* Status Message */}
              <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">
                      Unknown Institution
                    </p>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                      Your institution will be verified by admin. You can still proceed with your application.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Institution Status Indicator */}
          {selectedInstitution && selectedInstitution !== 'unknown' && selectedInstitution !== 'custom' && (
            <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <p className="text-sm text-green-800 dark:text-green-200">
                  Institution verified and ready for verification process
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default StateCityInstitutionSelector

