@echo off
setlocal enabledelayedexpansion

echo.
echo 🚀 EthioInvest Network - Deployment Setup
echo ========================================

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: package.json not found. Please run this script from the project root.
    pause
    exit /b 1
)

echo 📋 Checking prerequisites...

REM Check Node.js version
for /f "tokens=*" %%i in ('node --version 2^>nul') do set NODE_VERSION=%%i
if "!NODE_VERSION!"=="" (
    echo ❌ Node.js not found. Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
) else (
    echo ✅ Node.js version: !NODE_VERSION!
)

REM Check npm version
for /f "tokens=*" %%i in ('npm --version 2^>nul') do set NPM_VERSION=%%i
if "!NPM_VERSION!"=="" (
    echo ❌ npm not found. Please install npm.
    pause
    exit /b 1
) else (
    echo ✅ npm version: !NPM_VERSION!
)

REM Create .env.local if it doesn't exist
if not exist ".env.local" (
    echo 📝 Creating .env.local from .env.example...
    copy ".env.example" ".env.local" >nul
    echo ⚠️  Please update .env.local with your actual values before deployment!
) else (
    echo ✅ .env.local already exists
)

REM Install dependencies
echo 📦 Installing dependencies...
call npm install
if errorlevel 1 (
    echo ❌ Failed to install dependencies!
    pause
    exit /b 1
)

REM Test build
echo 🔨 Testing build process...
call npm run build
if errorlevel 1 (
    echo ❌ Build failed! Please fix any errors before deploying.
    pause
    exit /b 1
) else (
    echo ✅ Build successful!
    echo 📁 Build output created in .\dist\
)

REM Check if git is initialized
if not exist ".git" (
    echo ⚠️  Git repository not initialized. Initialize with:
    echo    git init
    echo    git add .
    echo    git commit -m "Initial commit"
    echo    git remote add origin ^<your-repo-url^>
    echo    git push -u origin main
) else (
    echo ✅ Git repository detected
)

echo.
echo 🎯 Next Steps:
echo 1. Update .env.local with your actual values
echo 2. Deploy backend to Railway/Render/Heroku (see NETLIFY_DEPLOYMENT_GUIDE.md)
echo 3. Deploy frontend to Netlify
echo 4. Update environment variables in both services
echo 5. Test your deployed application
echo.
echo 📖 For detailed instructions, see: NETLIFY_DEPLOYMENT_GUIDE.md
echo.
echo ✨ Setup complete! Happy deploying! 🚀
echo.
pause