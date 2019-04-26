<template>
    <div class="teaClass">
        <div class="header">
            <div class="checkGrade">
                <el-select v-model="grade" placeholder="请选择年级" @change="getStuListByTea_grade">
                    <el-option v-for="(item, index) in gradeList" :key="index" :label="item.grade+'级'" :value="item.grade"></el-option>
                </el-select>
            </div>
        </div>
        <div class="main">
            <el-table
                :data="classList"
                style="width: 100%;"
                highlight-current-row
                v-loading="isLoading"
                class="my-table"
                >
                <el-table-column 
                    label="年级"
                    prop="grade"
                />
                <el-table-column
                    label="班级"
                    prop="className"
                />
                <!-- <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button
                            size="mini"
                            type="primary"
                            @click="handleEdit(scope.$index, scope.row)"
                        >修改班级信息
                        </el-button>
                        <el-button
                            size="mini"
                            type="success"
                            @click="handleImport(scope.$index, scope.row)"
                        >导入学生信息
                        </el-button>
                    </template>
                </el-table-column> -->
            </el-table>
        </div>
    </div>
</template>

<script>
export default {
    name: 'teaClass',
    data () {
        return {
            teaInfo: {  // 教师信息
                teaName: '',
                teaUUID: ''
            },
            gradeList: [],  // 年级列表 
            grade: '',  // 年级
            classList: [], // 班级
            isLoading: false,
            teaList: [],  // 获取辅导员列表
        }
    },
    methods: {
        getTeaList () {  // 获取辅导员列表
            this.$server.getTeaList().then((res) => {
                console.log(res)
                this.teaList = res
            }).catch((err) => {
                console.log(err)
            })
        },
        getStuListByTea_grade () {  // 通过辅导员 id 和年级 获取班级
            
            let params = {
                teaUUID: this.teaInfo.teaUUID,
                grade: this.grade
            }

            this.isLoading = true
            this.$server.getClassListByTeaUUID(params).then((res) => {
                console.log(res)
                if (res.length != 0) {
                    this.isLoading = false
                    this.classList = res
                } else {
                    this.isLoading = false
                    this.classList = res
                    this.tips('暂无更多数据')
                }
            }).catch((err) => {
                console.log(err)
            })
        },
        getGradeListByTeaUUID () {   // 通过辅导员id获取所带的年级

            this.$server.getGradeList(this.teaInfo).then((res) => {
                console.log(res)
                this.gradeList = res
            }).catch((err) => {
                console.log(err)
            })

        },
        tips (val, type) {
            this.$message({
                message: val || '成功',
                type: type || 'success'
            })
        }
    },
    created () {
        // 获取教师信息
        this.teaInfo.teaName = 'test1'
        this.teaInfo.teaUUID = '7c84fc519f174f578332998cb1e1a7c8'

        // 获取辅导员所带的年级
        this.getGradeListByTeaUUID()

        // 获取辅导列表
        this.getTeaList()
    }
}
</script>

<style scoped>
.header {
    box-shadow: 0px 2px 4px #ddd;
    background: #fff;
    display: flex;
    align-items: center;
    padding: 15px;
    color: #666;
    margin-bottom: 15px;
}
</style>
