[CmdletBinding()]
param(
  [string]$OutputDirectory
)

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

$productRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$OutputDirectory = if ($OutputDirectory) { $OutputDirectory } else { Join-Path $productRoot 'artifacts' }
$outputRoot = [IO.Path]::GetFullPath($OutputDirectory)
$stageRoot = Join-Path $outputRoot '_package-stage'
$packageName = 'interactive-proposal-builder-0.1.0-offline.zip'
$zipPath = Join-Path $outputRoot $packageName
$fixedTimestamp = [DateTimeOffset]::new(1980, 1, 1, 0, 0, 0, [TimeSpan]::Zero)

$include = @(
  '.gitignore', 'LICENSE', 'README.md', 'START-HERE-ES.md', 'START-HERE-EN.md',
  'LISTING-ES.md', 'LISTING-EN.md', 'index.html', 'package.json', 'package-lock.json',
  'pdf.mjs', 'server.mjs', 'vercel.json', 'vite.config.js', 'api', 'src', 'tests', 'docs', 'scripts'
)
$forbiddenPath = '(^|[\\/])(node_modules|\.git|dist|\.vercel)([\\/]|$)|(^|[\\/])\.env($|\.)|\.(pem|pfx|p12|key)$'
$secretMarker = '-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|(?:ghp_|github_pat_|sk_live_)[A-Za-z0-9_-]+'

New-Item -ItemType Directory -Force -Path $outputRoot | Out-Null
if (Test-Path -LiteralPath $stageRoot) { Remove-Item -LiteralPath $stageRoot -Recurse -Force }
if (Test-Path -LiteralPath $zipPath) { Remove-Item -LiteralPath $zipPath -Force }
New-Item -ItemType Directory -Force -Path $stageRoot | Out-Null

foreach ($item in $include) {
  $source = Join-Path $productRoot $item
  if (-not (Test-Path -LiteralPath $source)) { throw "Required package item is missing: $item" }
  $destination = Join-Path $stageRoot $item
  if ((Get-Item -LiteralPath $source).PSIsContainer) {
    Copy-Item -LiteralPath $source -Destination $destination -Recurse -Force
  } else {
    New-Item -ItemType Directory -Force -Path (Split-Path -Parent $destination) | Out-Null
    Copy-Item -LiteralPath $source -Destination $destination -Force
  }
}

$files = Get-ChildItem -LiteralPath $stageRoot -File -Recurse | Sort-Object { $_.FullName.Substring($stageRoot.Length).Replace('\', '/') }
foreach ($file in $files) {
  $relative = $file.FullName.Substring($stageRoot.Length).TrimStart('\', '/').Replace('\', '/')
  if ($relative -match $forbiddenPath) { throw "Forbidden file selected for package: $relative" }
  if ($file.Length -le 5MB -and (Select-String -LiteralPath $file.FullName -Pattern $secretMarker -Quiet)) {
    throw "Possible secret marker in package file: $relative"
  }
}

Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
$stream = [IO.File]::Open($zipPath, [IO.FileMode]::CreateNew)
try {
  $archive = [IO.Compression.ZipArchive]::new($stream, [IO.Compression.ZipArchiveMode]::Create, $false)
  try {
    foreach ($file in $files) {
      $relative = $file.FullName.Substring($stageRoot.Length).TrimStart('\', '/').Replace('\', '/')
      $entry = $archive.CreateEntry("interactive-proposal-builder/$relative", [IO.Compression.CompressionLevel]::Optimal)
      $entry.LastWriteTime = $fixedTimestamp
      $entryStream = $entry.Open()
      try {
        $input = [IO.File]::OpenRead($file.FullName)
        try { $input.CopyTo($entryStream) } finally { $input.Dispose() }
      } finally { $entryStream.Dispose() }
    }
  } finally { $archive.Dispose() }
} finally { $stream.Dispose() }

Remove-Item -LiteralPath $stageRoot -Recurse -Force
$hash = (Get-FileHash -LiteralPath $zipPath -Algorithm SHA256).Hash
Write-Host "Created $zipPath"
Write-Host "SHA256 $hash"
