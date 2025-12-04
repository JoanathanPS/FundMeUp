@echo off
echo Renaming fundmeup-frontend to frontend...
if exist "fundmeup-frontend" (
    ren "fundmeup-frontend" "frontend"
    echo Directory renamed successfully!
) else (
    echo Directory already renamed or not found.
)
pause

