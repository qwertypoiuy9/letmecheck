export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string
          email: string
          graduation_level: string
          year_of_study: string
          target_job_role: string
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name: string
          email: string
          graduation_level: string
          year_of_study: string
          target_job_role: string
          avatar_url?: string | null
        }
        Update: {
          full_name?: string
          email?: string
          graduation_level?: string
          year_of_study?: string
          target_job_role?: string
          avatar_url?: string | null
        }
      }
      resumes: {
        Row: {
          id: string
          user_id: string
          file_url: string
          file_name: string
          target_role: string
          analysis_score: number | null
          analysis_results: Json
          extracted_text: string | null
          status: string
          uploaded_at: string
        }
      }
      skill_gaps: {
        Row: {
          id: string
          user_id: string
          resume_id: string | null
          target_role: string
          missing_skills: Json
          present_skills: Json
          skill_coverage_percent: number
          analyzed_at: string
        }
      }
      courses: {
        Row: {
          id: string
          title: string
          provider: string
          skills_covered: Json
          duration: string | null
          difficulty: string | null
          url: string
          category: string | null
          created_at: string
        }
      }
      user_courses: {
        Row: {
          id: string
          user_id: string
          course_id: string
          status: string
          accessed_at: string | null
          completed_at: string | null
        }
      }
      certificates: {
        Row: {
          id: string
          user_id: string
          user_course_id: string | null
          file_url: string
          extracted_text: string | null
          verification_status: string
          rejection_reason: string | null
          badge_id: string | null
          uploaded_at: string
        }
      }
      badges: {
        Row: {
          id: string
          user_id: string
          certificate_id: string | null
          badge_name: string
          course_name: string
          verification_id: string
          issued_at: string
        }
      }
    }
    Enums: { [_ in never]: never }
  }
}