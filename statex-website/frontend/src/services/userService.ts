import { env } from '@/config/env';

export interface ContactInfo {
  type: string;
  value: string;
  is_primary: boolean;
}

export interface UserProfile {
  user_id: string;
  name: string;
  contact_info: ContactInfo[];
  created_at: string;
  last_activity: string;
  total_submissions: number;
}

export interface Submission {
  submission_id: string;
  user_id: string;
  page_type: string;
  description: string;
  files: any[];
  voice_recording?: any;
  created_at: string;
  status: string;
}

export interface ContactData {
  name: string;
  contactType: string;
  contactValue: string;
}

export interface UserRegistrationData {
  name: string;
  contact_info: ContactInfo[];
  source: string;
  session_id?: string;
}

export interface ContactCollectionRequest {
  session_id: string;
  name: string;
  contact_type: string;
  contact_value: string;
  source: string;
}

class UserService {
  private baseUrl = `${env.USER_PORTAL_URL}/api/users`;

  /**
   * Find existing user by contact information or create new user
   */
  async findOrCreateUser(userData: UserRegistrationData): Promise<{
    success: boolean;
    user_id: string;
    session_id: string;
    message: string;
    is_new_user: boolean;
  }> {
    // For development, implement user identification based on contact info
    if (process.env.NODE_ENV === 'development') {
      console.log('Development mode: Finding or creating user based on contact info');
      
      // Create a consistent user ID based on contact information
      const contactInfo = userData.contact_info[0];
      const contactValue = contactInfo?.value || '';
      const name = userData.name || '';
      
      // Create a hash-like identifier based on contact info
      const userIdentifier = `${name}-${contactValue}`.toLowerCase().replace(/[^a-z0-9]/g, '');
      const userId = `user-${userIdentifier}-${Date.now().toString().slice(-6)}`;
      
      // Check if we already have this user in localStorage
      const existingUserId = this.getUserId();
      const identifierPrefix = userIdentifier.split('-')[0] || '';
      if (existingUserId && existingUserId.includes(identifierPrefix)) {
        console.log('✅ Found existing user:', existingUserId);
        return {
          success: true,
          user_id: existingUserId,
          session_id: userData.session_id || this.getSessionId() || this.generateSessionId(),
          message: 'Existing user found',
          is_new_user: false
        };
      }
      
      // Store the new user ID
      this.storeUserId(userId);
      const sessionId = userData.session_id || this.generateSessionId();
      this.storeSessionId(sessionId);
      
      console.log('✅ Created new user:', userId);
      return {
        success: true,
        user_id: userId,
        session_id: sessionId,
        message: 'New user created',
        is_new_user: true
      };
    }

    // For production, implement proper user identification
    try {
      // Convert to simple format for the API
      const simpleData = {
        name: userData.name,
        contact_type: userData.contact_info[0]?.type || 'email',
        contact_value: userData.contact_info[0]?.value || '',
        source: userData.source,
        session_id: userData.session_id
      };

      const response = await fetch(`${this.baseUrl}/register-simple`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(simpleData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Failed to register user:', error);
      throw new Error('Failed to register user. Please try again.');
    }
  }

  /**
   * Register a new user or update existing user (legacy method)
   */
  async registerUser(userData: UserRegistrationData): Promise<{
    success: boolean;
    user_id: string;
    session_id: string;
    message: string;
    is_new_user: boolean;
  }> {
    // Use the new findOrCreateUser method
    return this.findOrCreateUser(userData);
  }

  /**
   * Collect contact information after form submission
   */
  async collectContactInfo(request: ContactCollectionRequest): Promise<{
    success: boolean;
    user_id: string;
    message: string;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/collect-contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to collect contact info:', error);
      throw new Error('Failed to collect contact information. Please try again.');
    }
  }

  /**
   * Create a new submission for a user
   */
  async createSubmission(userId: string, submission: Omit<Submission, 'submission_id' | 'created_at'>): Promise<{
    success: boolean;
    submission_id: string;
    message: string;
  }> {
    // For development, skip submission creation if user portal is not available
    if (process.env.NODE_ENV === 'development') {
      console.log('Development mode: Skipping submission creation');
      return { 
        success: true, 
        submission_id: 'dev-submission-' + Date.now(),
        message: 'Submission created in development mode'
      };
    }

    try {
      // Generate submission_id and created_at
      const submissionId = this.generateSubmissionId();
      const createdAt = new Date().toISOString();
      
      const fullSubmission = {
        ...submission,
        submission_id: submissionId,
        created_at: createdAt
      };

      const response = await fetch(`${this.baseUrl}/${userId}/submissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fullSubmission),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to create submission:', error);
      throw new Error('Failed to create submission. Please try again.');
    }
  }

  /**
   * Get user profile and submission history
   */
  async getUserProfile(userId: string): Promise<{
    success: boolean;
    user: UserProfile;
    submissions: Submission[];
    total_submissions: number;
  }> {
    // For development, fetch from AI orchestrator instead of user portal
    if (process.env.NODE_ENV === 'development') {
      console.log('Development mode: Fetching user profile from AI orchestrator');
      try {
        const response = await fetch(`${env.AI_SERVICE_URL}/api/submissions`);
        
        if (!response.ok) {
          throw new Error(`AI orchestrator error! status: ${response.status}`);
        }
        
        const data = await response.json();
        const userSubmissions = data.submissions.filter((submission: any) => 
          submission.user_id === userId
        );
        
        // Get user info from the first submission or use defaults
        const firstSubmission = userSubmissions[0];
        const userInfo = firstSubmission?.contact_info || {};
        
        // Convert AI orchestrator format to user service format
        const submissions: Submission[] = userSubmissions.map((submission: any) => ({
          submission_id: submission.submission_id,
          user_id: submission.user_id,
          page_type: submission.submission_type || 'contact',
          description: submission.text_content || 'No description provided',
          files: submission.file_urls ? submission.file_urls.map((url: string) => ({
            name: url.split('/').pop() || 'Unknown file',
            originalName: url.split('/').pop() || 'Unknown file',
            fileSize: 0,
            url: url
          })) : [],
          voice_recording: submission.voice_file_url ? {
            recordingTime: 0,
            url: submission.voice_file_url
          } : undefined,
          created_at: submission.created_at,
          status: submission.status
        }));
        
        return {
          success: true,
          user: {
            user_id: userId,
            name: userInfo.name || 'Development User',
            contact_info: [
              {
                type: 'email',
                value: userInfo.email || 'dev@example.com',
                is_primary: true
              }
            ],
            created_at: firstSubmission?.created_at || new Date().toISOString(),
            last_activity: firstSubmission?.updated_at || new Date().toISOString(),
            total_submissions: submissions.length
          },
          submissions,
          total_submissions: submissions.length
        };
      } catch (error) {
        console.error('Failed to fetch user profile from AI orchestrator:', error);
        return {
          success: false,
          user: {
            user_id: userId,
            name: 'Development User',
            contact_info: [
              {
                type: 'email',
                value: 'dev@example.com',
                is_primary: true
              }
            ],
            created_at: new Date().toISOString(),
            last_activity: new Date().toISOString(),
            total_submissions: 0
          },
          submissions: [],
          total_submissions: 0
        };
      }
    }

    try {
      const response = await fetch(`${this.baseUrl}/${userId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get user profile:', error);
      throw new Error('Failed to load user profile. Please try again.');
    }
  }

  /**
   * Get all submissions for a user
   */
  async getUserSubmissions(userId: string): Promise<{
    success: boolean;
    submissions: Submission[];
    total: number;
  }> {
    // For development, fetch from AI orchestrator instead of user portal
    if (process.env.NODE_ENV === 'development') {
      console.log('Development mode: Fetching submissions from AI orchestrator');
      try {
        const response = await fetch(`${env.AI_SERVICE_URL}/api/submissions`);
        
        if (!response.ok) {
          throw new Error(`AI orchestrator error! status: ${response.status}`);
        }
        
        const data = await response.json();
        const userSubmissions = data.submissions.filter((submission: any) => 
          submission.user_id === userId
        );
        
        // Convert AI orchestrator format to user service format
        const submissions: Submission[] = userSubmissions.map((submission: any) => ({
          submission_id: submission.submission_id,
          user_id: submission.user_id,
          page_type: submission.submission_type || 'contact',
          description: submission.text_content || 'No description provided',
          files: submission.file_urls ? submission.file_urls.map((url: string) => ({
            name: url.split('/').pop() || 'Unknown file',
            originalName: url.split('/').pop() || 'Unknown file',
            fileSize: 0,
            url: url
          })) : [],
          voice_recording: submission.voice_file_url ? {
            recordingTime: 0,
            url: submission.voice_file_url
          } : undefined,
          created_at: submission.created_at,
          status: submission.status
        }));
        
        return {
          success: true,
          submissions,
          total: submissions.length
        };
      } catch (error) {
        console.error('Failed to fetch submissions from AI orchestrator:', error);
        return {
          success: false,
          submissions: [],
          total: 0
        };
      }
    }

    try {
      const response = await fetch(`${this.baseUrl}/${userId}/submissions`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get user submissions:', error);
      throw new Error('Failed to load submissions. Please try again.');
    }
  }

  /**
   * Send confirmation message to user
   */
  async sendConfirmation(userId: string, contactType: string): Promise<{
    success: boolean;
    message: string;
    confirmation: any;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/${userId}/send-confirmation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contact_type: contactType }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to send confirmation:', error);
      throw new Error('Failed to send confirmation. Please try again.');
    }
  }

  /**
   * Get session information
   */
  async getSession(sessionId: string): Promise<{
    success: boolean;
    session: any;
    user: UserProfile | null;
  }> {
    try {
      const response = await fetch(`${env.USER_PORTAL_URL}/api/sessions/${sessionId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get session:', error);
      throw new Error('Failed to load session. Please try again.');
    }
  }

  /**
   * Generate a unique session ID for tracking
   */
  generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate a unique submission ID
   */
  generateSubmissionId(): string {
    return `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Store session ID in localStorage
   */
  storeSessionId(sessionId: string): void {
    localStorage.setItem('statex_session_id', sessionId);
  }

  /**
   * Get session ID from localStorage
   */
  getSessionId(): string | null {
    return localStorage.getItem('statex_session_id');
  }

  /**
   * Store user ID in localStorage
   */
  storeUserId(userId: string): void {
    localStorage.setItem('statex_user_id', userId);
  }

  /**
   * Get user ID from localStorage
   */
  getUserId(): string | null {
    return localStorage.getItem('statex_user_id');
  }

  /**
   * Clear user session data
   */
  clearSession(): void {
    localStorage.removeItem('statex_session_id');
    localStorage.removeItem('statex_user_id');
  }
}

export const userService = new UserService();
