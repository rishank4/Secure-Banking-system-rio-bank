@echo off
title Push Rio Banking to GitHub
color 0a

echo ========================================================
echo        PUSHING RIO BANKING TO GITHUB
echo        Repository: https://github.com/rishank4/Secure-Banking-system-rio-bank.git
echo ========================================================
echo.

cd /d "%~dp0"
git push -u origin main

echo.
echo ========================================================
if %ERRORLEVEL% EQU 0 (
    echo SUCCESS! Repository pushed to GitHub!
) else (
    echo If prompted above, please complete the sign-in with your browser or token.
)
echo ========================================================
pause

