# run_all.ps1
Write-Host "Starting PageInsights Backend..." -ForegroundColor Green
Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit", "-Command", "cd backend; npm run dev"

Write-Host "Starting PageInsights Frontend..." -ForegroundColor Green
Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Write-Host "Done! Services are starting up." -ForegroundColor Cyan
