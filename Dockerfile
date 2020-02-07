FROM node

RUN npm install -g @angular/cli

COPY app /home/app

COPY entrypoint.sh /

RUN chmod +x entrypoint.sh

ENTRYPOINT "./entrypoint.sh"