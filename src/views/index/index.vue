<template>
  <div class="home">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px" size="medium">
      <el-form-item label="标题" prop="title">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="简介" prop="introduction">
        <el-input v-model="form.introduction"></el-input>
      </el-form-item>
      <el-form-item label="作者" prop="author">
        <el-input v-model="form.author"></el-input>
      </el-form-item>
      <el-form-item label="是否隐藏" class="hidden">
        <el-switch v-model="form.hidden"></el-switch>
      </el-form-item>
      <el-form-item label="文章类型" class="hidden">
        <el-select v-model="form.type" placeholder="请选择">
          <el-option
            v-for="item in selectOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <mavon-editor ref="md" v-model="value" @imgAdd="imgAdd" @imgDel="imgDel" @save="editorSave" />
  </div>
</template>

<script>
// import Editor from 'wangeditor'
import { Test, Upload } from '@/api'
import axios from 'axios'
export default {
  data() {
    return {
        form:{
            title:'',
            introduction:'',
            author:'',
            hidden: false,
            type:''
        },
        rules: {
            title: [
                {required: true, message: '请输入文章标题', trigger: 'blur'}
            ],
            introduction: [
                {required: true, message: '请输入文章简介', trigger: 'blur'}
            ],
            author: [
                {required: true, message: '请输入文章作者', trigger: 'blur'}
            ],
            type: [
                {required: true, message: '请选择文章类型', trigger: 'blur'}
            ]
        },
        value:'',
        selectOptions:[],
        /**
         * @toolbars 菜单栏配置项
         */
        toolbars: {
            bold: true, // 粗体
            italic: true, // 斜体
            header: true, // 标题
            underline: true, // 下划线
            strikethrough: true, // 中划线
            mark: true, // 标记
            superscript: true, // 上角标
            subscript: true, // 下角标
            quote: true, // 引用
            ol: true, // 有序列表
            ul: true, // 无序列表
            link: true, // 链接
            imagelink: true, // 图片链接
            code: true, // code
            table: true, // 表格
            fullscreen: true, // 全屏编辑
            readmodel: true, // 沉浸式阅读
            htmlcode: true, // 展示html源码
            help: true, // 帮助
            /* 1.3.5 */
            undo: true, // 上一步
            redo: true, // 下一步
            trash: true, // 清空
            save: true, // 保存（触发events中的save事件）
            /* 1.4.2 */
            navigation: true, // 导航目录
            /* 2.1.8 */
            alignleft: true, // 左对齐
            aligncenter: true, // 居中
            alignright: true, // 右对齐
            /* 2.2.1 */
            subfield: true, // 单双栏模式
            preview: true, // 预览
        }
    }
  },
  computed:{
    userInfo(){
      return this.$store.getters.userInfo
    }
  },
  created() {
    this.findArticleType()
    this.form.author = this.userInfo.nikeName
  },
  mounted() {
    
  },
  methods: {
    imgAdd(pos, file){
        console.log('pos, file: ', pos, file)
        // 第一步.将图片上传到服务器.
        var formdata = new FormData()
        formdata.append('file', file)
        Upload.upload(formdata).then(({code,filepath}) => {
        //     第二步.将返回的url替换到文本原位置![...](0) -> ![...](url)
            /**
           * $vm 指为mavonEditor实例，可以通过如下两种方式获取
           * 1. 通过引入对象获取: `import {mavonEditor} from ...` 等方式引入后，`$vm`为`mavonEditor`
           * 2. 通过$refs获取: html声明ref : `<mavon-editor ref=md ></mavon-editor>，`$vm`为 `this.$refs.md`
           */
          console.log('this.$refs.md: ', this.$refs.md)
            this.$refs.md.$img2Url(pos, filepath)
        })
    },
    imgDel(){

    },
    editorSave(value,render){
        this.$refs['form'].validate((valid) => {
          if (valid) {
            let params = {
              user_id : this.userInfo._id,
              title: this.form.title,
              author: this.form.author,
              type: this.form.type,
              introduction: this.form.introduction,
              comments: {
                  commentStr: value,
                  commentHtml: render
              }
            }
            Test.CreateArticle(params).then(({code,message}) => {
                if(code == 2000){
                  this.form.title = ''
                  this.form.introduction = ''
                  this.value = ''
                  return this.$message({message:message,type:'success',duration:2000})
                }else{
                  return this.$message({message:message,type:'warning',duration:2000})
                }
            }).catch(err => {
              console.log('err: ', err)
            })
          } else {
            return this.$message({message:'请填写必填项',type:'warning',duration:2000})
          }
        })
    },
    /**
     * 查找文章类型
     */
    findArticleType(){
      Test.FindArticleType().then(({code,data,message}) => {
        if(code == 2000){
          this.selectOptions = data
          this.form.type = data[0].value
        }else{
          return this.$message({message:message,type:'warning',duration:2000})
        }
      }).catch(err =>{
        console.error(err)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.home{
    margin: 16px;
    .el-form{
        width: 540px;
        .hidden{
          /deep/.el-form-item__content{
            display: table-row;
          }
        }
    }
    .markdown-body{
        max-width: 100%;
        min-height: 80vh;
        border: 1px solid #eee;
        border-radius: 20px;
    }
}
</style>
