$ErrorActionPreference = 'Continue'
$root = Split-Path -Parent $PSScriptRoot
$logDirectory = Join-Path $root '.local\dev'
New-Item -ItemType Directory -Path $logDirectory -Force | Out-Null
$log = Join-Path $logDirectory 'startup.log'
& (Join-Path $PSScriptRoot 'start-local.ps1') *> $log
