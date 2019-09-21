# vue-upImg

v-0.1.0：最初版

v-1.0.0：样式更新



## 功能

这是一个用于PC端的相册上传的vue组件

---

余发现大部分UI框架，在多图片上传和预览的时候

选中的时候就已经发给后台了

而在预览的时候是请求后台返回渲染

但是本组件它可以在预览之后再选择修改已经选中的图片

拖拽多个文件和input选择单个文件实现选中和预览。

右上角的红色小×号可以取消选中。

如果是非图片文件，会被筛选，同时限制图片上传个数。

同时可以查看已经被选择的图片的总大小。

axios的方式提交formdata。



## 依赖

```json
"axios": "^0.19.0",
"vue": "^2.5.2",
```
采用cdn外链引入到upImg.html文件中

新版本中也会增加可供参考的.vue文件



## 预览

![效果图](https://raw.githubusercontent.com/nanarino/vue-upImg/master/img/exp.jpg)

![效果图](https://raw.githubusercontent.com/nanarino/vue-upImg/master/img/exp2.jpg)

当前效果图为v-0.1.0版本效果图，在后续的版本中css效果有所不同



## 后台对接示例

### 前端请求的参数描述

在`upImg.html`文件中，点击上传的参数如下

| 参数名 | title            | length                   | file0                    | file1                    | ...  | file9                    |
| ------ | ---------------- | ------------------------ | ------------------------ | ------------------------ | ---- | ------------------------ |
| 类型   | 字符串           | 数字                     | File对象                 | File对象                 | ...  | File对象                 |
| 描述   | 相册标题         | 将上传的图片张数         | 将上传的图片的二进制数据 | 将上传的图片的二进制数据 | ...  | 将上传的图片的二进制数据 |
| 限制   | 由数据库字段决定 | ∈[1，9]，可在$data中修改 | 由数据库字段决定         | 由数据库字段决定         | ...  | 由数据库字段决定         |

### 后端响应并持久化示例

只是简单的示例，并没有做其他复杂的类型校验和大小格式限制。

```python
#数据库字段（django ORM models）
class Album(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(null=False,max_length=14,default="无题") 
    imgurl = models.TextField(max_length=64)
    imglen = models.CharField(max_length=2)
    time = models.DateTimeField(auto_now_add=True,null=True)
    #关联用户表的外键 models.ForeignKey(to="用户表",null=True) 暂无需求


#上传相册接口（django REST framework）
class Add_album(APIView):
    def post(self,request):
        title = request.data.get("title",'')
        length = request.data.get("length",'')
        if request.FILES.get("file0") is None:
            return Response({"msg": '上传失败 无文件'})
        if int(length)<1 or int(length)>9:
            return Response({"msg": '上传失败 文件个数不匹配'})
        try:
            imgurl_list=[]
            for i in range(int(length)):
                file_obj = request.FILES.get('file'+str(i))
                #给图片拼接静态目录路径，并去掉图片文件名中可能含有的百分号。
                imgurl = os.path.join('static','img', str(int(time.time()+i)) + file_obj.name.replace("%",""))
                imgurl_list.append(imgurl)
                f = open(os.path.join(BASE_DIR, imgurl), 'wb')
                for chunk in file_obj.chunks():
                    f.write(chunk)
                f.close()
        except:
            return Response({"msg": '储存过程失败 可以反馈给程序猿'})#一个chunk：2.5M
        else:
            imgurl_list_json = json.dumps(imgurl_list)
            models.Album.objects.create(title=title, imgurl=imgurl_list_json,imglen=length, motif=motif)
            return Response({"msg": '相册上传成功'})
```





## 其他主要贡献者

qheyes（千鹤鵺，<https://github.com/qheyes>）。他仓库里的分支拓展了【上传的进度条】的功能。

