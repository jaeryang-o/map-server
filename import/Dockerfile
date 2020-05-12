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
RUN mkdir /home/osmdata/scripts
RUN mkdir /home/osmdata/pbf
COPY scripts /home/osmdata/scripts
COPY sql /home/osmdata/sql
COPY ./mapping.yml /home/osmdata
COPY data /home/osmdata/data

# download imposm3
RUN wget https://github.com/omniscale/imposm3/releases/download/v0.10.0/imposm-0.10.0-linux-x86-64.tar.gz -P /home/osmdata &&\
    tar -xf /home/osmdata/imposm-0.10.0-linux-x86-64.tar.gz &&\
    cp -R /home/osmdata/imposm-0.10.0-linux-x86-64/* /home/osmdata/ &&\
    rm -R /home/osmdata/imposm-0.10.0-linux-x86-64

# Add VOLUMEs to allow backup of config, logs and databases
VOLUME  ["/etc/postgresql", "/var/log/postgresql", "/var/lib/postgresql", "/home/osmdata/pbf"]

ENTRYPOINT ["/home/osmdata/scripts/entry.sh"]
