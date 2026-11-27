$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot
$nodePath = 'C:/Users/a.ikhsanau/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe'
$client = New-Object System.Net.Sockets.TcpClient
try { $task = $client.ConnectAsync('127.0.0.1',3100); if ($task.Wait(800) -and $client.Connected) { $client.Dispose(); exit 0 } } catch {}
$client.Dispose()
Start-Process -FilePath $nodePath -ArgumentList @('node_modules/next/dist/bin/next','dev','--webpack','--port','3100') -WorkingDirectory $PSScriptRoot -WindowStyle Hidden -RedirectStandardOutput (Join-Path $PSScriptRoot 'local-server.log') -RedirectStandardError (Join-Path $PSScriptRoot 'local-server-error.log')
