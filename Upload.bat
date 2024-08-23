

@REM :: Leer el archivo .env
@REM for /f "usebackq tokens=1,2 delims==" %%A in (".env") do (
@REM     set "%%A=%%B"
@REM )

@REM :: Mostrar las variables para comprobar que se han cargado
@REM echo GITUSER=%GITUSER%
@REM echo GITPASS=%GITPASS%

@REM :: Hacer algo más con las variables

@REM endlocal
@REM pause


@echo off
setlocal
setlocal enabledelayedexpansion

:: Obtener la fecha y hora en formato YYYYMMDDHHMMSS
for /f "tokens=2 delims==" %%A in ('wmic os get localdatetime /value') do set datetime=%%A

:: Extraer día, mes y año del datetime
set "year=%datetime:~0,4%"
set "month=%datetime:~4,2%"
set "day=%datetime:~6,2%"




for /f "usebackq tokens=1,2 delims==" %%A in (".env") do (
    set "%%A=%%B"
)

echo GITUSER=%GITUSER%
echo GITTOKEN=%GITTOKEN%
echo GITEMAIL=%GITEMAIL%

git init
git checkout -b main 
git add .
git config user.name %GITUSER% && git config user.email %GITEMAIL%
git commit -m "Commit realizado el dia %day%_%month%_%year%"
git remote add origin https://%GITTOKEN%@github.com/BONAFO/YGODL.git
git remote -v
git push origin main



endlocal
pause