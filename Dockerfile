FROM debian:latest
WORKDIR /website
EXPOSE 80
RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && echo 'Asia/Shanghai' > /etc/timezone
RUN apt update

# install nginx python
# RUN apt -y -q install nginx
RUN apt -y -q install python3 pip
COPY . .
# COPY ./nginx.conf /etc/nginx/nginx.conf
RUN pip install --break-system-packages -r ./requirements.txt

RUN apt clean


# RUN chmod +x ./start.sh
CMD "python3" "app.py"