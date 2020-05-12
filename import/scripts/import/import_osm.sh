#!/bin/bash

set -e

start=`date +%s`

#echo "dropping tables"
#psql -h $host -p $port -d osmdata -U $user --no-password <<-EOSQL
#  DROP TABLE import.osm_linestring;
#  DROP TABLE import.osm_polygon;
#  DROP TABLE import.osm_point;
#EOSQL
#echo "tables dropped"

data=( \
  "/home/osmdata/data/south-korea-latest.osm.pbf,/home/osmdata/pbf/south-korea-latest" \
)

for i in "${data[@]}"; do
	IFS=',' read pbf out <<< "${i}"
  echo "Filtering tags from $pbf"

  /home/osmdata/imposm import \
            -mapping "/home/osmdata/mapping.yml" \
            -dbschema-production "public" \
            -dbschema-import "import" \
            -dbschema-backup "backup" \
            -cachedir "/home/osmdata/pbf/impcache" \
            -overwritecache \
            -deployproduction \
            -diffdir "/home/osmdata/pbf/impdiff" \
            -diff \
            -srid 3857 \
            -read ${pbf} \
            -write \
            -connection "postgis://$user:$password@$host:$port/$dbname"
done

end=`date +%s`

runtime=$((end-start))
echo "$runtime"
