# Starts MySQL 8.4 as a background process (no admin required)
$dataDir = "C:\Users\emili\mysql-data"
$mysqld  = "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysqld.exe"

$running = netstat -ano | Select-String ":3306"
if ($running) {
    Write-Host "MySQL already running on port 3306." -ForegroundColor Green
} else {
    Write-Host "Starting MySQL..." -ForegroundColor Yellow
    Start-Process -FilePath $mysqld -ArgumentList "--datadir=`"$dataDir`"","--port=3306" -WindowStyle Hidden
    Start-Sleep -Seconds 4
    Write-Host "MySQL started." -ForegroundColor Green
}
