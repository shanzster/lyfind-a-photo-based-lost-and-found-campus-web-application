# Fix Render Deployment - Private Key Issue

## The Problem
The `FIREBASE_PRIVATE_KEY` has newline characters (`\n`) that Render can't parse correctly.

## Solution: Use JSON String Instead

I've updated the server to accept the entire service account JSON as a single environment variable.

## Steps to Fix (2 minutes):

### 1. Go to Render Dashboard
https://dashboard.render.com → lyfind-notifications → Environment

### 2. Remove Old Variables (Optional)
You can remove these (or keep them as backup):
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`

### 3. Add New Variable

Click **Add Environment Variable**

**Key:**
```
FIREBASE_SERVICE_ACCOUNT_JSON
```

**Value:** (Copy this ENTIRE JSON, including the curly braces)
```json
{"type":"service_account","project_id":"lyfind-72845","private_key_id":"5da2bb902c2c751e7cf364e9fe4a431599d11d90","private_key":"-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC8RlcH1sa4rv8L\n6qVw7b5ymCnmV69LVYrXk1XYcochHQLMGmv+2ag6U20dxWmtxVVk/bPx+n9f4i7d\nQlC+iqgoO7u9IdRtL/7wS8MVEzawwk+O5e6E3V+Z7uuuMmQpCw3g//HYG2jZg+PG\nWM4zrPW4s5RIlHPsBBzp1kWwdiKnfMZWrqndaKxsFVVkAvrPbUw1gYhHS+EKW1vj\nr2lPPt2U1g/YQaPWXy7ysV9chYCdgLWRu0nRnS+QZ239SwckTsLvkW+CTXV+C9gy\nPmt/mA7Z7qGKg18kZS+y5U3PmGhsWB2dkI3/AhYtIkgVAzVK3zHkSCfKui+eXWm+\njQXhS9/PAgMBAAECggEAAuxhel2ukdXykw/+dNWimP6D2zyOHD1Xyo3r51B5iKoX\ndDpBmW0HwuAVi0DL3OB57JEdgJEpj40tIE8tsce1YYQlhh159VGpdutP1b2J1XTI\nh3XkHjjRvMu/UEhRn2sfuNhAiRQXExZZLKgN8f93HhPe8yf0izwFHU+Wa9PQKSMs\nxUDfooh3Y/0uofJP+dY3qB5+E9QNii6lcwD1tjcb6YhLrhQQVO53eIQ3ik7GVogC\ncDKM40TITn8DHvKHQZYBXsAX4gEamGCpDHR7oKhAUgJNTSF/LC/R6gTyeaFmqFYq\nH5XHOHc7pvrlBCHVqd7+kJjz3JNPdcKEwA0EnmABAQKBgQD49M1z/ujM3+qlEPxQ\nIuVJIutXZsTGV6AvZqQRUdKdHe9oaqO94e3CWYZUGFP4CdFr69fDozBXSS4eFYPx\ng6atTK4Dp136hP9y0pkuW3/US4qogRf2v0rck83KpRWy+pC5quIjZzXxSOu70lLN\njtM4gDGDRcddRPtO4afwrrK0WwKBgQDBmgUDGaTSwPQXlmkzsWnZoSPtecC47ack\nBeW60FX7EgS9K6stwTksDJFEy3XMeYjOBgrmIFHIKGbKyJIAd3vegLV50W3rtQJg\nds6tW3iWKegr5X7afLPCJ9TFiVWN9pp+rXkuqEl/gShCcUR7VKLO07TqxsRSe4B3\nmaHlP+0MnQKBgQDBQXeDheu9rkx92pOiuZP3lC3QaSxzM25bnXfbIgM2iBhim/WD\n3zAr4EcQXNpB/40cE7YoXjOWbm5oWBdWkfX/LTkgCPpBEKEjxyu1+r1eVU3LxHqP\nxqscU3g6yK/xgeR63JYzGVmcdhjYckpo22hHweutlatPUc8ryqwNf++lZQKBgHEn\n9Z//QBASyVh0CF83ZffWsGofzJ4KAbQTYlfTZz3NJUnwGSgwFJuDaPD9vodZzbUl\nYP9qioJj4tjJbFSrgZHmRqvB1e57qLz7FAfNO+kA63uksoU/d82WfE1M3N2R8nDy\nMa8sm3DT69UR4QX4zQP4R3kl3h+bodXFzRNyTrodAoGARweWiiDTP3SCDFe+2MT1\nw3vtB81qHarkcJZVXcAgC/8qvL0eAEw1VuTgLkbYCEYFmKgF1ZxooytnhtAaLHc4\nJrgE/XrQ1DzSLha0L8HYuEaUZt8eTIS7+c2T1e9f+0v4E2Oww7y3yDYIS4YxKhrr\ni8cM7Hl19jrqJZ48PSH7PLw=\n-----END PRIVATE KEY-----\n","client_email":"firebase-adminsdk-fbsvc@lyfind-72845.iam.gserviceaccount.com","client_id":"113806786627438550456","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40lyfind-72845.iam.gserviceaccount.com","universe_domain":"googleapis.com"}
```

**Important:** Paste it as ONE LINE, no line breaks!

### 4. Keep These Variables

Make sure you still have:
- `NODE_ENV` = `production`
- `API_SECRET` = `lyfind-secret-key-change-this-in-production`

### 5. Save and Redeploy

Click **Save Changes** → Render will automatically redeploy

### 6. Wait 2-3 Minutes

Watch the logs for:
```
🔥 Firebase Admin initialized
🚀 Notification server running on port 3001
```

### 7. Test

Open: https://lyfind-notifications.onrender.com/health

Should show:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## Alternative: Manual Redeploy

If it doesn't auto-redeploy:

1. Go to **Manual Deploy** tab
2. Click **Deploy latest commit**
3. Wait for build to complete

---

## If Still Not Working

Check the logs for errors:
1. Render Dashboard → lyfind-notifications
2. Click **Logs** tab
3. Look for the error message

Common issues:
- JSON not pasted correctly (must be one line)
- Missing quotes around the JSON
- Extra spaces or line breaks

---

## Test Locally First (Optional)

Update your local `.env`:

```env
FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"lyfind-72845",...}
```

Then test:
```bash
cd notification-server
npm start
```

Visit: http://localhost:3001/health

---

Once you see "healthy" status, you're done! 🎉
