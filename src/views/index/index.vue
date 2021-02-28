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
    </el-form>
    <mavon-editor v-model="value" @imgAdd="imgAdd" @imgDel="imgDel" @save="editorSave" />
  </div>
</template>

<script>
// import Editor from 'wangeditor'
import { Test } from '@/api'
export default {
  data() {
    return {
        form:{
            title:'',
            introduction:'',
            author:'壹朵小花吖',
            hidden: false
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
            ]
        },
        value:'',
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
  mounted() {
      console.log('Test: ', Test.CreateArticle)
  },
  methods: {
    imgAdd(pos, file){
        console.log('pos, file: ', pos, file)
        // 第一步.将图片上传到服务器.
        // var formdata = new FormData()
        // formdata.append('image', $file)
        // axios({
        //     url: 'server url',
        //     method: 'post',
        //     data: formdata,
        //     headers: { 'Content-Type': 'multipart/form-data' },
        // }).then((url) => {
        //     第二步.将返回的url替换到文本原位置![...](0) -> ![...](url)
        //     /**
        //    * $vm 指为mavonEditor实例，可以通过如下两种方式获取
        //    * 1. 通过引入对象获取: `import {mavonEditor} from ...` 等方式引入后，`$vm`为`mavonEditor`
        //    * 2. 通过$refs获取: html声明ref : `<mavon-editor ref=md ></mavon-editor>，`$vm`为 `this.$refs.md`
        //    */
        //     $vm.$img2Url(pos, url);
        // })
    },
    imgDel(){

    },
    editorSave(value,render){
        this.$refs['form'].validate((valid) => {
          if (valid) {
            let params = {
              title: this.form.title,
              author: this.form.author,
              introduction: this.form.introduction,
              comments: {
                  commentStr: value,
                  commentHtml: render
              }
            }
            Test.CreateArticle(params).then(res => {
                console.log('res: ', res)
            }).catch(err => {
              console.log('err: ', err)
            })
          } else {
            return this.$message({message:'请填写必填项',type:'warning',duration:2000})
          }
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
