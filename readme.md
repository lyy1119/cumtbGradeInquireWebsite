# cumtbGradeInquireWebsite

## 使用

### 依赖

本网站依赖[cumtb_token_api](https://github.com/lyy1119/cumtb_token_api)这个程序提供api。   

依赖的配置在`app.py`的`tokenApiUrl`变量。  

### 构建docker image

```shell
make
```

### 部署

可以直接使用python运行`app.py`运行这个网页。  

建议使用docker同时部署cumtb_token_api和本项目并设置在同一网络内。  

### docker-compose.yml

```yml
services:
  cumtb_api:
    image: cumtb_api:latest   # 替换为提供API服务的容器镜像
    container_name: cumtb_api
    restart: unless-stopped
    ports:
      - 5000:5000 # 如果需要暴露给宿主机
    networks:
      - cumtb_network

  cumtb_grade_inquire:
    image: cumtb_grade_inquire:latest
    container_name: cumtb_grade_inquire
    restart: unless-stopped
    ports:
      - 8081:80 # <外部端口>:<内部端口>
    depends_on:
      - cumtb_api
    networks:
      - cumtb_network

networks:
  cumtb_network:
    driver: bridge
```