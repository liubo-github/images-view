<template>
    <div class="waterfall-box" ref="waterfallbox" :style="`width:${typeof containerWidth === 'string' ? containerWidth : containerWidth + 'px'};`">
        <div 
            class="item"
            v-for="(item, index) in picList"
            :style="`width:${itemWidth}px;`"
            :key="index">
            <div @mouseover="handleMouseover(item)" class="content">
                <div class="pic">
                    <img :src="item.thumb_url" :data-original="item.small_url" alt="">
                </div>
                <div v-if="item.alt_description || item.description" class="info">
                    <p v-if="item.alt_description">图片内容描述：{{item.alt_description}}</p>
                    <p v-if="item.description" style="margin-top: 10px;">配文：{{item.description}}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
function getStyle(el,attr){				
    if(window.getComputedStyle){					
        return getComputedStyle(el,'')[attr];
    }else{
        return el.currentStyle[attr];
    }				
}
import Viewer from 'viewerjs'
import 'viewerjs/src/css/viewer.css'
export default {
    props: {
        isMobile: {},
        picList: {
            type: Array,
            default(){
                return []
            }
        },
        containerWidth: {
            type: [Number, String],
            default(){
                return '100%'
            }
        },
        itemWidth: {
            type: [Number, String],
            default(){
                return 250
            }
        },
    },
    data(){
        return {
            allItems: [],
            loadedItems: [],
            columnHeightArr: [],
            column: 0,
            elWidth: 0,

            spaceBetweenCols: 10,
        }
    },
    mounted(){
        this.elWidth = this.$refs.waterfallbox.offsetWidth;
        let column = Math.floor(this.elWidth / this.itemWidth);
        this.column = Math.floor(this.elWidth / (this.itemWidth + (column - 1) * this.spaceBetweenCols / column));

    },
    watch: {
        picList: {
            handler(){
                this.$nextTick(() => {
                    this.componentUpdated()
                })
            },
            deep: true,
        }
    },
    methods: {
        componentUpdated(){
            this.allItems = [];
            let allItems = this.$refs.waterfallbox.getElementsByClassName('item');
            allItems.forEach(item => {
                if(!item.getAttribute('data-add')){
                    item.style.display = 'none';
                    this.allItems.push(item)
                }
            })
            this.allItems.forEach(item => {
                item.style.width = this.itemWidth + 'px';
                let img = item.getElementsByTagName('img')[0];
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
                        item.style.top = minHeight + 15 + 'px';
                        //每次循环完成以后改变最小高度列的高度
                        this.columnHeightArr[minIndex] += item.offsetHeight + 15;
                    }
                    var viewer = new Viewer(img,{
                        url: 'data-original',
                        navbar: false,
                    });
                    item.setAttribute('data-add', 1);
                }
            })
        },
        handleMouseover(item){
            let img = new Image();
            img.src = item.small_url;
        }
    }
}
</script>

<style lang="less" scoped>
.waterfall-box{
    position: relative;
    margin: 0 auto;
    border: none;
    min-height: 500px;
    &:after{
        content: '';
        display: block;
        clear: both;
    }
    .item{
        font-size: 12px;
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
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            .pic{
                width: 100%;
                position: relative;
                cursor: pointer;
                img{
                    width: 100%;
                    max-width: 100%;
                    height: auto;
                    vertical-align: bottom;
                }
                // &:after{
                //     content: '';
                //     display: block;
                //     position: absolute;
                //     top: 0;
                //     left: 0;
                //     width: 100%;
                //     height: 100%;
                //     background: rgba(0,0,0,.05);
                //     transition: background .1s linear;
                // }
            }
            
            .info{
                width: 100%;
                padding: 10px 15px;
                font-size: 12px;
                color: #999;
                p{
                    margin: 0;
                }
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
</style>