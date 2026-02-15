# PowerShell script to add all Vercel environment variables

Write-Host "Adding Firebase environment variables to Vercel..." -ForegroundColor Green

$env_vars = @(
    @{key="VITE_FIREBASE_API_KEY"; value="AIzaSyDZhpCypvu-Jqpne8Fr_kfmRz36r9Ik_Ys"},
    @{key="VITE_FIREBASE_AUTH_DOMAIN"; value="aio-llmo-analyzer.firebaseapp.com"},
    @{key="VITE_FIREBASE_PROJECT_ID"; value="aio-llmo-analyzer"},
    @{key="VITE_FIREBASE_STORAGE_BUCKET"; value="aio-llmo-analyzer.firebasestorage.app"},
    @{key="VITE_FIREBASE_MESSAGING_SENDER_ID"; value="672681578580"},
    @{key="VITE_FIREBASE_APP_ID"; value="1:672681578580:web:6161a53e37e0f529489dc1"},
    @{key="VITE_API_URL"; value="https://aio-llmo-strategy-osint-analyzer.vercel.app"}
)

foreach ($env in $env_vars) {
    Write-Host "Adding $($env.key)..." -ForegroundColor Yellow
    $env.value | vercel env add $env.key production
}

Write-Host "`nDone! Now redeploy your site." -ForegroundColor Green
Write-Host "Run: vercel --prod --yes" -ForegroundColor Cyan
