# vue-upImg
这是一个用于PC端的相册上传的vue组件

---

我发现大部分UI框架在多图片上传和预览的时候

选中的时候就已经发给后台了

而在预览的时候是请求后台返回渲染

---

但是本组件它可以在预览之后再选择修改已经选中的图片

---



## 功能实现

拖拽多个文件和input选择单个文件实现选中和预览。

右上角的红色小×号可以取消选中。

如果是非图片文件，会被筛选，同时限制图片上传个数。

同时可以查看已经被选择的图片的总大小。

axios的方式提交formdata。



## 版本参考

```json
"axios": "^0.19.0",
"vue": "^2.5.2",
```
采用cdn外链引入到upImg.html文件中

新版本中也会增加可供参考的.vue文件



## 预览效果

![效果图](https://raw.githubusercontent.com/nanarino/vue-upImg/master/img/exp.jpg)

![效果图](https://raw.githubusercontent.com/nanarino/vue-upImg/master/img/exp2.jpg)

在后续的版本中可能改变css效果



## 后台对接示例

```python
#上传相册接口（django rest framework）
class Add_album(APIView):
    def post(self,request):
        title = request.data.get("title",'')
        motif = request.data.get("motif",'').strip()
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
                imgurl = os.path.join('static', 'picture','img', str(int(time.time()+i))+file_obj.name.replace("%",""))
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
            return Response({"msg": '发表成功'})
```



##### 其他主要贡献者

qheyes（千鹤鵺，<https://github.com/qheyes>）