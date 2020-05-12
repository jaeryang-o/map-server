#!/bin/bash

set -e

start=`date +%s`

export host=${POSTGRES_HOST}
export port=5432
export user=${POSTGRES_USER}
export password=${POSTGRES_PASS}
export PGPASSWORD=${POSTGRES_PASS}
export dbname=${POSTGRES_DBNAME}

echo "postgis://$user:$password@$host:$port/$dbname"

if find "/home/osmdata/scripts/import" -mindepth 1 -print -quit 2>/dev/null | grep -q .; then
    for f in /home/osmdata/scripts/import/*; do
    case "$f" in
        *.sh)     echo "$0: running $f"; . $f || true;;
        *)        echo "$0: ignoring $f" ;;
    esac
    echo
    done
fi

end=`date +%s`

runtime=$((end-start))
echo "$runtime"
