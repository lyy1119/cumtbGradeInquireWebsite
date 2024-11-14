def sort_dict(data):
    # 对字典的键按照自定义规则进行排序
    sorted_keys = sorted(data.keys(), key=lambda x: (
        int(x.split('-')[1]),  # 年份2，降序
        int(x.split('-')[0]),  # 年份1，降序
        int(x.split('-')[2])   # 尾数，降序
    ), reverse=True)
    
    # 按照排序后的键构建新的有序字典
    sorted_dict = {key: data[key] for key in sorted_keys}
    return sorted_dict

