@echo off

if exist deploy (
	rmdir deploy /S /Q
)

mkdir deploy\content\javascript
mkdir deploy\content\images
mkdir deploy\content\css

..\..\argos-sdk\tools\JsBit\jsbit.exe -p "build\release.jsb2" -d "."
if %errorlevel% neq 0 exit /b %errorlevel%