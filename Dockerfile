FROM python:3.12-slim
WORKDIR /website
EXPOSE 80
RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && echo 'Asia/Shanghai' > /etc/timezone

COPY . .
RUN pip install --no-cache-dir --break-system-packages -r ./requirements.txt


# RUN chmod +x ./start.sh
CMD "python3" "app.py"