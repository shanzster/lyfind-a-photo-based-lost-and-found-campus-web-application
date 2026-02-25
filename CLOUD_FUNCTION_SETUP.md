# Cloud Function Setup for Password Reset

## Overview

The password reset feature requires a Firebase Cloud Function to securely update user passwords in Firebase Authentication. This guide will help you set up and deploy the function.

## Prerequisites

- Firebase CLI installed (`npm install -g firebase-tools`)
- Firebase project initialized
- Node.js installed
- Admin privileges in Firebase Console

## Step 1: Initialize Firebase Functions

If you haven't already initialized Firebase Functions:

```bash
firebase init functions
```

Select:
- JavaScript or TypeScript (we'll use JavaScript)
- Install dependencies with npm

## Step 2: Install Dependencies

Navigate to the functions directory and install required packages:

```bash
cd functions
npm install firebase-functions firebase-admin
```

### Optional: Install Email Service

**Using Brevo (Recommended - You already have this setup!)**
```bash
npm install sib-api-v3-sdk
```

Other options if needed:
- SendGrid: `npm install @sendgrid/mail`
- Resend: `npm install resend`
- Nodemailer: `npm install nodemailer`

## Step 3: Copy the Cloud Function

The function is already created at `functions/resetUserPassword.js`. 

If you need to create it manually, copy the code from that file to `functions/index.js`:

```javascript
const resetUserPassword = require('./resetUserPassword');
exports.resetUserPassword = resetUserPassword.resetUserPassword;
```

Or add it directly to `functions/index.js`.

## Step 4: Configure Brevo Email Service

### Using Brevo (Already Setup!)

1. Get your Brevo API key from: https://app.brevo.com/settings/keys/api
2. Set Firebase config:

```bash
firebase functions:config:set brevo.key="YOUR_BREVO_API_KEY"
firebase functions:config:set brevo.sender="noreply@yourdomain.com"
```

3. The code is already configured in `resetUserPassword.js` to use Brevo!

**Brevo Features:**
- ✅ 300 emails/day free tier
- ✅ Professional email templates
- ✅ Delivery tracking
- ✅ Easy setup
- ✅ Reliable delivery

### Alternative Email Services (If Needed)

<details>
<summary>Option A: Using SendGrid</summary>

1. Sign up at https://sendgrid.com
2. Get your API key
3. Set Firebase config:

```bash
firebase functions:config:set sendgrid.key="YOUR_SENDGRID_API_KEY"
```

4. Uncomment SendGrid code in `resetUserPassword.js`:

```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(functions.config().sendgrid.key);

const msg = {
  to: userEmail,
  from: 'noreply@lyfind.com', // Change to your verified sender
  subject: 'Your Password Has Been Reset',
  html: `
    <h2>Password Reset</h2>
    <p>Hello ${userName},</p>
    <p>Your password has been reset by an administrator.</p>
    <p><strong>Your new password is:</strong> <code>${newPassword}</code></p>
    <p>Please log in and change your password immediately.</p>
    <p>If you did not request this change, please contact support.</p>
  `
};

await sgMail.send(msg);
```
</details>

<details>
<summary>Option B: Using Resend</summary>

1. Sign up at https://resend.com
2. Get your API key
3. Set Firebase config:

```bash
firebase functions:config:set resend.key="YOUR_RESEND_API_KEY"
```

4. Uncomment Resend code in `resetUserPassword.js`:

```javascript
const { Resend } = require('resend');
const resend = new Resend(functions.config().resend.key);

await resend.emails.send({
  from: 'LyFind <noreply@lyfind.com>', // Change to your domain
  to: userEmail,
  subject: 'Your Password Has Been Reset',
  html: `
    <h2>Password Reset</h2>
    <p>Hello ${userName},</p>
    <p>Your password has been reset by an administrator.</p>
    <p><strong>Your new password is:</strong> <code>${newPassword}</code></p>
    <p>Please log in and change your password immediately.</p>
    <p>If you did not request this change, please contact support.</p>
  `
});
```
</details>

<details>
<summary>Option C: Using Nodemailer (Gmail)</summary>

```javascript
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: functions.config().gmail.email,
    pass: functions.config().gmail.password
  }
});

const mailOptions = {
  from: 'noreply@lyfind.com',
  to: userEmail,
  subject: 'Your Password Has Been Reset',
  html: `
    <h2>Password Reset</h2>
    <p>Hello ${userName},</p>
    <p>Your password has been reset by an administrator.</p>
    <p><strong>Your new password is:</strong> <code>${newPassword}</code></p>
    <p>Please log in and change your password immediately.</p>
    <p>If you did not request this change, please contact support.</p>
  `
};

await transporter.sendMail(mailOptions);
```

Set config:
```bash
firebase functions:config:set gmail.email="your-email@gmail.com"
firebase functions:config:set gmail.password="your-app-password"
```
</details>

## Step 5: Deploy the Function

Deploy the Cloud Function to Firebase:

```bash
firebase deploy --only functions:resetUserPassword
```

Or deploy all functions:

```bash
firebase deploy --only functions
```

## Step 6: Verify Deployment

1. Go to Firebase Console
2. Navigate to Functions section
3. Verify `resetUserPassword` is listed and active
4. Check the logs for any errors

## Step 7: Test the Function

### From Admin Panel:
1. Login as admin
2. Go to Users Management
3. Click on a user (who signed up with email/password, not Google)
4. Click "Reset Password"
5. Click "Generate & Send"
6. Check if email is sent

### From Firebase Console:
You can also test directly from the Functions section using the "Test" button.

## Email Template Customization

Edit the email HTML in `resetUserPassword.js` to match your branding:

```javascript
html: `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body { font-family: Arial, sans-serif; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { background: #2f1632; color: white; padding: 20px; text-align: center; }
      .content { padding: 20px; background: #f5f5f5; }
      .password { 
        background: white; 
        padding: 15px; 
        font-size: 18px; 
        font-family: monospace;
        border: 2px solid #ff7400;
        border-radius: 8px;
        text-align: center;
        margin: 20px 0;
      }
      .footer { text-align: center; padding: 20px; color: #666; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>LyFind - Password Reset</h1>
      </div>
      <div class="content">
        <p>Hello ${userName},</p>
        <p>Your password has been reset by an administrator.</p>
        <p><strong>Your new temporary password is:</strong></p>
        <div class="password">${newPassword}</div>
        <p><strong>Important:</strong></p>
        <ul>
          <li>Please log in immediately</li>
          <li>Change your password after logging in</li>
          <li>Do not share this password with anyone</li>
        </ul>
        <p>If you did not request this change, please contact support immediately.</p>
      </div>
      <div class="footer">
        <p>© 2026 LyFind - Lost and Found Platform</p>
        <p>This is an automated message, please do not reply.</p>
      </div>
    </div>
  </body>
  </html>
`
```

## Security Considerations

### 1. Admin Verification
The function checks if the caller is an admin before allowing password reset:

```javascript
const callerIsAdmin = await isAdmin(context.auth.uid);
if (!callerIsAdmin) {
  throw new functions.https.HttpsError('permission-denied', 'Only admins can reset passwords');
}
```

### 2. Google Account Protection
The function prevents password reset for Google sign-in users:

```javascript
const isGoogleUser = userRecord.providerData.some(
  provider => provider.providerId === 'google.com'
);

if (isGoogleUser) {
  throw new functions.https.HttpsError('failed-precondition', 'Cannot reset password for Google sign-in users');
}
```

### 3. Secure Password Generation
Passwords are generated with:
- 12 characters minimum
- Uppercase letters
- Lowercase letters
- Numbers
- Special characters
- Random shuffling

### 4. Action Logging
All password resets are logged in `adminLogs` collection:

```javascript
await admin.firestore().collection('adminLogs').add({
  adminUid: context.auth.uid,
  action: 'reset_user_password',
  targetId: userId,
  metadata: {
    userEmail: userRecord.email,
    passwordGenerated: true,
    timestamp: admin.firestore.FieldValue.serverTimestamp()
  },
  timestamp: admin.firestore.FieldValue.serverTimestamp()
});
```

## Troubleshooting

### Function Not Found Error
If you get "functions/not-found" error:
1. Verify function is deployed: `firebase functions:list`
2. Check function name matches: `resetUserPassword`
3. Redeploy: `firebase deploy --only functions:resetUserPassword`

### Permission Denied Error
1. Verify admin account exists in `admins` collection
2. Check `active: true` in admin document
3. Verify admin is logged in

### Email Not Sending
1. Check email service API key is set correctly
2. Verify sender email is verified (SendGrid/Resend)
3. Check function logs: `firebase functions:log`
4. Test email service separately

### Password Not Updating
1. Check Firebase Auth rules
2. Verify user exists in Firebase Auth
3. Check function logs for errors
4. Ensure user is not a Google sign-in user

## Cost Considerations

### Firebase Functions Pricing
- **Free Tier:** 2M invocations/month, 400K GB-seconds, 200K CPU-seconds
- **Paid Tier:** $0.40 per million invocations

### Email Service Pricing
- **SendGrid:** 100 emails/day free, then $19.95/month for 50K emails
- **Resend:** 100 emails/day free, then $20/month for 50K emails
- **Gmail:** Free but limited (500 emails/day)

## Production Checklist

Before going to production:

- [ ] Cloud Function deployed successfully
- [ ] Email service configured and tested
- [ ] Email template customized with branding
- [ ] Sender email verified
- [ ] Admin permissions working
- [ ] Google account protection working
- [ ] Password generation tested
- [ ] Email delivery tested
- [ ] Action logging verified
- [ ] Error handling tested
- [ ] Function logs monitored
- [ ] Backup email service configured (optional)

## Monitoring

### View Function Logs
```bash
firebase functions:log --only resetUserPassword
```

### Monitor in Firebase Console
1. Go to Firebase Console
2. Navigate to Functions
3. Click on `resetUserPassword`
4. View logs, metrics, and errors

### Set Up Alerts
1. Go to Firebase Console > Functions
2. Click on function name
3. Set up alerts for errors or high usage

## Alternative: Password Reset Link

If you prefer to send a password reset link instead of a new password:

```javascript
// Generate password reset link
const resetLink = await admin.auth().generatePasswordResetLink(userRecord.email);

// Send email with link
await sendPasswordEmail(userEmail, userName, resetLink);
```

This is more secure as the user sets their own password, but requires them to check email and click the link.

## Support

If you encounter issues:
1. Check Firebase Console logs
2. Review function code for errors
3. Test email service separately
4. Verify admin permissions
5. Check Firebase Auth settings

---

**Last Updated:** February 26, 2026  
**Version:** 1.0
