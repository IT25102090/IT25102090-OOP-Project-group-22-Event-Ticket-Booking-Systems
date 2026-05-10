@REM Maven Wrapper - Fixed for spaces in paths and Java 25
@echo off
setlocal enableextensions enabledelayedexpansion

set "MAVEN_PROJECTBASEDIR=%~dp0"
if "%MAVEN_PROJECTBASEDIR:~-1%"=="\" set "MAVEN_PROJECTBASEDIR=%MAVEN_PROJECTBASEDIR:~0,-1%"

@REM Find java.exe
if defined JAVA_HOME (
    set "JAVA_EXE=%JAVA_HOME%\bin\java.exe"
    if not exist "!JAVA_EXE!" (
        echo ERROR: JAVA_HOME is set to an invalid directory: %JAVA_HOME% >&2
        goto error
    )
) else (
    set "JAVA_EXE=java.exe"
    "!JAVA_EXE!" -version >NUL 2>&1
    if !ERRORLEVEL! neq 0 (
        echo ERROR: JAVA_HOME is not set and no 'java' command could be found. >&2
        goto error
    )
)

set "WRAPPER_JAR=%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.jar"

@REM Check if Maven is already installed
set "MAVEN_HOME=%MAVEN_PROJECTBASEDIR%\.mvn\maven"
if exist "!MAVEN_HOME!\bin\mvn.cmd" (
    @REM Use locally installed Maven
    "!MAVEN_HOME!\bin\mvn.cmd" %*
    goto checkError
)

@REM Try running the wrapper jar with explicit main class
if exist "%WRAPPER_JAR%" (
    "!JAVA_EXE!" -cp "%WRAPPER_JAR%" "-Dmaven.multiModuleProjectDirectory=%MAVEN_PROJECTBASEDIR%" org.apache.maven.wrapper.MavenWrapperMain %*
    goto checkError
)

@REM Fallback: download Maven
echo Maven wrapper not available. Downloading Maven 3.9.6...
powershell -Command "& { [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; $url = 'https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/3.9.6/apache-maven-3.9.6-bin.zip'; $zip = '%MAVEN_PROJECTBASEDIR%\.mvn\maven.zip'; (New-Object System.Net.WebClient).DownloadFile($url, $zip); Expand-Archive -Path $zip -DestinationPath '%MAVEN_PROJECTBASEDIR%\.mvn' -Force; Rename-Item -Path '%MAVEN_PROJECTBASEDIR%\.mvn\apache-maven-3.9.6' -NewName 'maven'; Remove-Item $zip }"
if exist "!MAVEN_HOME!\bin\mvn.cmd" (
    "!MAVEN_HOME!\bin\mvn.cmd" %*
    goto checkError
)

echo ERROR: Could not set up Maven. >&2
goto error

:checkError
if %ERRORLEVEL% neq 0 goto error
goto end

:error
set ERROR_CODE=1

:end
endlocal & set ERROR_CODE=%ERROR_CODE%
cmd /C exit /B %ERROR_CODE%
