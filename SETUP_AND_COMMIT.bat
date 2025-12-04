@echo off
echo ========================================
echo   FundMeUp - Setup and Git Commit
echo ========================================
echo.

cd /d "%~dp0"

echo [1/4] Renaming directory...
if exist "fundmeup-frontend" (
    ren "fundmeup-frontend" "frontend"
    echo   Directory renamed: fundmeup-frontend -^> frontend
) else (
    echo   Directory already renamed or not found.
)
echo.

echo [2/4] Staging all changes...
git add -A
echo   All changes staged.
echo.

echo [3/4] Committing changes...
git commit -m "refactor: rename fundmeup-frontend to frontend, remove .md files, add startup scripts"
echo   Changes committed.
echo.

echo [4/4] Checking remote...
git remote -v
echo.
echo ========================================
echo   Next Steps:
echo ========================================
echo   1. If remote exists, run: git push
echo   2. If no remote, add one: git remote add origin YOUR_REPO_URL
echo   3. Then push: git push -u origin main
echo.
pause

