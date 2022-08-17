FROM tarscloud/base-compiler as First


RUN mkdir -p /data
COPY . /data
RUN cd /data \
    && npm install \
    && npm run build \
    && cp package.json build/ \
    && cd build \
    && npm install --production \
    && rm -rf package.json \
    && cd .. \
    && rm -rf src node_modules 
#     && mkdir -p tars_nodejs \
#     && npm install @tars/node-agent -g \
#     && mv /usr/local/lib/node_modules/@tars/node-agent tars_nodejs/

FROM tarscloud/tars.nodejsbase

ENV ServerType=nodejs

RUN mkdir -p /usr/local/server/bin/
COPY --from=First /data/ /usr/local/server/bin/
