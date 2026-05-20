# Generates the three tray-icon urgency states from the existing 32x32.png:
#   tray-default.png — same as 32x32.png (no overlay)
#   tray-amber.png   — amber dot in the bottom-right
#   tray-red.png     — red dot in the bottom-right
#
# Run from src-tauri/. Idempotent — re-running overwrites the outputs.
# The overlays are drawn via System.Drawing so the script needs Windows
# PowerShell 5.1 (the WM Bridge build host's default).

Add-Type -AssemblyName System.Drawing

$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$source = Join-Path $here '32x32.png'
if (-not (Test-Path $source)) {
    throw "Source icon not found at $source"
}

function Save-WithDot {
    param(
        [string]$OutPath,
        [System.Drawing.Color]$DotColor,
        [bool]$Overlay
    )
    $bmp = [System.Drawing.Bitmap]::FromFile($source)
    $copy = New-Object System.Drawing.Bitmap($bmp.Width, $bmp.Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($copy)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.DrawImage($bmp, 0, 0, $bmp.Width, $bmp.Height)

    if ($Overlay) {
        # Filled dot in the lower-right quadrant. 14x14 with a 2px white halo
        # so it stays visible against any taskbar shade.
        $haloBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 255, 255, 255))
        $dotBrush = New-Object System.Drawing.SolidBrush($DotColor)
        $cx = $bmp.Width - 14
        $cy = $bmp.Height - 14
        $g.FillEllipse($haloBrush, $cx - 1, $cy - 1, 16, 16)
        $g.FillEllipse($dotBrush, $cx, $cy, 14, 14)
        $haloBrush.Dispose()
        $dotBrush.Dispose()
    }

    $copy.Save($OutPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $copy.Dispose()
    $bmp.Dispose()
    Write-Output "Wrote $OutPath"
}

Save-WithDot -OutPath (Join-Path $here 'tray-default.png') -DotColor ([System.Drawing.Color]::Transparent) -Overlay $false
Save-WithDot -OutPath (Join-Path $here 'tray-amber.png') -DotColor ([System.Drawing.Color]::FromArgb(255, 217, 119, 6)) -Overlay $true
Save-WithDot -OutPath (Join-Path $here 'tray-red.png') -DotColor ([System.Drawing.Color]::FromArgb(255, 220, 38, 38)) -Overlay $true
