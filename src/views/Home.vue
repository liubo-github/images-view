<template>
    <div class="layout" v-loading="loading">
        <div
            v-if="containerWidth"
            class="image-box" 
            ref="imagebox"
            :style="{
                width:`${typeof containerWidth === 'string' ? containerWidth : containerWidth + 'px'}`,
                height: containerHeight + 'px'
            }">
            <template v-for="(item, index) in imageList">
                <div 
                    class="image-item"
                    :style="`width:${itemWidth}px;`"
                    :key="index">
                    <div class="content">
                        <img :src="item.url" :data-original="item.url" alt="">
                    </div>
                </div>
            </template>
        </div>

        <!-- <el-row type="flex" justify="center" style="margin-bottom: 15px;">
            <router-link :to="'/upload'">
                <el-button type="primary">去上传</el-button>
            </router-link>
        </el-row> -->

        <el-dialog
            :visible.sync="dialogVisible"
            width="35%"
            :before-close="() => { this.dialogVisible = false; this.detailImgUrl = '' }">
            <div class="detail-img" v-if="detailImgUrl">
                <img :src="detailImgUrl" alt="">
                <a :href="detailImgUrl" target="_blank">
                    <el-button style="width: 100%;margin-top: 5px;" type="primary">下载</el-button>
                </a>
            </div>
        </el-dialog>
	</div>
</template>

<script>
import Viewer from 'viewerjs'
import 'viewerjs/dist/viewer.css'
import { getImageList } from '@/api/home'
import { throttle, getStyle } from '@/utils/index'
export default {
	name: "Home",
	data(){
		return {
            loading: false,
			apiParams: {
				page: 1,
				limit: 10,
			},
			imageList: [],
            total: 0,
            lastPage: 1,
            dialogVisible: false,
            detailImgUrl: '',

            containerWidth: 0,
            containerHeight: 500,
            itemWidth: 0,
            loadedItems: [],
            columnHeightArr: [],
            column: 0,
            spaceBetweenCols: 0,
            spaceBetweenUpAndDown: 0,
		}
	},
	created(){
        this.windowWidth = document.documentElement.offsetWidth;
        if(this.windowWidth > 1024){
            this.apiParams.limit = 20
        }else if(this.windowWidth > 768){
            this.apiParams.limit = 15
        }
        this.initWaterFallFlowConfig()
        this.getImageList()

        window.onresize = () => {
            this.windowWidth = document.documentElement.offsetWidth;
            this.loadedItems = [];
            this.columnHeightArr = [];
            this.initWaterFallFlowConfig()
            this.resetDrawWaterFallFlow()
        }

        window.onscroll = throttle((() => {
            let oldScrollTop = 0;
            let windowHeight = window.innerHeight;
            let scrollHeight = document.documentElement.scrollHeight;
            return () => {
                let newScrollTop = document.documentElement.scrollTop;
                if(newScrollTop + windowHeight + 150 >= scrollHeight && !this.loading && this.apiParams.page <= this.lastPage && newScrollTop > oldScrollTop + 75){
                    this.loading = true;
                    this.apiParams.page += 1;
                    this.getImageList()
                    oldScrollTop = newScrollTop;
                }
            }
        })(), 50)

        window.onload = () => {
            let windowHeight = window.innerHeight;
            let scrollHeight = document.documentElement.scrollHeight;
            if(scrollHeight <= windowHeight && this.lastPage > 1){
                this.apiParams.page += 1;
                this.getImageList()
            }
        }
    },
	methods: {
		getImageList(){
            this.loading = true;
			getImageList(this.apiParams).then( res => {
                if(res.data.page === 1){
                    this.total = res.data.total;
                    this.lastPage = res.data.last_page;
                }
                this.loading = false;
                this.imageList = [].concat(this.imageList, res.data.data)
                this.$forceUpdate();
                this.$nextTick(() => {
                    this.drawWaterFallFlow()
                })
			})
		},
		getNextPageData(){
			this.apiParams.page += 1;
			this.getImageList()
        },
        initWaterFallFlowConfig(){
            if(this.windowWidth < 768){
                this.column = 2;
                this.spaceBetweenCols = 5;
                this.spaceBetweenUpAndDown = 5
            }else if(this.windowWidth < 1024){
                this.column = 4;
                this.spaceBetweenCols = 8;
                this.spaceBetweenUpAndDown = 10;
            }else{
                this.column = 6;
                this.spaceBetweenCols = 10;
                this.spaceBetweenUpAndDown = 12;
            }
            let itemWidth = Math.floor(this.windowWidth / this.column);
            this.itemWidth = Math.floor(itemWidth - ((this.column - 1) * this.spaceBetweenCols) / this.column);
            this.containerWidth = this.itemWidth * this.column + ((this.column - 1) * this.spaceBetweenCols);
        },
        drawWaterFallFlow(){
            let allItems = this.$refs.imagebox.querySelectorAll('.image-item:not([data-add])');
            allItems.forEach(item => {
                item.style.display = 'none';
                item.style.width = this.itemWidth + 'px';
                let img = item.querySelector('img');
                img.onload = () => {
                    item.style.display = 'block';
                    this.loadedItems.push(item)
                    item.style.position = "absolute";
                    if(this.loadedItems.length <= this.column){
                        item.style.left = ((this.loadedItems.length - 1) * this.itemWidth) + ((this.loadedItems.length - 1) * this.spaceBetweenCols) + 'px';
                        item.style.top = '0px';
                        this.columnHeightArr.push(item.offsetHeight);
                    }else{
                        //找到最小高度的列
                        var minHeight = this.columnHeightArr[0];  /*最小高度 */
                        var minIndex = 0;                  /*最小高度的列的索引值*/
                        for(var j=0;j<this.columnHeightArr.length;j++){
                            if(minHeight>this.columnHeightArr[j]){
                                minHeight=this.columnHeightArr[j];								
                                minIndex=j;
                            }
                        }
                        item.style.left = this.loadedItems[minIndex].offsetLeft + 'px';
                        item.style.top = minHeight + this.spaceBetweenUpAndDown + 'px';
                        //每次循环完成以后改变最小高度列的高度
                        this.columnHeightArr[minIndex] += item.offsetHeight + this.spaceBetweenUpAndDown;
                    }

                    const viewer = new Viewer(this.$refs.imagebox, {
                        url: "data-original",
                        show: function(){
                            viewer.update();
                        }
                    });
                    item.setAttribute('data-add', 1);
                    this.containerHeight = Math.max(...this.columnHeightArr)
                }
            })
        },
        resetDrawWaterFallFlow(){
            let allItems = this.$refs.imagebox.querySelectorAll('.image-item');
            allItems.forEach(item => {
                item.style.width = this.itemWidth + 'px';
                let img = item.querySelector('img');
                this.loadedItems.push(item)
                item.style.position = "absolute";
                if(this.loadedItems.length <= this.column){
                    item.style.left = ((this.loadedItems.length - 1) * this.itemWidth) + ((this.loadedItems.length - 1) * this.spaceBetweenCols) + 'px';
                    item.style.top = '0px';
                    this.columnHeightArr.push(item.offsetHeight);
                }else{
                    //找到最小高度的列
                    var minHeight = this.columnHeightArr[0];  /*最小高度 */
                    var minIndex = 0;                  /*最小高度的列的索引值*/
                    for(var j=0;j<this.columnHeightArr.length;j++){
                        if(minHeight>this.columnHeightArr[j]){
                            minHeight=this.columnHeightArr[j];								
                            minIndex=j;
                        }
                    }
                    item.style.left = this.loadedItems[minIndex].offsetLeft + 'px';
                    item.style.top = minHeight + this.spaceBetweenUpAndDown + 'px';
                    //每次循环完成以后改变最小高度列的高度
                    this.columnHeightArr[minIndex] += item.offsetHeight + this.spaceBetweenUpAndDown;
                }
            })
            this.containerHeight = Math.max(...this.columnHeightArr)
        },
	},
};
</script>

