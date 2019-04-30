<template>
    <div class="class">
        <div class="header">
            <div class="grade">
                <el-select v-model="grade" placeholder="请选择年级" @change="checkClass">
                    <el-option label="全部" value="1"></el-option>
                    <el-option v-for="(item, index) in gradeList" :key="index" :label="item.grade+'级'" :value="item.grade"></el-option>
                </el-select>
            </div>
            <div class="addClass">
                <el-button type="success" @click="isAddClassShow = true">添加班级</el-button>
            </div>
            <div class="download">
                <a href="http://192.168.22.46/student/download">
                    <i class="iconfont icon-xiazai-"></i> 下载学生信息模板
                </a>
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
                <el-table-column
                    label="辅导员"
                    prop="teaName"
                />
                <el-table-column label="操作">
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
                </el-table-column>
            </el-table>
            <!-- 分页 -->
            <el-col :span="24">
                <el-pagination
                    background
                    layout="prev, pager, next"
                    :total="classPageInfo.total"
                    :page-size="classPageInfo.pageSize"
                    @current-change="handleCurrentChange"
                >
                </el-pagination>
            </el-col>
        </div>
        <!-- 添加班级 -->
        <el-dialog
            title="添加班级"
            :visible.sync="isAddClassShow"
            width="30%"
            :before-close="handleClose">
            <div class="content">
                <el-form ref="form" label-width="80px">
                    <el-form-item label="年级">
                        <el-input v-model="addClassInfo.grade" placeholder="请输年级如：2017" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="班级">
                        <el-input v-model="addClassInfo.className" placeholder="请输入班级如：17前端"></el-input>
                    </el-form-item>
                    <el-form-item label="辅导员">
                        <el-select v-model="addClassInfo.teaUUID" placeholder="请选择辅导员" >
                            <el-option v-for="(item, index) in teaList" :key="index" :label="item.teaName" :value="item.teaUUID"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="isAddClassShow = false">取 消</el-button>
                <el-button type="primary" @click="addClass()">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 修改班级信息 -->
        <el-dialog
            title="修改班级信息"
            :visible.sync="isChangeClassInfo"
            width="30%"
            :before-close="handleClose">
            <div class="content">
                <el-form ref="form" label-width="80px">
                    <el-form-item label="年级">
                        <el-input v-model="changeClassInfo.grade"></el-input>
                    </el-form-item>
                    <el-form-item label="班级">
                        <el-input v-model="changeClassInfo.className"></el-input>
                    </el-form-item>
                    <el-form-item label="辅导员">
                        <el-select v-model="changeClassInfo.teaUUID" placeholder="请选择辅导员" >
                            <el-option v-for="(item, index) in teaList" :key="index" :label="item.teaName" :value="item.teaUUID"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="isChangeClassInfo = false">取 消</el-button>
                <el-button type="primary" @click="changeClass()">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 导入学生信息 -->
        <el-dialog
            title="导入学生信息"
            :visible.sync="isImportFileShow"
            width="30%"
            :before-close="handleClose">
            <div class="content">
                <form ref="upStuFile">
                    <input type="hidden" name="classUUID" v-model="importStuInfo.classUUID">
                    <div class="form-group">
                        <input type="file" name="multipartFile">
                    </div>
                    <div class="form-group">
                        <p>注意事项: 文件格式只能为: <strong>.xls，.xlsx</strong></p>
                    </div>
                </form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="isImportFileShow = false">取 消</el-button>
                <el-button type="primary" @click="importStuInfoFile()">上传到服务器</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    name: 'class',
    data () {
        return {
            gradeList: [],  // 年级列表 
            grade: '1',  // 年级
            classList: [], // 班级
            isLoading: false,
            classPageInfo: {
                pageNum: 1,
                total: -99,   // 总条数
                pages: '',  // 总页数
                pageSize: 10,  // 页面显示条数
            },
            teaList: [],  // 获取辅导员列表
            isAddClassShow: false, 
            addClassInfo: {  // 添加班级信息
                grade: '',
                className: '',
                teaUUID: ''
            },  
            isChangeClassInfo: false,
            changeClassInfo: {  // 修改班级信息
                classUUID: '',
                grade: '',
                className: '',
                teaName: '',
                teaUUID: ''
            },
            isImportFileShow: false,
            importStuInfo: {   // 导入学生信息
                classUUID: ''
            },
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
    },
    methods: {
        importStuInfoFile () {  
            this.$loading({
                lock: true,
                text: '上传中...'
            })
            const formData = new FormData(this.$refs.upStuFile)
            axios.post('student/import', formData, this.headers).then((res) => {
                console.log(res)
                if (res.status) {
                    this.isImportFileShow = false
                    this.tips('上传成功', 'success')
                    this.$loading().close()

                    this.getTeaList()
                } else {
                    this.isImportFileShow = false
                    this.$message.error('上传失败')
                    this.$loading().close()
                }
            }).catch((err) => {
                console.log(err)
                this.$loading().close()
            })
        },
        changeClass () {  // 提交修改
            if (this.changeClassInfo.grade == '') {
                this.tips('年级不能为空', 'warning')
                return 
            } else if (this.changeClassInfo.className == '') {
                 this.tips('班级名称不能为空', 'warning')
                return
            } else {

                let params = new URLSearchParams
                params.append('classUUID', this.changeClassInfo.classUUID)
                params.append('grade', this.changeClassInfo.grade)
                params.append('className', this.changeClassInfo.className)
                params.append('teaUUID', this.changeClassInfo.teaUUID)

                this.$server.upDateClassInfo(params).then((res) => {
                    console.log(res)

                    this.tips('修改成功', 'success')
                    
                    this.isChangeClassInfo = false

                    this.checkClass()

                }).catch((err) => {
                    console.log(err)
                })
            }
        },
        handleEdit (index, item) {  // 修改班级信息
            console.log(item)
            this.isChangeClassInfo = true
            this.changeClassInfo = item

        },
        addClass () {  // 添加班级
            console.log(this.addClassInfo)
            if (this.addClassInfo.grade == '') {
                this.tips('年级不能为空', 'warning')
                return 
            } else if (this.addClassInfo.className == '') {
                this.tips('班级名称不能为空', 'warning')
                return
            } else {
                let params = new URLSearchParams
                params.append('grade', this.addClassInfo.grade)
                params.append('className', this.addClassInfo.className)
                params.append('teaUUID', this.addClassInfo.teaUUID)

                this.$server.addClassInfo(params).then((res) => {

                    console.log(res)
                    this.tips('添加成功', 'success')
                    this.isAddClassShow = false
                    this.checkClass()

                    this.addClassInfo.grade = ''
                    this.addClassInfo.className = ''
                    this.addClassInfo.teaUUID = ''

                }).catch((err) => {
                    console.log(err)
                })
            }

        },

        handleClose () {  // 关闭
            this.isAddClassShow = false
            this.isChangeClassInfo = false
            this.isImportFileShow = false
        },

        handleImport (index, item) {  // 导入相关班级的学生信息
            console.log(item)
            this.isImportFileShow = true
            this.importStuInfo.classUUID = item.classUUID
        }, 

        handleCurrentChange (val) {  // 分页切换
            this.classPageInfo.pageNum = val
        },

        checkClass () {  // 按年级查班级学生
            if (this.grade == 1) {  // 全查
                this.getAllClass()
            } else {  // 通过年级查找
                this.getClassByGrade()
            }
        },
        
        getTeaList () {  // 获取辅导员列表
            this.$server.getTeaList().then((res) => {
                console.log(res)
                this.teaList = res
            }).catch((err) => {
                console.log(err)
            })
        },

        getClassByGrade () {   // 通过年级获取班级
            this.isLoading = true
            let params = {
                grade: this.grade,
                currentPage: this.classPageInfo.pageNum || 1
            }
            this.$server.getClassListByGrade(params).then((res) => {
                console.log(res)
                console.log(res)
                if (res.list.length != 0) {
                    this.isLoading = false
                    this.classList = res.list

                    this.classPageInfo.total = res.total
                    this.classPageInfo.pages = res.pages
                    this.classPageInfo.pageSize = res.pageSize
                } else {
                    this.isLoading  =false
                    this.tips('暂无数据', 'success')
                    this.classList = res.list
                }
            }).catch((err) => {
                console.log(res)
                this.isLoading = false
            })
        },

        getAllClass () {  // 获取全部班级
            this.isLoading = true
            let params = {
                currentPage: this.classPageInfo.pageNum || 1
            }   
            this.$server.getClassList(params).then((res) => {
                console.log(res)
                if (res.list.length != 0) {
                    this.isLoading = false
                    this.classList = res.list

                    this.classPageInfo.total = res.total
                    this.classPageInfo.pages = res.pages
                    this.classPageInfo.pageSize = res.pageSize
                } else {
                    this.isLoading  =false
                    this.tips('暂无数据', 'success')
                    this.classList = res.list
                }
            }).catch((err) => {
                console.log(err)
                this.isLoading = false
            })
        },

        getAllGrade () {  // 获取全部年级
            this.$server.getAllGeadeList().then((res) => {
                console.log(res)
                this.gradeList = res
            }).catch((err) => {
                console.log(err)
            })
        },
        tips (_val, _type) {
            this.$message({
                message: _val || '成功',
                type: _type || 'success'
            })
        }
    },
    created () {
        // 获取全部年级列表
        this.getAllGrade()

        // 获取全部班级列表
        this.getAllClass()

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
.download {
    cursor: pointer;
    margin-left: 15px;
}
.download  a{
    color: #2b99ff;
}
.download a:hover {
    text-decoration: #2b99ff;
}
.addClass {
    margin-left: 15px;
}
</style>
