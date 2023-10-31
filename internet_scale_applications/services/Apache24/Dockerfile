FROM httpd:2.4.57

RUN apt-get update \
    && apt-get upgrade -y \
    && apt-get clean

ENV APACHE_CONFDIR /usr/local/apache2/conf

COPY ./conf/httpd.conf ${APACHE_CONFDIR}/httpd.conf
COPY ./conf/docker-config.conf ${APACHE_CONFDIR}/docker-config.conf
COPY ./conf/extra/proxy-html.conf ${APACHE_CONFDIR}/extra/proxy-html.conf

COPY ./htdocs/. /usr/local/apache2/htdocs

EXPOSE 80

CMD ["httpd", "-D", "FOREGROUND", "-f", "conf/docker-config.conf"]