<style lang="less" scoped>
.layout{
    .image-box{
        position: relative;
        margin: 0 auto;
        border: none;
        .image-item{
            background-color: #fff;
            box-shadow: 0 1px 3px rgba(0,0,0,.02), 0 4px 8px rgba(0,0,0,.02);
            border-radius: 3px;
            overflow: hidden;
            transition: transform .15s ease-in-out,box-shadow .15s ease-in-out;
            &:hover{
                box-shadow: 0 1px 3px rgba(0,0,0,.02), 0 16px 32px -4px rgba(0,0,0,.17);
                transform: translateY(-1px);
            }
            .content{
                width: 100%;
                position: relative;
                cursor: pointer;
                img{
                    width: 100%;
                    max-width: 100%;
                    height: auto;
                    vertical-align: bottom;
                }
                &:hover{
                    .pic{
                        &:after{
                            background: rgba(255,255,255, .05);
                        }
                    }   
                }
            }
        }
    }
}
.detail-img{
    width: 100%;
    height: 100%;
    text-align: center;
    img{
        width: 100%;
        height: auto;
        border: 1px solid #ececec;
    }
}
.pager{
    width: 100%;
    margin-bottom: 15px;
}
</style>

<style style="less">
.el-dialog{
    margin-top: 5vh !important;
}
.el-dialog__body{
    padding: 20px 15px !important;
}
 @media screen and (max-width: 980px) {
    .el-dialog{
        width: 98% !important;
    }
    .el-dialog{
        margin-top: 3vh !important;
    }
}
</style>
