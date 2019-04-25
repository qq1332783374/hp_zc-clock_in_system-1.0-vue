<template>
    <div class="stuPosition">
        <div class="header">
            <el-select v-model="stuListInfo.classUUID" placeholder="请选择班级" @change="classCheck()">
                <el-option v-for="(item, index) in classList" :key="index" :label="item.className" :value="item.classUUID"></el-option>
            </el-select>
        </div>
        <div class="main">
            table
        </div>
    </div>
</template>

<script>
export default {
    name: 'stuPosition',
    data () {
        return {
            classList: [],  // 班级列表
            stuListInfo: {
                classUUID: '',
                pageNum: 1,
            }
        }
    },
    methods: {
        classCheck () {
            console.log(this.stuListInfo.classUUID)
        },
        getClassList () {  // 获取班级列表
            const params = {
                currentPage: 1
            }
            this.$server.getClassList(params).then((res) => {
                console.log(res)
                this.classList = res.list

            }).catch((err) => {
                console.log(err)
            })
        }
    },
    created () {
        // 班级列表
        this.getClassList()
    }
}
</script>

<style scoped>
.header {
    background: #fff;
    box-shadow: 0px 2px 4px #ddd;
    padding: 10px;
    margin-bottom: 15px;
}
</style>
