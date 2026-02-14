# Phase 2: User Authentication & Session - Testing Guide

## ✅ What We Implemented

1. **Socket Connection on Login**
   - WelcomePage connects to backend when user submits username
   - Real-time validation (2-20 characters)
   - Loading states during connection
   - Error handling for connection failures

2. **User Session Management**
   - Receives userId, username, and color from backend
   - Stores user data in SocketContext
   - Displays real online user count
   - Shows connection status indicator

3. **Connection Status Component**
   - Visual indicator (green = connected, red = disconnected)
   - Shows username and online count
   - Displays connection errors

## 🧪 How to Test

### Prerequisites
1. **Backend running**: `npm start` in `/Backend` directory
2. **Frontend running**: `npm run dev` in `/my-project` directory

### Test Steps

#### Test 1: Successful Connection
1. Open `http://localhost:5173` (or your Vite port)
2. Wait for loading animation to complete
3. Enter username: `TestUser1`
4. Click "Start Playing"
5. **Expected**: 
   - Button shows "Connecting..."
   - Navigates to game page
   - Green connection badge appears (top-right)
   - Shows your username and color
   - Shows "1 online" (or more if multiple users)

#### Test 2: Validation Errors
1. Try empty username → Error: "Please enter a username"
2. Try "A" (1 char) → Error: "Username must be at least 2 characters"
3. Try 21+ characters → Error: "Username must be less than 20 characters"

#### Test 3: Multiple Users
1. Open 2 browser tabs
2. Connect with different usernames
3. **Expected**:
   - Both show "2 online"
   - Backend console shows both connections
   - Each has different color

#### Test 4: Connection Error
1. Stop backend server
2. Try to connect
3. **Expected**:
   - Error message appears
   - Button returns to normal state
   - Can retry after restarting backend

#### Test 5: Reconnection
1. Connect successfully
2. Stop backend
3. Restart backend
4. **Expected**:
   - Auto-reconnects within 5 seconds
   - Connection status updates

## 🔍 What to Check

### Frontend Console
```
🔌 Connecting to socket server... http://localhost:3000
✅ Socket connected: <socket-id>
👋 User joined: { userId, username, color, message }
✅ Connected successfully: { userId, username, color }
```

### Backend Console
```
🎮 User connected: <username>
👤 Session created for <username>
```

### Network Tab
- WebSocket connection to `ws://localhost:3000`
- Socket.IO handshake successful
- Auth data sent: `{ username: "TestUser1" }`

## 🐛 Common Issues

### Issue: "Cannot connect to server"
**Solution**: Make sure backend is running on port 3000

### Issue: "Username validation failed"
**Solution**: Check backend validators.js - username regex

### Issue: "Stuck on connecting..."
**Solution**: Check browser console for errors, verify CORS settings

### Issue: "Connection status not showing"
**Solution**: Verify SocketProvider is wrapping App.jsx

## 📊 What's Working

✅ Socket.IO connection established
✅ Username authentication
✅ User session created in Redis
✅ Real-time online user count
✅ Connection status indicator
✅ Error handling
✅ Loading states
✅ Auto-reconnection

## 🎯 Next: Phase 3

Phase 3 will add:
- Game creation
- Joining games
- Starting games
- Game state management
- Game ID display

---

**Phase 2 Status**: ✅ COMPLETE
