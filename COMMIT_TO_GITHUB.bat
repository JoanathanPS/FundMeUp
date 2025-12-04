@echo off
echo ========================================
echo   FundMeUp - Commit to GitHub
echo ========================================
echo.

cd /d "%~dp0"

echo [Step 1] Renaming directory...
if exist "fundmeup-frontend" (
    ren "fundmeup-frontend" "frontend"
    echo   ✓ Directory renamed to 'frontend'
) else (
    echo   ✓ Directory already named 'frontend'
)
echo.

echo [Step 2] Staging all changes...
git add -A
if %errorlevel% equ 0 (
    echo   ✓ All changes staged
) else (
    echo   ✗ Error staging changes
    pause
    exit /b 1
)
echo.

echo [Step 3] Committing changes...
git commit -m "refactor: rename to frontend, remove .md files, add startup scripts

- Renamed fundmeup-frontend directory to frontend
- Removed all .md documentation files
- Added START_APP.bat for easy startup
- Updated package.json name to 'frontend'
- Cleaned up project structure"
if %errorlevel% equ 0 (
    echo   ✓ Changes committed
) else (
    echo   ✗ Error committing (maybe no changes?)
)
echo.

echo [Step 4] Checking git remote...
git remote -v
echo.

echo ========================================
echo   Status: Ready to Push
echo ========================================
echo.
echo   To push to GitHub, run:
echo     git push
echo.
echo   Or if first time:
echo     git remote add origin YOUR_REPO_URL
echo     git push -u origin main
echo.
pause

