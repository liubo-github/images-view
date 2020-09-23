<template>
    <div class="home" v-loading="loading">
        <div class="images">
            <template v-for="(item, index) in imageList">
                <el-card class="box-card" :body-style="{ padding: '15px' }">
                    <div class="content">
                        <!-- <img @click="getImageDetail(item.id)" v-lazy="item.url" :key="index" alt=""> -->
                        <img @click="detailImgUrl = item.url, dialogVisible = true" v-lazy="item.url" :key="index" alt="">
                    </div>
                </el-card>
            </template>
        </div>
        <el-row class="pager" type="flex" justify="center">
            <el-pagination
                small
                :current-page.sync="apiParams.page"
                :page-sizes="[10, 50, 100, 200, 300, 400, 500]"
                :page-size.sync="apiParams.limit"
                :total="total"
                style="margin-top: 32px"
                layout="sizes, pager, jumper"
                @size-change="getImageList"
                @current-change="getImageList"
            />
        </el-row>

        <el-row type="flex" justify="center" style="margin-bottom: 15px;">
            <router-link :to="'/upload'">
                <el-button type="primary">去上传</el-button>
            </router-link>
        </el-row>

        <el-dialog
            :visible.sync="dialogVisible"
            width="35%"
            :before-close="() => { this.dialogVisible = false; this.imgDetail = {} }">
            <div class="detail-img" v-if="detailImgUrl">
                <img :src="detailImgUrl" alt="">
                <a :href="detailImgUrl" target="_blank">
                    <el-button style="width: 100%;margin-top: 5px;" type="primary">下载</el-button>
                </a>
            </div>
            <!-- <div class="detail-img" v-if="imgDetail.url">
                <span v-if="!imgDetail['loaded']">
                    图片加载中...<i class="el-icon-loading"></i>
                </span>
                <img v-if="imgDetail['loaded']" :src="imgDetail.url" alt="">
                <a :href="imgDetail.url" target="_blank">
                    <el-button style="width: 100%;margin-top: 5px;" type="primary">下载</el-button>
                </a>
            </div> -->
        </el-dialog>
	</div>
</template>

<script>
import { getImageList, getImageDetail } from '@/api/home'
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
            dialogVisible: false,
            imgDetail: {},
            detailImgUrl: '',
		}
	},
	created(){
		this.getImageList()
    },
	methods: {
		getImageList(){
            this.loading = true;
			getImageList(this.apiParams).then( res => {
                this.imageList = res.data.data;
                this.total = res.data.total;
                this.loading = false;
                this.$forceUpdate();
			})
		},
		getNextPageData(){
			this.apiParams.page += 1;
			this.getImageList()
        },
        getImageDetail(id){
            getImageDetail({
                id,
            }).then( res => {
                this.imgDetail = res.data;
                this.imgDetail['loaded'] = false;
                this.dialogVisible = true;
                let img = new Image();
                img.onload = () => {
                    this.imgDetail['loaded'] = true;
                    this.$forceUpdate()
                }
                img.src = this.imgDetail.url;
            })
        }
	},
};
</script>

<style lang="less" scoped>
.images{
    width: 100vw;
    display: flex;
    flex-wrap: wrap;
    position: relative;
    .box-card{
        width: calc(100vw / 6);
        margin: 15px;
        @media screen and (max-width: 980px) {
            margin: 0px;
            width: 100vw
        }
        .content{
            display: flex;
            justify-content: center;
            align-content: center;
            overflow: hidden;
            img{
                width: 100%;
                height: auto;
                position: relative;
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
