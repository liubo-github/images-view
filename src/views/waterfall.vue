<template>
    <div class="layout" v-loading="loading">
            <!-- :isMobile="isMobile" -->
        <waterfall 
            :containerWidth="1290"
            :picList="picList">
        </waterfall>
    </div>
</template>

<script>
import { getPicData } from '@/api/home'
import waterfall from './components/waterfall'
import { throttle } from '@/utils/index'
export default {
    components: {
        waterfall
    },
    data(){
        return {
            apiParams: {
                page: 1,
                limit: 10,
            },
            picList: [],
            total: 0,
            loading: false,
            isMobile: false,
        }
    },
    created(){
        let windowWidth = window.innerWidth;
        if(windowWidth <= 980){
            this.isMobile = true;
        }
        this.loading = true;
        this.getPicData()
    },
    mounted(){
        window.onscroll = throttle((() => {
            let oldScrollTop = 0;
            let windowHeight = window.innerHeight;
            let scrollHeight = document.documentElement.scrollHeight;
            return () => {
                let newScrollTop = document.documentElement.scrollTop;
                if(newScrollTop + windowHeight + 150 >= scrollHeight && !this.loading && this.apiParams.page <= this.lastPage && newScrollTop > oldScrollTop + 75){
                    this.apiParams.page += 1;
                    this.getPicData()
                    oldScrollTop = newScrollTop;
                }
            }
        })(), 50)
        window.onload = () => {
            let windowHeight = window.innerHeight;
            let scrollHeight = document.documentElement.scrollHeight;
            if(scrollHeight <= windowHeight){
                this.apiParams.page += 1;
                this.getPicData()
            }
        }
    },
    methods: {
        getPicData(){
            getPicData(this.apiParams).then( res => {
                this.picList = [].concat(this.picList, res.data.data)
                if(res.data.page === 1){
                    this.total = res.data.total;
                    this.lastPage = res.data.last_page;
                }
                this.loading = false;
            })
        }
    },
}
</script>

<style lang="less" scoped>
.layout{
    margin: 15px 0;
}
</style>