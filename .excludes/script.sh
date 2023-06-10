#!/bin/sh

cmd=${1?No command}
type=${2:-db}
file="parking_slip_printer."$type

if [ $cmd="push" ]; then
    adb $cmd $file /storage/emulated/0/.psb-config/$file
elif [$cmd="pull"]; then
    adb $cmd /storage/emulated/0/.psb-config/$file $file
fi
