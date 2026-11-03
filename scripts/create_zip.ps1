Set-Location 'C:\Users\Admin\.gemini\antigravity\scratch\hanzii-logic'
$zip = 'C:\Users\Admin\.gemini\antigravity\scratch\hanzii-logic\chinese-daily.zip'
if (Test-Path $zip) {
    Remove-Item $zip -Force
}
$files = @('data', 'images', 'scripts', 'index.html', 'app.js', 'styles.css', 'server.js', 'tunnel_manager.js', 'package.json')
Compress-Archive -Path $files -DestinationPath $zip -CompressionLevel Optimal
$size = (Get-Item $zip).Length
Write-Host "Zip created successfully. Size: $size bytes"
