#!/bin/bash

set -e

start=`date +%s`

export host=${POSTGRES_HOST}
export port=5432
export user=${POSTGRES_USER}
export password=${POSTGRES_PASS}
export PGPASSWORD=${POSTGRES_PASS}
export dbname=${POSTGRES_DBNAME}

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

#tags=( place )
tags=( natural building highway landuse waterway boundary route \
	amenity place leisure water power barrier railway man_made shop \
	sport tourism public_transport historic emergency office aeroway \
	craft military aerialway geological telecom )

for i in "${data[@]}"; do
	IFS=',' read pbf out <<< "${i}"
  echo "Filtering tags from $pbf"

	for tag in "${tags[@]}"; do
	  echo "Filtering $tag"
	  osmium tags-filter ${pbf} nwr/${tag} --progress -o ${out}_${tag}.osm.pbf

    echo "treating $i"
    /home/osmdata/imposm import \
            -mapping "/home/osmdata/mapping.yml" \
            -cachedir "/home/osmdata/pbf/impcache" \
            -overwritecache \
            -srid 4326 \
            -read ${out}_${tag}.osm.pbf \
            -write \
            -connection "postgis://$user:$password@$host:$port/$dbname"
	done
done

end=`date +%s`

runtime=$((end-start))
echo "$runtime"
