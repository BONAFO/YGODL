@echo off
setlocal

echo "Loading Manifiest..."
node ./Cards/manifiest_creator.js
node ./Cards/load_manifiest_params.js
goto ask_pack

@REM SELECTING THE PACKS
:ask_pack
set "pack="
set /p pack="Por favor, ingrese numero de pack: "

for /f "delims=0123456789" %%a in ("%pack%") do (
    echo Entrada no valida
    goto ask_pack
)
goto ask_limit

@REM SELECTING THE PACKS

@REM SELECTING LIMITS
:ask_limit
set "limit="
set /p limit="Por favor, ingrese el limite: "

for /f "delims=0123456789" %%a in ("%limit%") do (
    echo Entrada no valida
    goto ask_limit
)
@REM SELECTING LIMITS

@REM SELECTING LIMITS
:ask_start
set "start="
set /p start="¿Por donde comenzamos? (default = 0): "

for /f "delims=0123456789" %%a in ("%start%") do (
    start = 0
)
@REM SELECTING LIMITS

goto loop

:loop
set /a i=%start%
:compare
echo %i%

if %i% GTR %limit% (
    echo END
    goto end
) else (
    cls
    echo "Working in %i%"
    node ./Cards/dowload_pack %pack% pack %i%
    node ./Cards/dowload_pack %pack% man %i%
    node ./Cards/dowload_pack %pack% card %i%
    @REM node ./Cards/evaluate_db.js
    set /a i+=1
    goto compare
)

@REM set /a i+=1
@REM echo %i%
goto end



:end
endlocal
set /p dummy="Presione Enter para salir..."













@REM SELECTING LIMITS


@REM SELECTING LIMITS
@REM set /a i=0

@REM :loop
@REM echo %i%
@REM if %i% GEQ %limit% (
@REM     echo %i% es mayor o igual que %limit%.
@REM     goto end
@REM ) else (
@REM     set /a i+=1
@REM     goto loop
@REM )
@REM @REM goto loop

@REM @REM SELECTING LIMITS

@REM goto end


@REM set "i=0"

@REM :loop
@REM set /a i+=1
@REM echo %i%
@REM if "%i%"=="10" (
@REM     echo NO ES MAS GRANDE
@REM     goto end
@REM ) else (
@REM     echo SI ES MAS GRANDE
@REM     goto loop
@REM )
@REM @REM goto loop

