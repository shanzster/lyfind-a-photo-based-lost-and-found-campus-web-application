#!/bin/bash
# Comprehensive TypeScript error fix script

echo "Fixing TypeScript errors..."

# Fix unused imports in lycean pages
echo "Fixing lycean pages..."

# Item.tsx
sed -i 's/import { ArrowLeft, MapPin, Clock, Eye, Share2, Flag, Calendar, MessageCircle, X, CheckCircle, Loader2, Image as ImageIcon } from '\''lucide-react'\''/import { ArrowLeft, MapPin, Clock, Share2, MessageCircle, CheckCircle, Loader2, Image as ImageIcon } from '\''lucide-react'\''/' src/pages/lycean/Item.tsx

# Messages.tsx
sed -i 's/import { Link, useLocation, useNavigate } from '\''react-router-dom'\'';/import { Link, useLocation } from '\''react-router-dom'\'';/' src/pages/lycean/Messages.tsx
sed -i 's/import { Send, ArrowLeft, Loader2, MessageCircle, Package, Flag, X, AlertTriangle, Image as ImageIcon, Paperclip, MapPin, CheckCircle } from '\''lucide-react'\'';/import { Send, ArrowLeft, Loader2, MessageCircle, Package, Flag, X, AlertTriangle, Paperclip, MapPin, CheckCircle } from '\''lucide-react'\'';/' src/pages/lycean/Messages.tsx

# MyItems.tsx
sed -i 's/import { ArrowLeft, Search, Filter, SortAsc, Eye, Archive, Loader2, Image as ImageIcon } from '\''lucide-react'\''/import { ArrowLeft, Search, Eye, Archive, Loader2, Image as ImageIcon } from '\''lucide-react'\''/' src/pages/lycean/MyItems.tsx

# Notifications.tsx
sed -i 's/import { Bell, MessageCircle, Sparkles, CheckCircle, Flag, Package, Trash2, CheckCheck, Filter } from '\''lucide-react'\'';/import { Bell, MessageCircle, Sparkles, CheckCircle, Flag, Package, Trash2, CheckCheck } from '\''lucide-react'\'';/' src/pages/lycean/Notifications.tsx
sed -i 's/import { Notification, NotificationType } from/import { NotificationType } from/' src/pages/lycean/Notifications.tsx

# PhotoMatch.tsx - remove unused imports
sed -i 's/import { aiMatchingService, AIMatchResult } from/import { AIMatchResult } from/' src/pages/lycean/PhotoMatch.tsx

# Profile.tsx
sed -i 's/import { ArrowLeft, LogOut, Sparkles, Package, MessageSquare, User, Loader2, Edit, Camera, Upload } from '\''lucide-react'\'';/import { ArrowLeft, LogOut, Sparkles, Package, MessageSquare, Loader2, Edit, Camera } from '\''lucide-react'\'';/' src/pages/lycean/Profile.tsx

# PublicItem.tsx
sed -i 's/import { MapPin, Clock, Calendar, Image as ImageIcon, Loader2, ExternalLink } from '\''lucide-react'\''/import { MapPin, Clock, Image as ImageIcon, Loader2, ExternalLink } from '\''lucide-react'\''/' src/pages/public/PublicItem.tsx

# Fix service files
echo "Fixing service files..."

# itemService.ts
sed -i 's/  limit,/  \/\/ limit,/' src/services/itemService.ts

# messageService.ts
sed -i 's/  setDoc,/  \/\/ setDoc,/' src/services/messageService.ts

# notificationService.ts
sed -i 's/  getDoc,/  \/\/ getDoc,/' src/services/notificationService.ts

# reportService.ts
sed -i 's/  getDoc/  \/\/ getDoc/' src/services/reportService.ts

echo "Done! Run 'npm run build' to verify fixes."
