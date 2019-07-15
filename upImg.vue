<template>
  <div class="upLoad">
    <div class="allbtn">
      <div class="show-btn" @click="showBox">点击上传</div>
      <div class="photos-btn" @click="alerts">查看相册</div>
    </div>
    <div class="upWin" v-show="isShow">
      <h1>{{this.wintitle}}
        <i class="iconfont icon-guanbi off-btn" @click="hideBox"></i>
      </h1>
      <div class="title">
        <div class="boxname">
          <span>创建相册：</span>
          <input type="text" placeholder="输入相册名"  v-model="title" />
        </div>
        <div class="shuju">
          <span>当前张数：{{this.imgList.length}} / {{this.maxNumber}} 张</span>
          <span>当前大小：{{this.bySize}}</span>
        </div>
        <div class="btn" @click="postData">
          <i class="iconfont icon-ic_image_upload"></i>
          点击上传
        </div>
      </div>
      <div 
        class="photobox"
        @drop="drop($event)"
        @dragenter="dragenter($event)"
        @dragover="dragover($event)"
      >
        <div 
          class="photo-item" 
          v-show="imgList.length > 0"
          v-for="(item, index) in imgList"
          :key="index"
        >
          <div class="pic-del">
            <i class="iconfont icon-shanchu del" @click="delImg(index)"></i>
          </div>
          <div class="pic-img">
            <img :src="item.file.src" alt="">
          </div>
          <div class="pic-name">{{item.file.name}}</div>
        </div>
        <div class="photo-item-btn">
          <input
            type="file"
            name="upimg"
            accept="image/*"
            class="fileimg"
            ref="updateimg"
            @change="updateImg($event)"
          />
          <i class="iconfont icon-tianjia"></i>
          <span>点击添加或拖拽图片</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    template: 'upImg',
    data(){
      return {
        //默认状态
        isShow: false,
        //组件标题
        wintitle: '图片上传组件v2.1.0',
        //相册标题
        title: '',
        //上传数量上限
        maxNumber: 9,
        //上传文件列表
        imgList: [],
        //格式过滤列表
        filterList: ["image/gif","image/jpeg","image/png","image/x-icon"],
        //文件总大小
        size: 0        
      }
    },
    methods: {
      showBox(){
        this.isShow = true;
      },
      hideBox(){
        this.isShow = false;
      },
      alerts(){
        alert("这将是一个相册浏览组件！！敬请期待")
      },
      //拖拽三连
      dragenter(el){
        el.stopPropagation();
        el.preventDefault();
      },
      dragover(el){
        el.stopPropagation();
        el.preventDefault();
      },
      drop(el){
        el.stopPropagation();
        el.preventDefault();  
        if(this.imgList.length + el.dataTransfer.files.length > this.maxNumber){      
          alert("已经超出张数！！！")
          return;
        }else{                
          this.filesList(el.dataTransfer.files);
        }      
      },
      //遍历图片列表
      filesList(files){
        [...files].filter((v)=>this.filterList.indexOf(v.type)!==-1).forEach((v)=>this.fileAdd(v))
      },
      //添加到渲染列表
      fileAdd(file){
        this.size += file.size;//总大小
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = ()=>{
          file.src = reader.result;
          this.imgList.push({file});
        }
      },
      //单文件上传
      updateImg(el){
        if (!el.target.files[0].size) return;
        if(this.imgList.length >= this.maxNumber){
          alert("已经超出张数！！！")    
          return;
        }else{
          this.filesList(el.target.files);
        }     
      },
      //删除图片
      delImg(index){
        this.size -= this.imgList[index].file.size;//总大小
        this.imgList.splice(index, 1);
      },
      postData(){
        if(!this.title.trim()){
          alert("当前标题为空请输入标题！")
          return;
        }
        if(this.imgList.length < 1){
          alert("请至少选择一张图片上传")
          return;
        }
        var formData = new FormData();  
        this.imgList.forEach((value, index) => {
          formData.append("file" + index, value.file);
        });
        formData.append("length", this.imgList.length);
        formData.append("title", this.title);     
        this.$axios.post("http://127.0.0.1:8000/addAlbum/",formData,{
          headers:{'Content-Type':'multipart/form-data'}
        }).then(res => {
          alert(res.data.msg)
        })
      } 
    },
    computed: {
      //计算大小
      bySize(){
        if (this.size === 0) return '0 B';
        let k = 1024, 
            sizes = ['B', 'KB', 'MB', 'GB'],
            i = Math.floor(Math.log(this.size ) / Math.log(k));
        return (this.size  / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
      }
    }
  }
</script>

<style scoped>
.upLoad{
  position: relative;
}
.allbtn{
  padding: 20px;
  display: flex;
}
.show-btn{
  margin-right: 10px;
  padding: 10px;
  background-color: #5caae6;
  cursor: pointer;
}
.photos-btn{
  padding: 10px;
  background-color: #5caae6;
  cursor: pointer;
}
.upimg{
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  overflow: hidden;
  width: 1200px;
  min-height: 500px;
  height: 700px;
  font-size: 12px;
  border-radius: 5px;
  box-shadow: 0 0 5px #535658;
}
h1{
  padding: 10px;
  text-align: center;
  color: #666;
  font-size: 16px;
  background-color: #F3F3F3;
}
h1 .off-btn{
  float: right;
  font-size: 20px;
  cursor: pointer;
}
.title{
  padding:20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
  font-size: 16px;
  color: #666;
}
.title .boxname{
  width: 550px;
  height: 30px;
}
.title .boxname input{
  width: 80%;
  height: 100%;
  outline: none;
  border: 1px solid #eee;
  text-indent: 20px;
}
.title .shuju{
  flex: 1;
}
.title .shuju span{
  margin-right: 20px;
}
.title .btn{
  padding: 10px 20px;
  height: 20px;
  color: #fff;
  background-color: #5caae6;
  border-radius: 5px;
  cursor: pointer;
}
.title .btn:hover{
  background-color: #4798d6;
}
.photobox{
  overflow: hidden;
  padding: 30px 15px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
.photo-item{
  position: relative;
  float: left;
  margin: 0 15px 10px;
  width: 198px;
  height: 198px;
  text-align: center;
  border: 1px solid #e1e1e1;
}
.photo-item:hover .pic-del{
  display: block;
}
.photo-item .pic-del{
  display: none;
  position: absolute;
  bottom: 40px;
  left: 0;
  padding-right: 6px;
  width: 100%;
  height: 30px;
  background-color: rgba(0, 0, 0, .3);
  box-sizing: border-box;
}
.photo-item .pic-del .del{
  float: right;
  color: #fff;
  font-size: 26px;
  cursor: pointer;
}
.photo-item .pic-img{
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 158px;
}
.photo-item .pic-img img{
  max-width: 100%;
  max-height: 100%;
  vertical-align: middle;
}
.photo-item .pic-name{
  padding: 0 5px;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
  width: 100%;
  height: 40px;
  line-height: 40px;
  color: #666;
  background-color: #eee;
  box-sizing: border-box;
}
.photo-item-btn{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  float: left;
  margin: 0 15px 10px;
  width: 198px;
  height: 198px;
  border: 1px dashed #e1e1e1;
  border-radius: 6px;
  font-size: 16px;
  color: #ccc;
}
.photo-item-btn i{
  font-size: 40px;
  margin-bottom: 20px;
}
.photo-item-btn .fileimg{
  position: absolute;
  top: 0;
  left: 0;
  width: 198px;
  height: 198px;
  opacity: 0;
  cursor: pointer;
}
</style>
