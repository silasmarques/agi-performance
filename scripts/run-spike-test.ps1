$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot

# Ajuste manualmente este caminho conforme a instalacao local do Apache JMeter 5.6.3.
$jmeterBin = "C:\apache-jmeter-5.6.3\bin\jmeter.bat"

$testPlan = Join-Path $projectRoot "test-plans\blazedemo-spike-test.jmx"
$reportDir = Join-Path $projectRoot "reports\spike-test"
$htmlReportDir = Join-Path $reportDir "html"
$resultsFile = Join-Path $reportDir "results.jtl"

if (-not (Test-Path $jmeterBin)) {
    throw "JMeter nao encontrado em: $jmeterBin. Ajuste a variavel `$jmeterBin no script."
}

if (-not (Test-Path $testPlan)) {
    throw "Plano de teste nao encontrado em: $testPlan"
}

New-Item -ItemType Directory -Force -Path $reportDir | Out-Null

if (Test-Path $htmlReportDir) {
    Remove-Item -LiteralPath $htmlReportDir -Recurse -Force
}

if (Test-Path $resultsFile) {
    Remove-Item -LiteralPath $resultsFile -Force
}

New-Item -ItemType Directory -Force -Path $htmlReportDir | Out-Null

& $jmeterBin `
    -n `
    -t $testPlan `
    -l $resultsFile `
    -e `
    -o $htmlReportDir

Write-Host "Spike Test finalizado com sucesso."
Write-Host "Resultados: $resultsFile"
Write-Host "Relatorio HTML: $htmlReportDir"
