<template>
    <div class="upload-layout">
        <el-row type="flex" justify="center">
            <div class="upload-box">
                <label v-if="imgurl === ''" class="upload">
                    <div class="text">选择图片</div>
                    <i class="el-icon-plus"></i>
                    <input @change="handleChangeFile" type="file">
                </label>
                <div v-else @click.self="dialogVisible = true" class="img-box">
                    <i @click="imgurl = ''" class="el-icon-circle-close"></i>
                    <img :src="imgurl" alt="">
                </div>
            </div>

        </el-row>

        <el-row type="flex" justify="center" style="margin-top: 15px;">
            <el-button :disabled="imgurl === ''" @click="save" type="primary">保存</el-button>
        </el-row>
        <el-row type="flex" justify="center" style="margin-top: 15px;">
            <el-button @click="$router.back()" type="primary">回首页</el-button>
        </el-row>

        <el-dialog
            :visible.sync="dialogVisible"
            width="35%"
            :before-close="() => { this.dialogVisible = false; }">
            <img :src="imgurl" style="width: 100%;" alt="">
        </el-dialog>
    </div>
</template>

<script>
import * as qiniu from 'qiniu-js'
import { getQiNiuUploadToken, saveImage } from '@/api/upload'
export default {
    data(){
        return {
            token: '',
            file: null,
            imgurl: '',
            dialogVisible: false,
        }
    },
    created(){
        this.getQiNiuUploadToken()
    },
    methods:{
        getQiNiuUploadToken(){
            getQiNiuUploadToken().then( res => {
                this.token = res;
            })
        },
        handleChangeFile(e){
            if(!e.target.value) return;
            let file = e.target.files[0];
            let fileType = file.type;
            function getFileUrl() {
                var url;
                if (navigator.userAgent.indexOf("MSIE")>=1) { // IE
                    url = e.target.value;
                } else if(navigator.userAgent.indexOf("Firefox")>0) { // Firefox
                    url = window.URL.createObjectURL(file);
                } else if(/Chrome|iPhone|Mac|Safari|AppleWebKit/gi.test(navigator.userAgent)) { // Chrome
                    url = window.URL.createObjectURL(file);
                }
                url = window.URL.createObjectURL(file);
                return url;
            }
            if(/^(image\/)(jpeg|png)$/gi.test(fileType)){
                this.file = file;
                this.imgurl = getFileUrl()
            }else{
                this.$message.error('请上传jpg或者png文件！')
            }
        },
        save(){
            const observable = qiniu.upload(this.file, this.file.name, this.token)
            const subscription = observable.subscribe(
                res => {
                    console.log('next', res)
                }, 
                err => {
                    this.imgurl = '';
                    this.file = null;
                }, 
                res => {
                    saveImage({
                        url: res.key
                    }).then( res => {
                        this.$message.success('保存成功')
                    }).finally(() => {
                        this.imgurl = '';
                        this.file = null;
                    })
                }
            )
        }
    }
}
</script>

<style lang="less" scoped>
.upload-layout{
    padding: 15px;
}
.upload-box{
    width: 148px;
    height: 148px;
    .upload{
        display: block;
        background-color: #fbfdff;
        border: 1px dashed #c0ccda;
        border-radius: 6px;
        box-sizing: border-box;
        width: 148px;
        height: 148px;
        cursor: pointer;
        line-height: 146px;
        vertical-align: top;
        text-align: center;
        .text{
            height: 24px;
            font-size: 13px;
            margin-bottom: 10px;
            margin-top: -10px;
            color: #999;
        }
        &:hover{
            border-color: #409eff;
            color: #409eff;
        }
        i{
            font-size: 24px;
            color: #999;
        }
        input{
            display: none;
        }
    }
    .img-box{
        width: 100%;
        height: 100%;
        overflow: hidden;
        text-align: center;
        border-radius: 6px;
        position: relative;
        &:hover{
            cursor: pointer;
        }
        >i{
            position: absolute;
            top: 5px;
            right: 5px;
            color:#F56C6C;
            z-index: 10;
            font-size: 24px;
        }
        >img{
            height: 100%;
            display: inline-block;
            vertical-align: middle;
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            z-index: 8;
        }
        &:after{
            content: '';
            display: block;
            background: rgba(0,0,0,0.05);
            width: 100%;
            height: 100%;
            z-index: 9;
            position: absolute;
            top: 0;
            left: 0;
        }
    }
}
</style>
<style style="less">
.el-dialog{
    margin-top: 5vh !important;
}
 @media screen and (max-width: 980px) {
    .el-dialog{
        width: 95% !important;
    }
    .el-dialog{
        margin-top: 4vh !important;
    }
}
</style>