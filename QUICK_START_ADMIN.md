# Quick Start: Create Your Admin Account

## 🚀 Fastest Way (5 Minutes)

### Method 1: Using the HTML Tool (Easiest!)

1. **Open the HTML tool:**
   ```bash
   # Just open this file in your browser:
   create-admin.html
   ```

2. **Get your Firebase Auth UID:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select `lyfind-72845`
   - Click **Authentication** → **Users**
   - Find your email and copy the **UID**

3. **Generate admin data:**
   - Paste your UID in the HTML form
   - Fill in your details
   - Click "Generate Admin Data"
   - Copy the JSON output

4. **Add to Firestore:**
   - Go to Firebase Console → **Firestore Database**
   - Create collection: `admins`
   - Document ID: Your UID
   - Paste the JSON (add timestamps manually)
   - Save

5. **Login:**
   - Go to: `http://localhost:5173/admin/login`
   - Use your email and password
   - Done! 🎉

---

## 📋 Method 2: Manual Firestore Entry

### Step 1: Get Your UID
- Firebase Console → Authentication → Users → Copy UID

### Step 2: Create Admin Document
- Firestore Database → Create collection `admins`
- Document ID: [Your UID]
- Add these fields:

```
email: "your.email@lsb.edu.ph"
displayName: "Your Name"
role: "super_admin"
adminLevel: "super"
permissions: [array - see below]
createdAt: [timestamp - current time]
lastLogin: [timestamp - current time]
twoFactorEnabled: false
assignedBy: "system"
active: true
```

### Step 3: Add Permissions Array
Add these 31 strings to the `permissions` array:

```
users.view, users.edit, users.delete, users.suspend, users.ban,
items.view, items.edit, items.delete, items.feature,
items.approve, items.reject, items.request_info,
reports.view, reports.handle, reports.delete,
messages.view, messages.delete,
ai.configure, ai.monitor,
analytics.view, analytics.export,
settings.view, settings.edit,
admins.create, admins.edit, admins.delete,
logs.view, logs.export,
system.backup, system.restore, system.shutdown
```

---

## ✅ Verification

After creating your admin account:

1. Go to: `http://localhost:5173/admin/login`
2. Login with your email and password
3. You should see the admin dashboard
4. Try accessing: `/admin/approvals`

If it works, you're all set! 🎉

---

## 🐛 Troubleshooting

**"Access denied" error?**
- Check if your UID matches between Auth and Firestore
- Verify `active: true` in Firestore
- Make sure `role` is set to `super_admin`

**Can't find your UID?**
- Firebase Console → Authentication → Users
- Your UID is in the first column

**Still having issues?**
- Check `CREATE_ADMIN_ACCOUNT.md` for detailed guide
- Check browser console (F12) for errors

---

## 📞 Quick Links

- **Admin Login:** http://localhost:5173/admin/login
- **Firebase Console:** https://console.firebase.google.com/
- **Detailed Guide:** `CREATE_ADMIN_ACCOUNT.md`
- **HTML Tool:** `create-admin.html`

---

**That's it! You're ready to use the admin system! 🚀**

