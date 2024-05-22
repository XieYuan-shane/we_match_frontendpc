<template>
    <div id="Content-page">
        <Paging :pagData="[{name:'用户管理',router:'/user-manag'}]" />
        <div class="content-main">
            <el-table :data="tableData" style="width: 100%">
                <el-table-column prop="nickname" label="昵称" width="180" />
                <el-table-column prop="time" label="头像">
                    <template #default="scope">
                        <el-image
                        style="width: 50px; height: 50px"
                        :src="scope.row.avatarUrl"
                        lazy
                        preview-teleported
                        :zoom-rate="1.2"
                        :preview-src-list="[scope.row.avatarUrl]"
                        :initial-index="scope.$index"
                        fit="cover"
                        />
                    </template>
                </el-table-column>
                <el-table-column prop="articleQuantity" label="作品数" />
                <el-table-column prop="concernQuantity" label="粉丝数" />
                <el-table-column prop="email" label="邮箱" />
                <el-table-column prop="uid" label="uid" />
                <el-table-column label="操作">
                    <template #default="scope">
                        <el-button size="small" type="danger" v-if="scope.row.deleted !== '1'" @click="handleDelete(scope.row._id)">删除</el-button>
                        <el-button size="small" type="success" v-else @click="handleRestore(scope.row._id)">恢复</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
            <div class="pager-next">
                <el-pagination background layout="prev, pager, next" hide-on-single-page :total="count" 
                @current-change="currentChange" />
            </div>
        </div>
    </div>
</template>

<script setup>
    // 顶部导航组件
    import { ElMessageBox,ElMessage } from 'element-plus';  
    import Paging from '@/page/component/Paging-component.vue'
    import { ref,onMounted } from 'vue';
    import request from '@/api/request.js'
    // 用户的文章
    const tableData = ref([])
    const count = ref(1)
    onMounted(async()=>{
        await requestApi()
    })
    async function requestApi(page=1){
        const res = await request.get('/allUserInfor',{page})
        count.value = res.data.count
        tableData.value = res.data.data
        console.log(tableData.value)
    }
    // 分页
    async function currentChange(event){
        await requestApi(event)
    }
    const handleDelete = async (_id) => {
    try {
        await ElMessageBox.confirm('确定要删除这个用户吗?', '警告', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        });
        const res = await request.post('/deleteUser', { _id });
        if (res.msg === "success") {
            ElMessage.success('删除成功');
            await requestApi();
        } else {
            throw new Error('Failed to delete from backend');
        }
    } catch (error) {
        if (error.type !== 'cancel') {
            ElMessage.error('删除失败: ' + error.message);
        }
    }
};

const handleRestore = async (_id) => {
    try {
        await ElMessageBox.confirm('确定要恢复这个用户吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'info'
        });
        const res = await request.post('/restoreUser', { _id });
        if (res.msg === "success") {
            ElMessage.success('恢复成功');
            await requestApi();
        } else {
            throw new Error('Failed to restore from backend');
        }
    } catch (error) {
        if (error.type !== 'cancel') {
            ElMessage.error('恢复失败: ' + error.message);
        }
    }
};

</script>

<style scoped>

</style>