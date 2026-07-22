@echo off
echo Creating folder structure...

mkdir src\components\common 2>nul
mkdir src\components\dashboard 2>nul
mkdir src\components\devices 2>nul
mkdir src\components\budget 2>nul
mkdir src\components\auth 2>nul
mkdir src\pages 2>nul
mkdir src\services 2>nul
mkdir src\utils 2>nul
mkdir public 2>nul

echo Folder structure created successfully!
echo.
echo Folder structure:
echo src/
echo   ├── components/
echo   │   ├── common/
echo   │   ├── dashboard/
echo   │   ├── devices/
echo   │   ├── budget/
echo   │   └── auth/
echo   ├── pages/
echo   ├── services/
echo   └── utils/
echo.
pause