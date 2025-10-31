@echo off
setlocal

REM Simple local server for Windows
REM Serves the portfolio at http://localhost:8000

set PORT=8000
pushd %~dp0
echo Starting portfolio server at http://localhost:%PORT%

REM Prefer Python launcher if available
where py >nul 2>nul
if %ERRORLEVEL%==0 (
  py -3 -m http.server %PORT%
) else (
  python -m http.server %PORT%
)

popd
endlocal

