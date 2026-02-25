import SibApiV3Sdk from 'sib-api-v3-sdk';

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = import.meta.env.VITE_BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// Store OTPs temporarily (in production, use Redis or database)
const otpStore = new Map<string, { otp: string; expiresAt: number }>();

export const emailService = {
  // Generate 6-digit OTP
  generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  },

  // Send OTP email
  async sendOTP(email: string): Promise<{ success: boolean; message: string }> {
    try {
      // Normalize email to lowercase
      const normalizedEmail = email.toLowerCase().trim();
      
      // Validate LSB email
      if (!normalizedEmail.endsWith('@lsb.edu.ph')) {
        return {
          success: false,
          message: 'Only @lsb.edu.ph email addresses are allowed'
        };
      }

      // Generate OTP
      const otp = this.generateOTP();
      
      console.log('[EmailService] Generated OTP:', otp, 'for email:', normalizedEmail);
      
      // Store OTP with 10 minute expiration
      otpStore.set(normalizedEmail, {
        otp,
        expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
      });
      
      console.log('[EmailService] Stored OTP in otpStore. Current store size:', otpStore.size);

      // Send email
      const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
      sendSmtpEmail.subject = 'LyFind - Email Verification Code';
      sendSmtpEmail.htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Email - LyFind</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              background: #f5f5f5;
              padding: 40px 20px;
              min-height: 100vh;
            }
            .email-container {
              max-width: 600px;
              margin: 0 auto;
            }
            .glass-card {
              background: #ffffff;
              border: 1px solid #e0e0e0;
              border-radius: 24px;
              padding: 40px;
              box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            }
            .logo-container {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo-glow {
              display: inline-block;
              position: relative;
              padding: 20px;
            }
            .logo-glow::before {
              content: '';
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: 140px;
              height: 140px;
              background: radial-gradient(circle, rgba(255, 116, 0, 0.15) 0%, transparent 70%);
              border-radius: 50%;
              filter: blur(30px);
              z-index: 0;
            }
            .logo-circle {
              position: relative;
              z-index: 1;
              width: 100px;
              height: 100px;
              display: flex;
              align-items: center;
              justify-content: center;
              animation: float 3s ease-in-out infinite;
            }
            .logo-circle img {
              width: 100%;
              height: 100%;
              object-fit: contain;
              filter: drop-shadow(0 4px 12px rgba(255, 116, 0, 0.3));
            }
            @keyframes float {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-10px); }
            }
            .brand-name {
              font-size: 36px;
              font-weight: 600;
              color: #1a1a1a;
              margin: 15px 0 5px 0;
              text-shadow: 0 2px 8px rgba(255, 116, 0, 0.2);
            }
            .brand-tagline {
              font-size: 14px;
              color: #666666;
              text-transform: uppercase;
              letter-spacing: 2px;
            }
            .divider {
              height: 1px;
              background: linear-gradient(90deg, transparent, #e0e0e0, transparent);
              margin: 30px 0;
            }
            .content-section {
              text-align: center;
            }
            .greeting {
              font-size: 24px;
              color: #1a1a1a;
              font-weight: 600;
              margin-bottom: 15px;
            }
            .message {
              font-size: 16px;
              color: #4a4a4a;
              line-height: 1.8;
              margin-bottom: 30px;
            }
            .otp-container {
              background: #f9f9f9;
              border: 2px dashed rgba(255, 116, 0, 0.4);
              border-radius: 16px;
              padding: 30px;
              margin: 30px 0;
              position: relative;
              overflow: hidden;
            }
            .otp-container::before {
              content: '';
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: 200px;
              height: 200px;
              background: radial-gradient(circle, rgba(255, 116, 0, 0.05) 0%, transparent 70%);
              border-radius: 50%;
              filter: blur(40px);
            }
            .otp-label {
              font-size: 12px;
              color: #666666;
              text-transform: uppercase;
              letter-spacing: 3px;
              margin-bottom: 15px;
              position: relative;
              z-index: 1;
            }
            .otp-code {
              font-size: 56px;
              font-weight: 700;
              color: #ff7400;
              letter-spacing: 12px;
              font-family: 'Courier New', monospace;
              text-shadow: 0 0 20px rgba(255, 116, 0, 0.5);
              margin: 15px 0;
              position: relative;
              z-index: 1;
            }
            .otp-expiry {
              font-size: 14px;
              color: #666666;
              margin-top: 15px;
              position: relative;
              z-index: 1;
            }
            .warning-box {
              background: rgba(255, 116, 0, 0.05);
              border-left: 4px solid #ff7400;
              border-radius: 8px;
              padding: 20px;
              margin: 25px 0;
              text-align: left;
            }
            .warning-title {
              font-size: 14px;
              color: #ff7400;
              font-weight: 600;
              margin-bottom: 8px;
              display: flex;
              align-items: center;
              gap: 8px;
            }
            .warning-text {
              font-size: 13px;
              color: #4a4a4a;
              line-height: 1.6;
            }
            .footer {
              margin-top: 40px;
              padding-top: 30px;
              border-top: 1px solid #e0e0e0;
              text-align: center;
            }
            .footer-text {
              font-size: 12px;
              color: #999999;
              line-height: 1.8;
            }
            .footer-link {
              color: #ff7400;
              text-decoration: none;
            }
            .footer-link:hover {
              color: #ff8500;
            }
            .badge {
              display: inline-block;
              background: rgba(255, 116, 0, 0.08);
              border: 1px solid rgba(255, 116, 0, 0.3);
              border-radius: 20px;
              padding: 6px 16px;
              font-size: 11px;
              color: #ff7400;
              text-transform: uppercase;
              letter-spacing: 1px;
              margin-top: 15px;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="glass-card">
              <!-- Logo Section -->
              <div class="logo-container">
                <div class="logo-glow">
                  <div class="logo-circle">
                    <img 
                      src="https://res.cloudinary.com/do8pgc1ja/image/upload/v1771776821/lyfind/assets/hfghwr2x4uwtjcdpksss.png" 
                      alt="LyFind Logo"
                    />
                  </div>
                </div>
                <h1 class="brand-name">LyFind</h1>
                <p class="brand-tagline">Lyceum of Subic Bay • Lost & Found</p>
              </div>

              <div class="divider"></div>

              <!-- Content Section -->
              <div class="content-section">
                <h2 class="greeting">🔐 Verify Your Email</h2>
                <p class="message">
                  Welcome to LyFind! To complete your registration and start using our AI-powered lost and found platform, please verify your email address with the code below.
                </p>

                <!-- OTP Box -->
                <div class="otp-container">
                  <div class="otp-label">Your Verification Code</div>
                  <div class="otp-code">${otp}</div>
                  <div class="otp-expiry">⏱️ Expires in 10 minutes</div>
                </div>

                <p class="message">
                  Enter this code in the verification window to activate your account and join the LyFind community.
                </p>

                <!-- Warning Box -->
                <div class="warning-box">
                  <div class="warning-title">
                    <span>⚠️</span>
                    <span>Security Notice</span>
                  </div>
                  <div class="warning-text">
                    Never share this verification code with anyone. LyFind staff will never ask for your code. If you didn't request this verification, please ignore this email or contact support if you have concerns.
                  </div>
                </div>

                <div class="badge">✨ Powered by AI Photo Matching</div>
              </div>

              <!-- Footer -->
              <div class="footer">
                <p class="footer-text">
                  This email was sent to <strong style="color: #1a1a1a;">${email}</strong>
                  <br />
                  LyFind - Campus Lost & Found Platform
                  <br />
                  Lyceum of Subic Bay
                  <br />
                  <br />
                  <a href="http://localhost:3000" class="footer-link">Visit LyFind</a>
                  <br />
                  <br />
                  <span style="font-size: 11px; color: #cccccc;">
                    © 2026 LyFind. All rights reserved.
                  </span>
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `;
      sendSmtpEmail.sender = {
        name: 'LyFind',
        email: import.meta.env.VITE_BREVO_SENDER_EMAIL
      };
      sendSmtpEmail.to = [{ email: normalizedEmail, name: normalizedEmail.split('@')[0] }];

      await apiInstance.sendTransacEmail(sendSmtpEmail);

      return {
        success: true,
        message: 'OTP sent successfully to your email'
      };
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      return {
        success: false,
        message: 'Failed to send OTP. Please try again.'
      };
    }
  },

  // Verify OTP
  verifyOTP(email: string, otp: string): { success: boolean; message: string } {
    // Normalize email to lowercase and trim OTP
    const normalizedEmail = email.toLowerCase().trim();
    const normalizedOTP = otp.trim();
    
    console.log('[EmailService] Verifying OTP:', normalizedOTP, 'for email:', normalizedEmail);
    console.log('[EmailService] Current otpStore size:', otpStore.size);
    
    const stored = otpStore.get(normalizedEmail);
    
    console.log('[EmailService] Stored OTP data:', stored);

    if (!stored) {
      console.log('[EmailService] No OTP found for email');
      return {
        success: false,
        message: 'No OTP found. Please request a new one.'
      };
    }

    if (Date.now() > stored.expiresAt) {
      console.log('[EmailService] OTP expired');
      otpStore.delete(normalizedEmail);
      return {
        success: false,
        message: 'OTP has expired. Please request a new one.'
      };
    }

    if (stored.otp !== normalizedOTP) {
      console.log('[EmailService] OTP mismatch. Expected:', stored.otp, 'Got:', normalizedOTP);
      return {
        success: false,
        message: 'Invalid OTP. Please check and try again.'
      };
    }

    console.log('[EmailService] OTP verified successfully');
    // OTP is valid, remove it
    otpStore.delete(normalizedEmail);
    return {
      success: true,
      message: 'Email verified successfully!'
    };
  },

  // Resend OTP
  async resendOTP(email: string): Promise<{ success: boolean; message: string }> {
    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();
    
    // Delete old OTP if exists
    otpStore.delete(normalizedEmail);
    
    // Send new OTP
    return this.sendOTP(normalizedEmail);
  }
};
