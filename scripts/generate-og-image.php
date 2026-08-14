<?php

declare(strict_types=1);

$width = 1200;
$height = 630;
$targetDir = dirname(__DIR__).DIRECTORY_SEPARATOR.'public'.DIRECTORY_SEPARATOR.'images';
$target = $targetDir.DIRECTORY_SEPARATOR.'og-default.png';

if (! is_dir($targetDir) && ! mkdir($targetDir, 0755, true) && ! is_dir($targetDir)) {
    fwrite(STDERR, "Unable to create {$targetDir}\n");
    exit(1);
}

if (! function_exists('imagecreatetruecolor')) {
    fwrite(STDERR, "GD extension is required to generate og-default.png\n");
    exit(1);
}

$im = imagecreatetruecolor($width, $height);

for ($y = 0; $y < $height; $y++) {
    for ($x = 0; $x < $width; $x++) {
        $t = (($x / ($width - 1)) + ($y / ($height - 1))) / 2;
        $r = (int) round(0x59 + (0x34 - 0x59) * $t);
        $g = (int) round(0xDA + (0x9C - 0xDA) * $t);
        $b = (int) round(0xE6 + (0xCA - 0xE6) * $t);
        imagesetpixel($im, $x, $y, imagecolorallocate($im, $r, $g, $b));
    }
}

$white = imagecolorallocate($im, 255, 255, 255);
$fonts = [
    'C:\\Windows\\Fonts\\georgia.ttf',
    'C:\\Windows\\Fonts\\times.ttf',
    'C:\\Windows\\Fonts\\arial.ttf',
    'C:\\Windows\\Fonts\\segoeui.ttf',
];
$font = null;

foreach ($fonts as $candidate) {
    if (is_file($candidate)) {
        $font = $candidate;
        break;
    }
}

if ($font !== null) {
    imagettftext($im, 92, 0, 96, 300, $white, $font, 'JBA');
    imagettftext($im, 22, 0, 100, 370, $white, $font, 'JAPANESE BEAUTY  ACUPUNCTURE');
} else {
    imagestring($im, 5, 96, 260, 'JBA', $white);
    imagestring($im, 3, 96, 300, 'JAPANESE BEAUTY ACUPUNCTURE', $white);
}

imagepng($im, $target, 6);
imagedestroy($im);

echo "Wrote {$target}\n";
