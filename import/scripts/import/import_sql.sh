#!/bin/bash

set -e

start=`date +%s`

if find "/home/osmdata/sql" -mindepth 1 -print -quit 2>/dev/null | grep -q .; then
    for f in /home/osmdata/sql/*; do
    case "$f" in
        *.sql)    echo "$0: running $f"; psql -h $host -p $port -d osmdata -U $user -f ${f} || true ;;
        *.sql.gz) echo "$0: running $f"; gunzip < "$f" | psql -h $host -p $port -d osmdata -U $user || true ;;
        *)        echo "$0: ignoring $f" ;;
    esac
    echo
    done
fi

end=`date +%s`

runtime=$((end-start))
echo "$runtime"
