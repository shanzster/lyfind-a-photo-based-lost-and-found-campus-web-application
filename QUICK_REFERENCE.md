# Password Reset - Quick Reference Card

## 🚀 Deploy (First Time)

```bash
cd functions
npm install sib-api-v3-sdk
firebase functions:config:set brevo.key="YOUR_KEY"
firebase functions:config:set brevo.sender="noreply@yourdomain.com"
firebase deploy --only functions:resetUserPassword
```

## 📧 How It Works

1. Admin clicks "Reset Password" on user
2. System checks: Google user? → Show warning
3. System checks: Email user? → Generate password
4. Cloud Function updates Firebase Auth
5. Brevo sends email to user
6. User receives password and logs in

## 🔐 Password Format

- **Length:** 12 characters
- **Contains:** A-Z, a-z, 0-9, !@#$%^&*
- **Example:** `K7m!pR2@xL9q`

## ✅ User Types

| Sign-In Method | Can Reset? | Action |
|----------------|------------|--------|
| Email/Password | ✅ Yes | Generate & send password |
| Google | ❌ No | Show warning message |
| Facebook | ❌ No | Show warning message |

## 📊 Brevo Limits

| Plan | Emails/Day | Cost |
|------|------------|------|
| Free | 300 | $0 |
| Lite | 10,000/month | $25 |
| Premium | 20,000/month | $65 |

## 🛠️ Commands

### Deploy Function
```bash
firebase deploy --only functions:resetUserPassword
```

### View Logs
```bash
firebase functions:log --only resetUserPassword
```

### Check Config
```bash
firebase functions:config:get
```

### Update Config
```bash
firebase functions:config:set brevo.key="NEW_KEY"
```

## 🔍 Testing

1. Login as admin: `admin@gmail.com` / `123456`
2. Go to: Users Management
3. Click any email/password user
4. Click: "Reset Password"
5. Click: "Generate & Send"
6. Check user's email inbox

## 📧 Email Template

**Subject:** Your LyFind Password Has Been Reset

**Content:**
- Greeting with user name
- Password in highlighted box
- Security warning
- Step-by-step instructions
- Support contact

## 🚨 Error Messages

| Error | Meaning | Solution |
|-------|---------|----------|
| Function not found | Not deployed | Deploy function |
| Invalid API key | Wrong Brevo key | Check API key |
| Permission denied | Not admin | Login as admin |
| Google user | Can't reset | Expected behavior |

## 📁 Files

| File | Purpose |
|------|---------|
| `functions/resetUserPassword.js` | Cloud Function code |
| `src/pages/admin/UserDetails.tsx` | Admin UI |
| `BREVO_DEPLOYMENT_STEPS.md` | Quick deploy guide |
| `BREVO_SETUP_GUIDE.md` | Detailed Brevo setup |
| `PASSWORD_RESET_FEATURE.md` | Complete documentation |

## 🔗 Links

- **Brevo Dashboard:** https://app.brevo.com/
- **API Keys:** https://app.brevo.com/settings/keys/api
- **Email Stats:** https://app.brevo.com/statistics/email
- **Firebase Console:** https://console.firebase.google.com/

## 💡 Tips

- Test with a real email address first
- Check Brevo dashboard for delivery status
- Monitor Firebase function logs
- Keep API key secure (never commit to git)
- Verify sender email in Brevo

## 🎯 Success Checklist

- [ ] Brevo SDK installed
- [ ] API key configured
- [ ] Sender email set
- [ ] Function deployed
- [ ] Test email sent
- [ ] Email received
- [ ] Password works
- [ ] Logs show success

---

**Need Help?** See `BREVO_DEPLOYMENT_STEPS.md` for step-by-step guide.
