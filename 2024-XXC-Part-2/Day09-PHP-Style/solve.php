<?php
// Uses the PSR-12: Extended Coding Style guide available at
// https://www.php-fig.org/psr/psr-12/

$testInput = file_get_contents('test_input.dat');
$challengeInput = file_get_contents('challenge_input.dat');

// $disk = parseInput($challengeInput);
$disk = parseInput($testInput);

$compactedDisk = compactDisk($disk);

$checksum = getChecksum($compactedDisk);

echo 'Part 1: What is the resulting filesystem checksum? Answer: ' . $checksum . PHP_EOL;

function parseInput(string $input): array
{
    $segments = str_split($input);
    $disk = [];
    $i = 0;
    $freeSpace = False;
    foreach ($segments as $segment) {
        $size = (int) $segment;
        while ($size > 0) {
            if ($freeSpace) {
                $disk[] = '.';
            } else {
                $disk[] = $i;
            }
            $size--;
        }
        $freeSpace = !$freeSpace;
        if ($freeSpace) {
            $i++;
        }
    }
    return $disk;
}

function compactDisk(array $disk): array
{
    $compactedDisk = [];
    $i = 0;
    while ($i < count($disk)) {
        if ($disk[$i] == '.') {
            while (end($disk) == '.' && $i < count($disk)) {
                array_pop($disk);
            }
            $compactedDisk[] = (integer) array_pop($disk);
        } else {
            $compactedDisk[] = (integer) $disk[$i];
        }
            $i++;
    }
    return $compactedDisk;
}

function getChecksum(array $disk): int
{
    $checksum = 0;
    $i = 0;
    while ($i < count($disk)) {
        $checksum += $disk[$i] * $i;
        $i++;
    }
    return $checksum;
}
