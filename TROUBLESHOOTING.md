# Troubleshooting Guide

## Common Issues and Solutions

### 1. Installation Issues

#### Problem: `npm install` fails
**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json
rm -rf client/node_modules client/package-lock.json
rm -rf server/node_modules server/package-lock.json

# Reinstall
npm run setup
```

#### Problem: Node.js version compatibility
**Solution:**
- Ensure Node.js version 14 or higher is installed
- Use `node --version` to check your version
- Update Node.js if needed from [nodejs.org](https://nodejs.org)

### 2. Database Issues

#### Problem: MongoDB connection failed
**Solutions:**
1. **Local MongoDB:**
   ```bash
   # Start MongoDB service
   # On macOS with Homebrew:
   brew services start mongodb-community
   
   # On Ubuntu:
   sudo systemctl start mongod
   
   # On Windows:
   net start MongoDB
   ```

2. **MongoDB Atlas (Cloud):**
   - Update `MONGODB_URI` in `server/.env`
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/recipe-platform`

3. **Docker MongoDB:**
   ```bash
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

### 3. Environment Configuration

#### Problem: Missing environment variables
**Solution:**
1. Copy the example file:
   ```bash
   cp server/.env.example server/.env
   ```

2. Update the values in `server/.env`:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/recipe-platform
   JWT_SECRET=your-super-secret-jwt-key-change-this
   NODE_ENV=development
   ```

### 4. Port Conflicts

#### Problem: Port 3000 or 5000 already in use
**Solutions:**
1. **Kill existing processes:**
   ```bash
   # Find process using port
   lsof -ti:3000
   lsof -ti:5000
   
   # Kill process
   kill -9 <PID>
   ```

2. **Change ports:**
   - Client: Update `package.json` start script with `PORT=3001`
   - Server: Update `PORT` in `server/.env`

### 5. CORS Issues

#### Problem: CORS errors in browser
**Solution:**
Update `server/index.js` CORS configuration:
```javascript
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
```

### 6. Build Issues

#### Problem: Client build fails
**Solutions:**
1. **Clear React cache:**
   ```bash
   cd client
   rm -rf node_modules/.cache
   npm start
   ```

2. **Update dependencies:**
   ```bash
   cd client
   npm update
   ```

### 7. API Issues

#### Problem: API requests failing
**Solutions:**
1. **Check server is running:**
   - Visit `http://localhost:5000/api/health`
   - Should return `{"status":"OK"}`

2. **Check network tab in browser:**
   - Look for failed requests
   - Check request URLs and responses

3. **Verify proxy configuration:**
   - Ensure `"proxy": "http://localhost:5000"` is in `client/package.json`

### 8. Authentication Issues

#### Problem: Login/Register not working
**Solutions:**
1. **Check JWT_SECRET:**
   - Ensure it's set in `server/.env`
   - Should be a long, random string

2. **Clear browser storage:**
   ```javascript
   // In browser console
   localStorage.clear();
   sessionStorage.clear();
   ```

### 9. Styling Issues

#### Problem: Styled-components not working
**Solutions:**
1. **Check styled-components version:**
   ```bash
   cd client
   npm list styled-components
   ```

2. **Reinstall if needed:**
   ```bash
   cd client
   npm uninstall styled-components
   npm install styled-components@^6.0.7
   ```

### 10. Development Server Issues

#### Problem: Hot reload not working
**Solutions:**
1. **Restart development server:**
   ```bash
   # Stop with Ctrl+C, then restart
   npm run dev
   ```

2. **Check file watchers:**
   ```bash
   # Increase file watcher limit (Linux/macOS)
   echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
   sudo sysctl -p
   ```

## Getting Help

If you're still experiencing issues:

1. **Check the logs:**
   - Server logs in terminal
   - Browser console for client errors
   - Network tab for API issues

2. **Verify setup:**
   ```bash
   # Check all services are running
   npm run dev
   
   # In separate terminal, test API
   curl http://localhost:5000/api/health
   ```

3. **Common commands:**
   ```bash
   # Full reset
   npm run setup
   
   # Start development
   npm run dev
   
   # Build for production
   npm run build
   ```

## System Requirements

- **Node.js:** 14.x or higher
- **npm:** 6.x or higher
- **MongoDB:** 4.x or higher (local) or MongoDB Atlas (cloud)
- **RAM:** 4GB minimum, 8GB recommended
- **Storage:** 1GB free space

## Supported Browsers

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Tips

1. **Use MongoDB indexes** for better query performance
2. **Enable gzip compression** in production
3. **Use CDN** for static assets in production
4. **Implement caching** with Redis for better performance
5. **Optimize images** before uploading

## Security Checklist

- [ ] Change default JWT_SECRET
- [ ] Use HTTPS in production
- [ ] Implement rate limiting
- [ ] Validate all inputs
- [ ] Use environment variables for secrets
- [ ] Keep dependencies updated
- [ ] Implement proper error handling