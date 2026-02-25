# Brevo Email Setup for Password Reset

## Quick Setup (5 Minutes)

Since you already have Brevo setup, here's how to integrate it with the password reset function:

### Step 1: Get Your Brevo API Key

1. Go to https://app.brevo.com/settings/keys/api
2. Copy your API key (starts with `xkeysib-...`)

### Step 2: Install Brevo SDK

```bash
cd functions
npm install sib-api-v3-sdk
```

### Step 3: Configure Firebase

```bash
# Set your Brevo API key
firebase functions:config:set brevo.key="xkeysib-YOUR-API-KEY-HERE"

# Set your sender email (must be verified in Brevo)
firebase functions:config:set brevo.sender="noreply@yourdomain.com"
```

### Step 4: Deploy the Function

```bash
firebase deploy --only functions:resetUserPassword
```

That's it! The function is already configured to use Brevo.

## Email Template

The password reset email includes:

### Header
- LyFind branding
- Purple background (#2f1632)
- Lock icon 🔐

### Content
- Personalized greeting
- Clear explanation
- Password in highlighted box
- Security warning
- Step-by-step instructions

### Footer
- LyFind copyright
- Contact information
- Automated message notice

## Testing

### Test Email Delivery

1. Login as admin
2. Go to Users Management
3. Click on a test user (email/password user, not Google)
4. Click "Reset Password"
5. Click "Generate & Send"
6. Check the user's email inbox

### Verify in Brevo Dashboard

1. Go to https://app.brevo.com/statistics/email
2. Check "Transactional" tab
3. Verify email was sent
4. Check delivery status

## Brevo Features You Get

### Free Tier (300 emails/day)
- ✅ Transactional emails
- ✅ Email templates
- ✅ Delivery tracking
- ✅ Real-time statistics
- ✅ SMTP & API access

### Email Tracking
- Sent count
- Delivered count
- Opened count
- Clicked count
- Bounced count

### Deliverability
- SPF/DKIM authentication
- Dedicated IP (paid plans)
- Bounce management
- Spam score checking

## Sender Email Setup

### Option 1: Use Your Domain (Recommended)

1. Go to https://app.brevo.com/senders
2. Add your domain
3. Verify DNS records (SPF, DKIM)
4. Use: `noreply@yourdomain.com`

**Benefits:**
- Professional appearance
- Better deliverability
- Brand recognition

### Option 2: Use Brevo Domain

Use the default Brevo sender:
- `noreply@sendinblue.com`
- No verification needed
- Works immediately

## Email Customization

The email template is in `functions/resetUserPassword.js`. You can customize:

### Colors
```javascript
.header { background: #2f1632; } // Your brand color
.password-box { border: 2px solid #ff7400; } // Accent color
```

### Logo
Add your logo:
```html
<div class="header">
  <img src="https://yourdomain.com/logo.png" alt="LyFind" style="max-width: 150px;">
  <h1>🔐 Password Reset</h1>
</div>
```

### Content
Modify the text:
```javascript
<p>Hello <strong>${userName}</strong>,</p>
<p>Your custom message here...</p>
```

### Button
Add a login button:
```html
<a href="https://lyfind.com/login" class="button">
  Login to LyFind
</a>
```

## Monitoring

### View Email Stats

```bash
# Check function logs
firebase functions:log --only resetUserPassword

# View in Brevo dashboard
# https://app.brevo.com/statistics/email
```

### Set Up Alerts

1. Go to Brevo dashboard
2. Navigate to Settings > Alerts
3. Set up alerts for:
   - Delivery failures
   - High bounce rate
   - Spam complaints

## Troubleshooting

### Email Not Sending

**Check API Key:**
```bash
firebase functions:config:get
```

Should show:
```json
{
  "brevo": {
    "key": "xkeysib-...",
    "sender": "noreply@yourdomain.com"
  }
}
```

**Check Function Logs:**
```bash
firebase functions:log --only resetUserPassword
```

Look for errors like:
- `Invalid API key`
- `Sender not verified`
- `Daily limit exceeded`

### Email Goes to Spam

**Solutions:**
1. Verify your domain in Brevo
2. Set up SPF and DKIM records
3. Use a verified sender email
4. Avoid spam trigger words
5. Include unsubscribe link (for marketing emails)

### Daily Limit Exceeded

**Free Tier:** 300 emails/day

**Solutions:**
1. Upgrade to paid plan
2. Implement rate limiting
3. Queue password resets
4. Use multiple email services

## Brevo API Response

### Success Response
```json
{
  "messageId": "<202301011200.12345@smtp-relay.mailin.fr>"
}
```

### Error Response
```json
{
  "code": "invalid_parameter",
  "message": "Invalid sender email"
}
```

## Cost

### Free Tier
- **Emails:** 300/day
- **Cost:** $0
- **Features:** Full API access, tracking, templates

### Lite Plan ($25/month)
- **Emails:** 10,000/month
- **Cost:** $25
- **Features:** Everything + phone support

### Premium Plan ($65/month)
- **Emails:** 20,000/month
- **Cost:** $65
- **Features:** Everything + marketing automation

## Security Best Practices

### 1. Protect API Key
```bash
# Never commit API key to git
# Use Firebase config
firebase functions:config:set brevo.key="..."
```

### 2. Verify Sender
- Always use verified sender email
- Set up SPF/DKIM records
- Monitor bounce rates

### 3. Rate Limiting
```javascript
// Add rate limiting in Cloud Function
const recentResets = await admin.firestore()
  .collection('passwordResets')
  .where('userId', '==', userId)
  .where('timestamp', '>', Date.now() - 3600000) // 1 hour
  .get();

if (recentResets.size >= 3) {
  throw new Error('Too many password reset attempts');
}
```

### 4. Log All Actions
```javascript
await admin.firestore().collection('adminLogs').add({
  action: 'reset_user_password',
  adminUid: context.auth.uid,
  targetId: userId,
  timestamp: admin.firestore.FieldValue.serverTimestamp()
});
```

## Production Checklist

Before going live:

- [ ] Brevo API key configured
- [ ] Sender email verified
- [ ] DNS records set (SPF, DKIM)
- [ ] Email template tested
- [ ] Function deployed
- [ ] Test email sent successfully
- [ ] Email appears in inbox (not spam)
- [ ] Brevo dashboard shows delivery
- [ ] Function logs show no errors
- [ ] Rate limiting implemented
- [ ] Error handling tested
- [ ] Monitoring alerts set up

## Example Configuration

### Complete Setup Commands

```bash
# 1. Install dependencies
cd functions
npm install firebase-functions firebase-admin sib-api-v3-sdk

# 2. Configure Brevo
firebase functions:config:set brevo.key="xkeysib-1234567890abcdef"
firebase functions:config:set brevo.sender="noreply@lyfind.com"

# 3. Deploy function
firebase deploy --only functions:resetUserPassword

# 4. Test
# Go to admin panel and test password reset
```

### Verify Configuration

```bash
# Check config
firebase functions:config:get

# Expected output:
# {
#   "brevo": {
#     "key": "xkeysib-...",
#     "sender": "noreply@lyfind.com"
#   }
# }
```

## Support

### Brevo Support
- **Documentation:** https://developers.brevo.com/
- **Support:** https://help.brevo.com/
- **Status:** https://status.brevo.com/

### Common Issues

**Issue:** "Invalid API key"
**Solution:** Check API key in Brevo dashboard, regenerate if needed

**Issue:** "Sender not verified"
**Solution:** Verify sender email in Brevo settings

**Issue:** "Daily limit exceeded"
**Solution:** Upgrade plan or wait 24 hours

**Issue:** "Email not delivered"
**Solution:** Check Brevo logs, verify recipient email

## Next Steps

1. ✅ Install Brevo SDK: `npm install sib-api-v3-sdk`
2. ✅ Configure API key: `firebase functions:config:set brevo.key="..."`
3. ✅ Set sender email: `firebase functions:config:set brevo.sender="..."`
4. ✅ Deploy function: `firebase deploy --only functions:resetUserPassword`
5. ✅ Test password reset
6. ✅ Monitor Brevo dashboard

---

**Status:** Ready to Deploy  
**Estimated Setup Time:** 5 minutes  
**Email Service:** Brevo (300 emails/day free)
