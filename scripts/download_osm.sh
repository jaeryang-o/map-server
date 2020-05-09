#!/bin/bash

set -e

start=`date +%s`

array=( \
  "south-korea-latest.osm.pbf,https://download.geofabrik.de/asia/south-korea-latest.osm.pbf" \
)

for i in "${array[@]}"; do
	echo "downloading $i"
	IFS=',' read file url <<< "${i}"
	axel -n 4 -a -v --output=../import/data/${file} ${url}

done

end=`date +%s`

runtime=$((end-start))
echo "$runtime"
