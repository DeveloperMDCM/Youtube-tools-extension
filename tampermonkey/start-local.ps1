$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'
$root = Split-Path -Parent $PSScriptRoot
$bin = Join-Path $root '.local\bin'
$node = Join-Path $bin 'node.exe'
$hash = '58e74bf02fc5bbacc41dcb8bef089961cd5bddd37830b87784e4fc624d145d1f'
$url = 'https://nodejs.org/dist/v24.14.1/win-x64/node.exe'
function Get-FileSha256([string]$path) {
    $stream = [System.IO.File]::OpenRead($path)
    $sha = [System.Security.Cryptography.SHA256]::Create()
    try { return [BitConverter]::ToString($sha.ComputeHash($stream)).Replace('-', '').ToLowerInvariant() }
    finally { $sha.Dispose(); $stream.Dispose() }
}
try {
    if (-not [Environment]::Is64BitOperatingSystem) { throw 'Setup requires 64-bit Windows.' }
    if (-not (Test-Path -LiteralPath $node) -or (Get-FileSha256 $node) -ne $hash) {
        New-Item -ItemType Directory -Path $bin -Force | Out-Null
        $tempFile = Join-Path $bin "node-$PID.tmp"
        try {
            Write-Host 'Installing Node.js locally (one-time download)...'
            [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
            Invoke-WebRequest -Uri $url -OutFile $tempFile -UseBasicParsing -TimeoutSec 180
            if ((Get-FileSha256 $tempFile) -ne $hash) { throw 'Node.js checksum did not match.' }
            Move-Item -LiteralPath $tempFile -Destination $node -Force
            Write-Host 'Node.js installed and checksum verified.'
        } finally {
            if (Test-Path -LiteralPath $tempFile) { Remove-Item -LiteralPath $tempFile -Force }
        }
    }
    Push-Location -LiteralPath $root
    try { & $node (Join-Path $PSScriptRoot 'dev.mjs'); if ($LASTEXITCODE -ne 0) { throw "Local service exited with code $LASTEXITCODE." } }
    finally { Pop-Location }
} catch {
    Write-Error "Local setup failed: $($_.Exception.Message)"
    exit 1
}
