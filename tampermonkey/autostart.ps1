param([ValidateSet('Enable', 'Disable')][string]$Action = 'Enable')
$ErrorActionPreference = 'Stop'
$runKey = 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Run'
$name = 'YouTube Tools Local'
$background = Join-Path $PSScriptRoot 'start-background.ps1'
$powershell = Join-Path $env:SystemRoot 'System32\WindowsPowerShell\v1.0\powershell.exe'
$command = '"{0}" -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File "{1}"' -f $powershell, $background

if ($Action -eq 'Enable') {
    if (-not (Test-Path -LiteralPath $background)) { throw 'The background launcher is missing.' }
    New-Item -Path $runKey -Force | Out-Null
    Set-ItemProperty -LiteralPath $runKey -Name $name -Value $command -Type String
    Write-Host 'YouTube Tools will start for your Windows account when you sign in.'
    Write-Host 'If you move the project folder, enable startup again from the new folder.'
} else {
    $existing = (Get-ItemProperty -LiteralPath $runKey -Name $name -ErrorAction SilentlyContinue).$name
    if ($existing -and $existing -ne $command) { throw 'The startup entry belongs to a different YouTube Tools folder; disable it from that folder.' }
    if ($existing) { Remove-ItemProperty -LiteralPath $runKey -Name $name }
    Write-Host 'YouTube Tools automatic startup is disabled for your Windows account.'
}
