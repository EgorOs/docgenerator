FROM python:3.7

COPY package.json /server/package.json
COPY Pipfile /server/Pipfile
COPY Pipfile.lock /server/Pipfile.lock
COPY server.js /server/server.js

WORKDIR /server

ENV PYTHONPATH="${PYTHONPATH}:/docgenerator"

COPY . /server

ENV PATH /server/node_modules/.bin:$PATH


RUN echo "deb https://deb.nodesource.com/node_12.x buster main" > /etc/apt/sources.list.d/nodesource.list \
    && apt-get install wget -yqq \
    && wget -qO- https://deb.nodesource.com/gpgkey/nodesource.gpg.key | apt-key add - \
    && echo "deb https://dl.yarnpkg.com/debian/ stable main" > /etc/apt/sources.list.d/yarn.list \
    && wget -qO- https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - \
    && apt-get update -yqq \
    && apt-get install -yqq nodejs yarn \
    && npm i -g npm@^6 \
    && rm -rf /var/lib/apt/lists/*

RUN pip install pipenv \
    && pipenv install --ignore-pipfile --system --dev

ENTRYPOINT ["nodejs"]

CMD ["server.js"]
