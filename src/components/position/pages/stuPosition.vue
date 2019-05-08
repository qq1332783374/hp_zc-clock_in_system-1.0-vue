<template>
    <div class="stuPosition">
        <div class="header">
            <el-select v-model="gradeName" style="margin-right: 15px;" placeholder="请选择年级" @change="getClassList">
                <el-option v-for="(item, index) in gradeList" :key="index" :label="item.grade+'级'" :value="item.grade"></el-option>
            </el-select>
            <el-select v-model="stuListInfo.classUUID" placeholder="请选择班级" @change="classCheck()">
                <el-option v-for="(item, index) in classList" :key="index" :label="item.className" :value="item.classUUID"></el-option>
            </el-select>
        </div>
        <div class="main">
            <el-table
                :data="stuList"
                style="width: 100%;"
                highlight-current-row
                v-loading="isLoading"
                class="my-table"
                >
                <el-table-column
                    label="班级"
                    prop="className"
                />
                <el-table-column
                    label="学生姓名"
                    prop="stuName"
                />
                <el-table-column
                    label="学号"
                    prop="stuNo"
                />
                <el-table-column
                    label="等级"
                    prop="levelName"
                />
                <el-table-column
                    label="邮箱"
                    prop="email"
                />
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button
                            size="mini"
                            type="primary"
                            @click="checkPos(scope.$index, scope.row)"
                        >查看职位信息
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
            <el-col :span="24">
                <el-pagination
                    background
                    layout="prev, pager, next"
                    :total="stuListPage.total"
                    :page-size="stuListPage.pageSize"
                    @current-change="handleCurrentChange"
                >
                </el-pagination>
            </el-col>
        </div>
        <!-- 职位修改 -->
        <el-dialog
            title="学生职位管理"
            :visible.sync="isPosShow"
            width="40%"
            :before-close="handleClose">
            <div class="content">
                <table class="pos-table">
                    <thead>
                        <tr>
                            <td>学生姓名</td>
                            <td>学生职位</td>
                            <td>操作</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in stuPosList" :key="index">
                            <td>{{item.stuName}}</td>
                            <td>
                                <span>{{item.postName}}</span>
                            </td>
                            <td>
                                <div >
                                    <el-button type="success" size="mini" @click="changePos(index, item)">职位升降</el-button>
                                    <el-button type="primary" size="mini" @click="handelAddNewPos(index, item)">职位添加</el-button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <!-- <span slot="footer" class="dialog-footer">
                <el-button @click="isPosShow = false">取 消</el-button>
                 <el-button type="primary" @click="isPosShow = false"  >确 定</el-button>
            </span> -->
            <!-- 职位升降 -->
            <el-dialog
            width="30%"
            title="职位升降"
            :visible.sync="innerVisible"
            append-to-body>
                <div class="content">
                    <div>
                        <el-form ref="one-pos" label-width="80px">
                            <input type="hidden" name="stuUUID" v-model="addStuPos.stuUUID">
                            <el-form-item label="原职位">
                                <el-select v-model="addStuPos.oldPostName" placeholder="请选择职位" disabled>
                                    <el-option v-for="(item, index) in posList" :key="index" :label="item.postName" :value="item.postID"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="新职位">
                                <el-select v-model="addStuPos.newPostID" placeholder="请选择职位">
                                    <el-option v-for="(item, index) in posList" :key="index" :label="item.postName" :value="item.postID"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="变动信息">
                                <el-input v-model="addStuPos.prName" name="prName"></el-input>
                            </el-form-item>
                            <el-form-item label="备注">
                                <el-input type="textarea" v-model="addStuPos.remark"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="updateChangePosInfo">立即创建</el-button>
                                <el-button @click="innerVisible = false">取消</el-button>
                            </el-form-item>
                        </el-form>
                    </div>  
                </div>
            </el-dialog>
            <!-- 职位添加 -->
            <el-dialog
            width="30%"
            title="职位添加"
            :visible.sync="isAddPosShow"
            append-to-body>
                <div class="content">
                    <el-form label-width="80px">
                        <input type="hidden" name="stuUUID" v-model="addStuPos.stuUUID">
                        <el-form-item label="新职位">
                            <el-select v-model="addNewPos.postID" placeholder="请选择职位">
                                <el-option v-for="(item, index) in posList" :key="index" :label="item.postName" :value="item.postID"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="变动信息">
                            <el-input v-model="addNewPos.prName" name="prName"></el-input>
                        </el-form-item>
                        <el-form-item label="备注">
                            <el-input type="textarea" v-model="addNewPos.remark"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="upAddNewPos()">添 加</el-button>
                            <el-button @click="isAddPosShow = false">取 消</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </el-dialog>

        </el-dialog>
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
            },
            stuList: [],
            stuListPage: {
                total: -99,   // 总条数
                pages: '',  // 总页数
                pageSize: 10,  // 页面显示条数
            },
            isLoading: false,
            isPosShow: false,
            stuPosList: [],  // 学生职位
            isLoading1: false,
            addStuPos: {  // 学生提升
                stuUUID: '',
                oldPostID:'',
                oldPostName: '',
                newPostID: '',
                prName: '',
                remark: ''
            },
            innerVisible: false,
            posList: [],  // 全部职位列表
            isAddPosShow: false,
            addNewPos: {
                stuUUID: '',
                postID: '',
                prName: '',
                remark: ''
            },
            gradeList:[],  // 年级列表
            gradeName: '', // 年级名称
            teaInfo: {}, // 教师信息
        }
    },
    methods: {
        getClassList () {  // 通过年级获取班级
            let params = {
                grade: this.gradeName,
                currentPage: 1
            }
            this.$server.getClassListByGrade(params).then((res) => {
                this.classList = res.list
            }).catch((err) => {
                console.log(err)
            })
        },
        getGeadeList () {  // 获取年级列表
            this.$server.getGradeListByteaUUID(this.teaInfo).then((res) => {
                this.gradeList = res
            }).catch((err) => {
                console.log(err)
            })
        },
        upAddNewPos () {  // 添加职位
            if (this.addNewPos.prName == '') {
                this.tips('请输入变动信息', 'warning')
                return
            } else if (this.addNewPos.remark == ''){
                this.tips('请输入备注', 'warning')
                return
            } else {
                let params = new URLSearchParams
                params.append('stuUUID', this.addNewPos.stuUUID)
                params.append('postID', this.addNewPos.postID)
                params.append('prName', this.addNewPos.prName)
                params.append('remark', this.addNewPos.remark)

                this.$server.addStuNewPos(params).then((res) => {
                    if (res.status) {
                        this.innerVisible = false
                        this.isPosShow = false
                        this.isAddPosShow = false
                        this.tips('职位添加成功', 'success')
                        this.getClassList()

                        this.addNewPos.stuUUID = ''
                        this.addNewPos.postID = ''
                        this.addNewPos.prName = ''
                        this.addNewPos.remark = ''

                    } else {
                        this.innerVisible = false
                        this.isPosShow = false
                        this.isAddPosShow = false
                        this.getClassList()

                        this.addNewPos.stuUUID = ''
                        this.addNewPos.postID = ''
                        this.addNewPos.prName = ''
                        this.addNewPos.remark = ''
                    }
                }).catch((err) => {
                    console.log(err)
                })
            }
        },
        handelAddNewPos (index, item) {  // 添加职位
            this.isAddPosShow = true
            this.addNewPos.stuUUID = item.stuUUID

        },
        updateChangePosInfo () {  // 职位升降

            let params = new URLSearchParams
            params.append('stuUUID', this.addStuPos.stuUUID)
            params.append('oldPostID', this.addStuPos.oldPostID)
            params.append('newPostID', this.addStuPos.newPostID)
            params.append('prName', this.addStuPos.prName)
            params.append('remark', this.addStuPos.remark)

            this.$server.upOrDownStuPos(params).then((res) => {
                if (res.status) {
                    this.innerVisible = false
                    this.isPosShow = false
                    this.tips('职位修改成功', 'success')
                    this.getClassList()

                    this.addStuPos.stuUUID = ''
                    this.addStuPos.oldPostID = ''
                    this.addStuPos.oldPostName = ''
                    this.addStuPos.newPostID = ''
                    this.addStuPos.prName = ''
                    this.addStuPos.remark = ''
                } else {
                    this.innerVisible = false
                    this.isPosShow = false
                    this.tips('职位修改失败', 'error')

                    this.addStuPos.stuUUID = ''
                    this.addStuPos.oldPostID = ''
                    this.addStuPos.oldPostName = ''
                    this.addStuPos.newPostID = ''
                    this.addStuPos.prName = ''
                    this.addStuPos.remark = ''
                }
            }).catch((err) => {
                console.log(err)
            })
        },
        changePos (index, item) {  // 修改职位
            this.innerVisible = true
            this.addStuPos.stuUUID = item.stuUUID

            this.addStuPos.oldPostName = item.postName
            this.posList.forEach((foritem) => {
                if (foritem.postName == item.postName) {
                    this.addStuPos.oldPostID = foritem.postID
                }
            })
        },
        handleClose () {
            this.isPosShow = false
        },
        checkPos (index, item) {  // 查看职位信息
            this.isPosShow = true
            this.isLoading1 = true
            this.$server.getPosInfoBystuUUID(item).then((res) => {
                this.isLoading1 = false
                this.stuPosList = res

            }).catch((err) => {
                console.log(err)
            })

        },
        handleCurrentChange (val) {  // 分页切换
            this.stuListInfo.pageNum = val
            this.classCheck()
        },
        getPosList () {  // 获取职位列表
            this.$server.getPositionList().then((res) => {
                this.posList = res
            }).catch((err) => {
                console.log(err)
            })
        },
        classCheck () {  // 根据班级获取学生列表
            this.isLoading = true
            this.$server.getStuClassByClassUUID(this.stuListInfo).then((res) => {
                if (res.list.length != 0) {
                    this.isLoading = false
                    this.stuList = res.list

                    this.stuListPage.total = res.total
                    this.stuListPage.pages = res.pages
                    this.stuListPage.pageSize = res.pageSize
                } else {
                    this.isLoading = false  
                    this.tips('暂无数据', 'success')
                    this.stuList = res.list
                }
            }).catch((err) => {
                console.log(err)
            })
        },
        tips (val, type) {  // 提示
            this.$message({
                message: val || '成功',
                type: type || 'success'
            })
        }
    },
    created () {
        // 获取教师信息
        this.teaInfo = JSON.parse(localStorage.getItem('user')).teacher
        // 获取年级列表
        this.getGeadeList()
        // 全部职位列表
        this.getPosList()
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
.main .my-table {
    box-shadow: 0px 2px 4px #ddd;
    margin-bottom: 15px;
}
.pos-table {
    width: 100%;
}
.pos-table thead tr td {
    font-weight: bold;
    color: #666;
}
.pos-table tr {
    border-bottom: 1px solid #ddd;
}
.pos-table td {

    padding: 15px;
}
</style>
