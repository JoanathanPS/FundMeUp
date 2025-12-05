import regionalData from '../data/regionalData.json'

export interface School {
  schoolName: string
  avgPerformanceScore: number
  verifiedByGov: boolean
  district: string
  type: string
  studentCount: number
}

export interface University {
  name: string
  verifiedByGov: boolean
  type: string
  district: string
  accreditation: string
}

export interface GovernmentScheme {
  name: string
  eligibilityScore: number
  maxAmount: number
  currency: string
}

export interface RegionalData {
  region: string
  schools: School[]
  universities: University[]
  governmentSchemes?: GovernmentScheme[]
}

export class RegionalDataService {
  private static instance: RegionalDataService
  private data: Record<string, RegionalData>

  constructor() {
    this.data = regionalData as Record<string, RegionalData>
  }

  static getInstance(): RegionalDataService {
    if (!RegionalDataService.instance) {
      RegionalDataService.instance = new RegionalDataService()
    }
    return RegionalDataService.instance
  }

  /**
   * Verify student institution against regional data
   */
  verifyInstitution(institutionName: string, region: string): {
    verified: boolean
    confidence: number
    institutionData?: School | University
    reasoning: string
  } {
    const regionData = this.data[region.toLowerCase()]
    
    if (!regionData) {
      return {
        verified: false,
        confidence: 0,
        reasoning: `No regional data available for ${region}`
      }
    }

    // Check schools
    const school = regionData.schools.find(s => 
      s.schoolName.toLowerCase().includes(institutionName.toLowerCase()) ||
      institutionName.toLowerCase().includes(s.schoolName.toLowerCase())
    )

    if (school) {
      return {
        verified: school.verifiedByGov,
        confidence: school.avgPerformanceScore * 10, // Convert to percentage
        institutionData: school,
        reasoning: `Institution verified in ${region} government database. Performance score: ${school.avgPerformanceScore}/10`
      }
    }

    // Check universities
    const university = regionData.universities.find(u => 
      u.name.toLowerCase().includes(institutionName.toLowerCase()) ||
      institutionName.toLowerCase().includes(u.name.toLowerCase())
    )

    if (university) {
      return {
        verified: university.verifiedByGov,
        confidence: 95, // Universities are highly trusted
        institutionData: university,
        reasoning: `University verified in ${region} government database. Accreditation: ${university.accreditation}`
      }
    }

    return {
      verified: false,
      confidence: 0,
      reasoning: `Institution "${institutionName}" not found in ${region} government database`
    }
  }

  /**
   * Get regional statistics
   */
  getRegionalStats(region: string): {
    totalSchools: number
    totalUniversities: number
    avgPerformanceScore: number
    verifiedInstitutions: number
    totalStudents: number
  } {
    const regionData = this.data[region.toLowerCase()]
    
    if (!regionData) {
      return {
        totalSchools: 0,
        totalUniversities: 0,
        avgPerformanceScore: 0,
        verifiedInstitutions: 0,
        totalStudents: 0
      }
    }

    const totalSchools = regionData.schools.length
    const totalUniversities = regionData.universities.length
    const verifiedInstitutions = regionData.schools.filter(s => s.verifiedByGov).length + 
                                regionData.universities.filter(u => u.verifiedByGov).length
    const totalStudents = regionData.schools.reduce((sum, s) => sum + s.studentCount, 0)
    const avgPerformanceScore = regionData.schools.reduce((sum, s) => sum + s.avgPerformanceScore, 0) / totalSchools

    return {
      totalSchools,
      totalUniversities,
      avgPerformanceScore: Math.round(avgPerformanceScore * 10) / 10,
      verifiedInstitutions,
      totalStudents
    }
  }

  /**
   * Get available regions
   */
  getAvailableRegions(): string[] {
    return Object.keys(this.data)
  }

  /**
   * Get government schemes for a region
   */
  getGovernmentSchemes(region: string): GovernmentScheme[] {
    const regionData = this.data[region.toLowerCase()]
    return regionData?.governmentSchemes || []
  }

  /**
   * Check if student is eligible for regional schemes
   */
  checkEligibilityForSchemes(region: string, studentGPA: number): {
    eligible: boolean
    schemes: GovernmentScheme[]
    reasoning: string
  } {
    const schemes = this.getGovernmentSchemes(region)
    const eligibleSchemes = schemes.filter(scheme => studentGPA >= scheme.eligibilityScore)
    
    return {
      eligible: eligibleSchemes.length > 0,
      schemes: eligibleSchemes,
      reasoning: eligibleSchemes.length > 0 
        ? `Student eligible for ${eligibleSchemes.length} government schemes in ${region}`
        : `Student GPA ${studentGPA} below minimum requirement for regional schemes`
    }
  }
}

export default RegionalDataService
