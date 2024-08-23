@REM @echo off
@REM setlocal
@REM set "i=1"

@REM cd ./Cards/

@REM cls && node index.js pack %i%
@REM node index.js man %i%
@REM node index.js card %i%

@REM set /p dummy="Presione Enter para salir..."



@echo off
setlocal

:loop
set "i="
set /p i="Por favor, ingrese un número: "

:: Verificar si la entrada es un número
for /f "delims=0123456789" %%a in ("%i%") do (
    echo Entrada no válida
    goto end
)

:: Si es un número, mostrarlo y volver a pedir entrada
cd ./Cards/
cls && node index.js pack %i%
node index.js man %i%
node index.js card %i%
echo "Done with %i%. Wating to next index"
:: Preguntar si desea ingresar otro número
goto loop
@REM set /p retry="Desea ingresar otro número? (S/N): "
@REM if /i "%retry%"=="S" goto loop

:end
endlocal
set /p dummy="Presione Enter para salir..."
