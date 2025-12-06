# Meeting Scheduler Setup Script
# Run this script to set up your meeting scheduler

Write-Host "=== Meeting Scheduler Setup ===" -ForegroundColor Cyan
Write-Host ""

# Check if Supabase CLI is installed
Write-Host "Checking Supabase CLI..." -ForegroundColor Yellow
$supabaseInstalled = Get-Command npx -ErrorAction SilentlyContinue
if (-not $supabaseInstalled) {
    Write-Host "Error: Node.js/npx not found. Please install Node.js first." -ForegroundColor Red
    exit 1
}

Write-Host "✓ Supabase CLI available" -ForegroundColor Green
Write-Host ""

# Step 1: Set Google Service Account Email
Write-Host "Step 1: Setting Google Service Account Email..." -ForegroundColor Yellow
$serviceAccountEmail = "meeting-scheduler@next-ignition-meetings.iam.gserviceaccount.com"
npx supabase secrets set GOOGLE_SERVICE_ACCOUNT_EMAIL="$serviceAccountEmail"
Write-Host "✓ Google Service Account Email set" -ForegroundColor Green
Write-Host ""

# Step 2: Set Google Private Key
Write-Host "Step 2: Setting Google Private Key..." -ForegroundColor Yellow
Write-Host "Note: The private key is from your service account JSON file" -ForegroundColor Gray

# Read the private key from the JSON file if it exists
$jsonPath = "C:\Users\neelk\Downloads\next-ignition-meetings-1f1c28de9f75.json"
if (Test-Path $jsonPath) {
    Write-Host "Found service account JSON file" -ForegroundColor Gray
    $jsonContent = Get-Content $jsonPath -Raw | ConvertFrom-Json
    $privateKey = $jsonContent.private_key
    
    npx supabase secrets set GOOGLE_PRIVATE_KEY="$privateKey"
    Write-Host "✓ Google Private Key set from JSON file" -ForegroundColor Green
} else {
    Write-Host "JSON file not found at $jsonPath" -ForegroundColor Yellow
    Write-Host "Please set the private key manually:" -ForegroundColor Yellow
    Write-Host 'npx supabase secrets set GOOGLE_PRIVATE_KEY="YOUR_PRIVATE_KEY_HERE"' -ForegroundColor Gray
}
Write-Host ""

# Step 3: Set Resend API Key
Write-Host "Step 3: Setting Resend API Key..." -ForegroundColor Yellow
Write-Host "If you don't have a Resend API key, sign up at https://resend.com" -ForegroundColor Gray
Write-Host ""
$resendKey = Read-Host "Enter your Resend API Key (or press Enter to skip)"

if ($resendKey) {
    npx supabase secrets set RESEND_API_KEY="$resendKey"
    Write-Host "✓ Resend API Key set" -ForegroundColor Green
} else {
    Write-Host "⚠ Skipped Resend API Key (emails won't be sent)" -ForegroundColor Yellow
}
Write-Host ""

# Step 4: Deploy the Edge Function
Write-Host "Step 4: Deploying the Edge Function..." -ForegroundColor Yellow
Write-Host "This will deploy the schedule-meeting function to Supabase" -ForegroundColor Gray
Write-Host ""

$deploy = Read-Host "Deploy the edge function now? (y/n)"
if ($deploy -eq "y" -or $deploy -eq "Y") {
    npx supabase functions deploy schedule-meeting
    Write-Host "✓ Edge Function deployed" -ForegroundColor Green
} else {
    Write-Host "⚠ Skipped deployment. Deploy manually with:" -ForegroundColor Yellow
    Write-Host "npx supabase functions deploy schedule-meeting" -ForegroundColor Gray
}

Write-Host ""
Write-Host "=== Setup Complete! ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Test the meeting scheduler in your app" -ForegroundColor White
Write-Host "2. Check the MEETING_SCHEDULER_SOLUTION.md file for full documentation" -ForegroundColor White
Write-Host "3. View Supabase Edge Function logs for debugging: https://app.supabase.com" -ForegroundColor White
Write-Host ""
Write-Host "Video meetings will use Jitsi Meet (free, no API key needed!)" -ForegroundColor Green
Write-Host ""
