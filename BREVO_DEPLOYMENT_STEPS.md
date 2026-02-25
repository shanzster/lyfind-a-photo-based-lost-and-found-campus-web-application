# 🚀 Deploy Password Reset with Brevo - Quick Guide

## You're Almost Done! Just 3 Steps:

### Step 1: Install Brevo SDK (1 minute)

```bash
cd functions
npm install sib-api-v3-sdk
```

### Step 2: Configure Your Brevo API Key (2 minutes)

1. Get your API key from: https://app.brevo.com/settings/keys/api
2. Run these commands:

```bash
firebase functions:config:set brevo.key="xkeysib-YOUR-API-KEY-HERE"
firebase functions:config:set brevo.sender="noreply@yourdomain.com"
```

Replace:
- `xkeysib-YOUR-API-KEY-HERE` with your actual Brevo API key
- `noreply@yourdomain.com` with your verified sender email

### Step 3: Deploy the Function (2 minutes)

```bash
firebase deploy --only functions:resetUserPassword
```

## That's It! 🎉

Now test it:
1. Login as admin
2. Go to Users Management
3. Click on a user (email/password user, not Google)
4. Click "Reset Password"
5. Click "Generate & Send"
6. Check the user's email!

## What You Get

✅ **Automatic password generation** - Secure 12-character passwords  
✅ **Professional email template** - Branded with LyFind colors  
✅ **Brevo integration** - 300 free emails/day  
✅ **Google account protection** - Can't reset Google users  
✅ **Action logging** - All resets logged in admin logs  
✅ **Error handling** - Clear feedback for all scenarios  

## Email Preview

Your users will receive:

```
Subject: Your LyFind Password Has Been Reset

🔐 Password Reset

Hello [User Name],

Your password has been reset by an administrator. 
You can now log in to your LyFind account using the 
temporary password below.

┌─────────────────────┐
│   K7m!pR2@xL9q     │  ← Auto-generated secure password
└─────────────────────┘

⚠️ Important Security Notice:
This is a temporary password. Please change it 
immediately after logging in.

Next Steps:
• Copy the password above
• Go to LyFind login page
• Enter your email and the new password
• Navigate to your profile settings
• Change your password to something memorable
```

## Verify It's Working

### Check Firebase Console
```bash
firebase functions:log --only resetUserPassword
```

### Check Brevo Dashboard
Go to: https://app.brevo.com/statistics/email

You should see:
- Email sent ✅
- Email delivered ✅
- No errors ✅

## Troubleshooting

### "Function not found"
```bash
# Redeploy
firebase deploy --only functions:resetUserPassword
```

### "Invalid API key"
```bash
# Check your config
firebase functions:config:get

# Should show your Brevo key
# If not, set it again
firebase functions:config:set brevo.key="xkeysib-..."
```

### "Email not sending"
1. Verify sender email in Brevo dashboard
2. Check API key is correct
3. View Brevo logs for errors

## Cost

**Free Tier:** 300 emails/day  
**Your Usage:** ~10-50 password resets/day  
**Cost:** $0/month 🎉

## Support

Need help?
- **Brevo Docs:** https://developers.brevo.com/
- **Setup Guide:** See `BREVO_SETUP_GUIDE.md`
- **Full Docs:** See `PASSWORD_RESET_FEATURE.md`

---

**Ready to deploy?** Just run the 3 commands above! 🚀
