#!/bin/bash

dir="_posts"
for file in `ls ${dir} | grep '.md'`;do
    content=$(cat ${dir}/${file}| head -n 8 | grep 'date: ')
    dateStr=$(echo "$content" | awk '{print $2" "$3" "$4}')
    newContent="updated: "$dateStr
    sed -i "" "s/$content/$content\n$newContent/" ${dir}/${file}
done