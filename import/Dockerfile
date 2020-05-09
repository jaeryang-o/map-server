FROM ubuntu:18.04

ARG POSTGRES_HOST
ARG POSTGRES_USER
ARG POSTGRES_PASS
ARG POSTGRES_DBNAME

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
COPY ./mapping.yml /home/osmdata
COPY data /home/osmdata/data
RUN ["chmod", "+x", "/home/osmdata/scrips/import_osm.sh"]

ADD https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh /home/osmdata
RUN ["chmod", "+x", "/home/osmdata/wait-for-it.sh"]

# download imposm3
RUN wget https://github.com/omniscale/imposm3/releases/download/v0.10.0/imposm-0.10.0-linux-x86-64.tar.gz -P /home/osmdata &&\
    tar -xf /home/osmdata/imposm-0.10.0-linux-x86-64.tar.gz &&\
    cp -R /home/osmdata/imposm-0.10.0-linux-x86-64/* /home/osmdata/ &&\
    rm -R /home/osmdata/imposm-0.10.0-linux-x86-64

RUN /home/osmdata/wait-for-it.sh ${POSTGRES_HOST}:5432 -t 10 -- /home/osmdata/scrips/import_osm.sh
