<template>
    <div id="Content-page">
        <Paging :pagData="[{name:'文章管理',router:'/article-manag'}]" />
        <div class="content-main">
            <el-table :data="tableData" style="width: 100%">
                <el-table-column prop="author_data[0].nickname" label="作者" width="180" />
                <el-table-column prop="time" label="发布时间" />
                <el-table-column prop="address" label="位置" />
                <el-table-column prop="title" label="标题" />
                <el-table-column prop="title" label="详情">
                    <template #default="scope">
                        <el-button size="small" type="primary" @click="drawerView(scope.row._id,scope.$index)">查看全部</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template #default="scope">
                        <el-button size="small" type="danger" @click="handleDelete(scope.row._id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
            <div class="pager-next">
                <el-pagination background layout="prev, pager, next" hide-on-single-page :total="count" 
                @current-change="currentChange" />
            </div>
        </div>
        <el-drawer v-model="drawer" :with-header="false">
            <!-- 图文 -->
			<el-carousel height="300px" :autoplay="false" v-if="tableData[articleIndex].fileType == 'image'">
                <el-carousel-item v-for="(item,index) in tableData[articleIndex].image" :key="index">
                    <el-image
                    style="width: 100%; height: 300px;"
                    :src="item"
                    :zoom-rate="1.2"
                    :preview-src-list="tableData[articleIndex].image"
                    :initial-index="index"
                    preview-teleported
                    fit="cover"
                    />
                </el-carousel-item>
            </el-carousel>
			<!-- 视频 -->
			<div class="article-video" v-else>
				<video width="100%" height="300" loop controls v-if="drawer">
					<source :src="tableData[articleIndex].videoUrl.url" type="video/mp4">
				</video>
			</div>
            <!-- 作者 -->
            <div class="author-view drawer-view global-display global-a-items">
                <img :src="tableData[articleIndex].author_data[0].avatarUrl" alt="">
                <div>
                    <p>{{ tableData[articleIndex].author_data[0].nickname }}</p>
                    <p>{{ tableData[articleIndex].time }}</p>
                </div>
            </div>
            <!-- 地址 -->
            <div class="drawer-view article-city global-display global-f-wrap">
                <p>{{ tableData[articleIndex].province }}</p>
                <p>{{ tableData[articleIndex].city }}</p>
                <p>{{ tableData[articleIndex].address }}</p>
            </div>
            <!-- 标题，内容 -->
            <div class="drawer-view author-essay">
                <p>{{ tableData[articleIndex].title }}</p>
                <p>{{ tableData[articleIndex].content }}</p>
            </div>
            <!-- 评论器 -->
            <div class="drawer-view Comment-message" v-if="userMessageData.length > 0">
                <div class="Comment-users global-display" v-for="(item,index) in userMessageData" :key="index">
                    <img :src="item.comment_user[0].avatarUrl" alt="">
                    <div>
                        <p>{{ item.comment_user[0].nickname }}</p>
                        <p>{{ item.content }}</p>
                    </div>
                </div>
                <span class="loadMore" v-if="userMessageData.length >= 5" @click="moreMessage">{{ moreTitle }}</span>
            </div>
            <div style="height: 300px;"></div>
        </el-drawer>
    </div>
</template>

<script setup>
    // 顶部导航组件
    import { ElMessageBox,ElMessage } from 'element-plus';  
    import Paging from '@/page/component/Paging-component.vue'
    import { ref,onMounted } from 'vue';
    import request from '@/api/request.js'
    
    onMounted(async()=>{
        await requestApi()
    })
    // 用户的文章
    const tableData = ref([])
    const count = ref(1)
    async function requestApi(page=1){
        const res = await request.get('/articleManaGement',{page})
		count.value = res.data.count
        tableData.value = res.data.data
    }
     // 分页
     async function currentChange(event){
        await requestApi(event)
    }
    // 弹窗展示
    const drawer = ref(false)
    const articleId = ref('')
    const articleIndex = ref(0)
    async function drawerView(_id,index){
        articleId.value = _id
        articleIndex.value = index
        newPage.value = 1
        moreTitle.value = '查看更多'
        messAge(_id)
        drawer.value = true
    }
    const handleDelete = async (_id) => {
    const article = tableData.value.find(item => item._id === _id);
    if (!article) return; // 如果找不到文章，直接返回
    try {
        const confirmation = await ElMessageBox.confirm(
            `确定要删除文章 "${article.title}" 吗?`, '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }
        );
        const res = await request.post('/deleteArticle',{_id});
        
        if (res.msg === 'success') {
            tableData.value = tableData.value.filter(item => item._id !== _id);
            ElMessage.success('删除成功');
        } else {
            throw new Error('Failed to delete from backend');
        }
    } catch (error) {
        if (error.type !== 'cancel') {
            ElMessage.error('删除失败: ' + error.message);
        }
    }
};
    // 用户评论数据
    const userMessageData = ref([])
    // 获取评论数据
    async function messAge(article_id,page=1){
        const res = await request.get('/comments-data',{article_id,page})
        userMessageData.value = res.data
    }
    // 更多评论
    const newPage = ref(1)
    const moreTitle = ref('查看更多')
    async function moreMessage(){
        newPage.value++
        const res = await request.get('/comments-data',{article_id:articleId.value,page:newPage.value})
        // console.log(res);
        userMessageData.value = [...userMessageData.value,...res.data]
        moreTitle.value = res.data.length > 0 ? '查看更多' : '没有更多了'
    }
</script>

<style>
.el-drawer__body {
    padding: 0 !important;
}
.drawer-view{
    margin: 10px;
}
.article-video video{
	height: 300px;
	width: 100%;
	object-fit: cover;
}
.author-view{
    box-shadow: 0 0 15px #ca7e7c33;
    border-radius: 5px;
    padding: 10px;
    background: #ffffff;
}
.author-view img{
    width: 50px;
    height: 50px;
    object-fit: cover;
    display: block;
    border-radius: 50%;
}
.author-view div{
    padding-left: 10px;
}
.author-view p:nth-child(1){
    font-weight: bold;
}
.article-city p{
    background-color: gold;
    margin: 0 10px 10px 0;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 700;
    padding: 5px 15px;
}
.author-essay p:nth-child(1){
    font-weight: bold;
    font-size: 18px;
    padding: 10px 0;
}
.author-essay p:nth-child(2) {
    line-height: 1.5;
}
.Comment-message{
    background-color: #f6f7f9;
}
.Comment-users{
    padding: 20px 10px;
}
.Comment-users div{
    padding-left: 10px;
}
.Comment-users img{
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
}
.Comment-users p:nth-child(1) {
    color: #8c8c8c;
    padding-bottom: 3px;
}
.loadMore{
    text-align: center;
    display: block;
    padding-bottom: 10px;
    color: blueviolet;
    cursor: pointer;
}
</style>