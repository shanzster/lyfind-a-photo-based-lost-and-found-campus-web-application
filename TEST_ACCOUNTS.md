# Test User Accounts

These are seeded test accounts for LyFind development and testing.

## Test Accounts

### Account 1: Maria Santos
- **Email**: `maria.santos@lsb.edu.ph`
- **Password**: `LyFind2024!`
- **Name**: Maria Santos
- **Department**: Computer Science
- **Year Level**: 3rd Year
- **Student ID**: LSB-2021-0001

### Account 2: Juan Dela Cruz
- **Email**: `juan.dela.cruz@lsb.edu.ph`
- **Password**: `LyFind2024!`
- **Name**: Juan Dela Cruz
- **Department**: Business Administration
- **Year Level**: 2nd Year
- **Student ID**: LSB-2022-0002

### Account 3: Ana Reyes
- **Email**: `ana.reyes@lsb.edu.ph`
- **Password**: `LyFind2024!`
- **Name**: Ana Reyes
- **Department**: Engineering
- **Year Level**: 4th Year
- **Student ID**: LSB-2020-0003

### Account 4: Carlos Garcia
- **Email**: `carlos.garcia@lsb.edu.ph`
- **Password**: `LyFind2024!`
- **Name**: Carlos Garcia
- **Department**: Hospitality Management
- **Year Level**: 1st Year
- **Student ID**: LSB-2023-0004

### Account 5: Sofia Martinez
- **Email**: `sofia.martinez@lsb.edu.ph`
- **Password**: `LyFind2024!`
- **Name**: Sofia Martinez
- **Department**: Marine Transportation
- **Year Level**: 3rd Year
- **Student ID**: LSB-2021-0005

## How to Use

1. Run the seed script:
   ```bash
   node seed-users.js
   ```

2. Login with any of the accounts above using the email and password

3. All accounts use the same password for easy testing: `LyFind2024!`

## Notes

- All accounts are LSB domain emails (@lsb.edu.ph)
- All accounts have student role by default
- Accounts have different departments and year levels for variety
- If accounts already exist, the script will skip them

## Security Warning

⚠️ **DO NOT use these credentials in production!** These are test accounts only.
