# cumtbGradeInquireWebsite

## TODO

- [ ] 美化页面
- [x] 将密码页面和成绩明细页面分离
- [ ] 增加公告
- [ ] 统计访问数
- [ ] 增加学期选择功能
- [ ] 增加移动端页面适配性
- [ ] Android和iOS前端应用
- [ ] 增加文字提示，告知不要在加载界面刷新

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

见文件