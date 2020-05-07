ARG POSTGRES_USER
ARG POSTGRES_PASS
ARG POSTGRES_DBNAME
ARG ALLOW_IP_RANGE

FROM ubuntu:18.04


# getting postgres
RUN apt-get update && apt-get -y install wget gnupg2
RUN wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add -

# Add PostgreSQL's repository. It contains the most recent stable release
#     of PostgreSQL, ``12``.
RUN echo "deb http://apt.postgresql.org/pub/repos/apt/ bionic-pgdg main" > /etc/apt/sources.list.d/pgdg.list

# Install software-properties-common and PostgreSQL 12
#  and some other packages for ftp
RUN apt-get update
RUN DEBIAN_FRONTEND=noninteractive apt-get install -y \
  software-properties-common \
  postgresql-12 \
  postgresql-client-12 \
  postgresql-contrib-12 \
  postgresql-12-postgis-3 \
  postgresql-12-postgis-3-scripts \
  aptitude  \
  unzip \
  openssh-client \
  openssh-server \
  sshpass \
  && aptitude update \
  && aptitude install -y nano axel wput screen p7zip-full osmium-tool \
  vnstat gdal-bin

WORKDIR /home/osmdata
RUN mkdir /home/osmdata/scrips
RUN mkdir /home/osmdata/pbf
COPY scripts/import_osm.sh /home/osmdata/scrips
COPY ./mapping.yml /home/osmdata/pbf
RUN ["chmod", "+x", "/home/osmdata/scrips/import_osm.sh"]

ADD https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh /home/osmdata
RUN ["chmod", "+x", "/home/osmdata/wait-for-it.sh"]

# download imposm3
RUN wget https://github.com/omniscale/imposm3/releases/download/v0.10.0/imposm-0.10.0-linux-x86-64.tar.gz -P /home/osmdata &&\
    tar -xf /home/osmdata/imposm-0.10.0-linux-x86-64.tar.gz &&\
    cp -R /home/osmdata/imposm-0.10.0-linux-x86-64/* /home/osmdata/ &&\
    rm -R /home/osmdata/imposm-0.10.0-linux-x86-64

# Getting data and pushing to the database
RUN axel -n 3 -a -v https://download.geofabrik.de/asia/south-korea-latest.osm.pbf &&\
    osmium tags-filter south-korea-latest.osm.pbf nwr/aerialway -o pbf/south-korea-latest_aerialway.osm.pbf &&\
    osmium tags-filter south-korea-latest.osm.pbf nwr/aeroway -o pbf/south-korea-latest_aeroway.osm.pbf &&\
    osmium tags-filter south-korea-latest.osm.pbf nwr/amenity -o pbf/south-korea-latest_amenity.osm.pbf &&\
    osmium tags-filter south-korea-latest.osm.pbf nwr/barrier -o pbf/south-korea-latest_barrier.osm.pbf &&\
    osmium tags-filter south-korea-latest.osm.pbf nwr/boundary -o pbf/south-korea-latest_boundary.osm.pbf &&\
    osmium tags-filter south-korea-latest.osm.pbf nwr/building -o pbf/south-korea-latest_building.osm.pbf &&\
    osmium tags-filter south-korea-latest.osm.pbf nwr/craft -o pbf/south-korea-latest_craft.osm.pbf &&\
    osmium tags-filter south-korea-latest.osm.pbf nwr/emergency -o pbf/south-korea-latest_emergency.osm.pbf &&\
    osmium tags-filter south-korea-latest.osm.pbf nwr/geological -o pbf/south-korea-latest_geological.osm.pbf &&\
    osmium tags-filter south-korea-latest.osm.pbf nwr/highway -o pbf/south-korea-latest_highway.osm.pbf &&\
    osmium tags-filter south-korea-latest.osm.pbf nwr/historic -o pbf/south-korea-latest_historic.osm.pbf &&\
    osmium tags-filter south-korea-latest.osm.pbf nwr/leisure -o pbf/south-korea-latest_leisure.osm.pbf &&\
    osmium tags-filter south-korea-latest.osm.pbf nwr/landuse -o pbf/south-korea-latest_landuse.osm.pbf &&\
    osmium tags-filter south-korea-latest.osm.pbf nwr/man_made -o pbf/south-korea-latest_man_made.osm.pbf &&\
    osmium tags-filter south-korea-latest.osm.pbf nwr/military -o pbf/south-korea-latest_military.osm.pbf &&\
    osmium tags-filter south-korea-latest.osm.pbf nwr/natural -o pbf/south-korea-latest_natural.osm.pbf &&\
    osmium tags-filter south-korea-latest.osm.pbf nwr/office -o pbf/south-korea-latest_office.osm.pbf &&\
    osmium tags-filter south-korea-latest.osm.pbf nwr/place -o pbf/south-korea-latest_place.osm.pbf &&\
    osmium tags-filter south-korea-latest.osm.pbf nwr/power -o pbf/south-korea-latest_power.osm.pbf &&\
    osmium tags-filter south-korea-latest.osm.pbf nwr/public_transport -o pbf/south-korea-latest_public_transport.osm.pbf &&\
    osmium tags-filter south-korea-latest.osm.pbf nwr/railway -o pbf/south-korea-latest_railway.osm.pbf &&\
    osmium tags-filter south-korea-latest.osm.pbf nwr/route -o pbf/south-korea-latest_route.osm.pbf &&\
    osmium tags-filter south-korea-latest.osm.pbf nwr/shop -o pbf/south-korea-latest_shop.osm.pbf &&\
    osmium tags-filter south-korea-latest.osm.pbf nwr/sport -o pbf/south-korea-latest_sport.osm.pbf &&\
    osmium tags-filter south-korea-latest.osm.pbf nwr/telecom -o pbf/south-korea-latest_telecom.osm.pbf &&\
    osmium tags-filter south-korea-latest.osm.pbf nwr/tourism -o pbf/south-korea-latest_tourism.osm.pbf &&\
    osmium tags-filter south-korea-latest.osm.pbf nwr/waterway -o pbf/south-korea-latest_waterway.osm.pbf &&\
    osmium tags-filter south-korea-latest.osm.pbf nwr/addr:* -o pbf/south-korea-latest_addr.osm.pbf &&\
    osmium tags-filter south-korea-latest.osm.pbf nwr/water -o pbf/south-korea-latest_water.osm.pbf

# Add VOLUMEs to allow backup of config, logs and databases
VOLUME ["/home/osmdata/pbf"]

#RUN /home/osmdata/wait-for-it.sh db:5432 -t 10 -- /home/osmdata/scrips/import_osm.sh