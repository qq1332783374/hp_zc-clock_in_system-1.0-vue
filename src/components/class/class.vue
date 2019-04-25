<template>
    <div class="class">
        <div class="importFile">
            <div class="addTea">
                <el-button type="success" size="mini" @click="isAddClassShow = true">添加班级</el-button>
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
                    :total="classPage.total"
                    :page-size="classPage.pageSize"
                    @current-change="handleCurrentChange"
                >
                </el-pagination>
            </el-col>
        </div>
        <!-- 导入信息 -->
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
                <el-button type="primary" @click="upLoad()">上传到服务器</el-button>
            </span>
        </el-dialog>
        <!-- 修改信息 -->
        <el-dialog
            title="修改班级信息"
            :visible.sync="isEditShow"
            width="30%"
            :before-close="handleClose">
            <div class="content">
                <el-form ref="form" label-width="80px">
                    <el-form-item label="年级">
                        <el-input v-model="editClassInfo.grade"></el-input>
                    </el-form-item>
                    <el-form-item label="班级">
                        <el-input v-model="editClassInfo.className"></el-input>
                    </el-form-item>
                    <el-form-item label="辅导员">
                        <el-select v-model="editClassInfo.teaUUID" placeholder="请选择辅导员" >
                            <el-option v-for="(item, index) in teaList" :key="index" :label="item.teaName" :value="item.teaUUID"></el-option>
                            
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="isEditShow = false">取 消</el-button>
                <el-button type="primary" @click="upEditInfo()">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 添加班级 -->
        <el-dialog
            title="添加班级信息"
            :visible.sync="isAddClassShow"
            width="30%"
            :before-close="handleClose">
            <div class="content">
                <el-form ref="form" label-width="80px">
                    <el-form-item label="年级">
                        <el-input v-model="addClassInfo.grade" placeholder="请输年级如：2017"></el-input>
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
    </div>
</template>

<script>
import axios from 'axios'

export default {
    name: 'class',
    data () {
        return {
            isImportFileShow: false,
            isEditShow: false,
            isAddClassShow: false,
            isLoading: false,
            classList: [],
            classPage: {
                pageNum: 1,  // 起始页面
                total: -99,   // 总条数
                pages: '',  // 总页数
                pageSize: 10,  // 页面显示条数
            },
            editClassInfo: {
                classUUID: '',
                grade: '',
                className: '',
                teaName: '',
                teaUUID: ''
            },
            teaList: [],
            importStuInfo: {
                classUUID: ''
            },
            addClassInfo: {
                grade: '',
                className: '',
                teaUUID: ''
            }
        }
    },
    methods: {
        addClass () {  // 添加班级
            console.log(this.addClassInfo)
            if (this.addClassInfo.grade == '') {
                this.errTips('年级不能为空')
                return 
            } else if (this.addClassInfo.className == '') {
                this.errTips('班级名称不能为空')
                return
            } else {
                let params = new URLSearchParams
                params.append('grade', this.addClassInfo.grade)
                params.append('className', this.addClassInfo.className)
                params.append('teaUUID', this.addClassInfo.teaUUID)

                this.$server.addClassInfo(params).then((res) => {
                    console.log(res)
                    this.$message({
                        message: '添加成功',
                        type: 'success'
                    })
                    this.isAddClassShow = false
                    this.getClassList()

                }).catch((err) => {
                    console.log(err)
                })
            }
        },
        upEditInfo () {  // 提交修改信息
            
            if (this.editClassInfo.grade == '') {
                this.errTips('年级不能为空')
                return
            } else if (this.editClassInfo.className == '') {
                this.errTips('班级名称不能为空')
                return
            } else {
                console.log(this.editClassInfo)
                let params = new URLSearchParams
                params.append('classUUID', this.editClassInfo.classUUID)
                params.append('grade', this.editClassInfo.grade)
                params.append('className', this.editClassInfo.className)
                params.append('teaUUID', this.editClassInfo.teaUUID)

                this.$server.upDateClassInfo(params).then((res) => {
                    console.log(res)
                    this.$message({
                        message: '修改成功',
                        type: 'success'
                    })
                    this.getClassList()
                    this.isEditShow = false

                }).catch((err) => {
                    console.log(err)
                })
            }
        },
        handleCurrentChange (val) {  // 分页切换
            this.classPage.pageNum = val
        },
        handleEdit (index, item) {  // 修改班级信息
            this.isEditShow = true
            this.editClassInfo = item
        },
        handleImport (index, item) {
            this.isImportFileShow = true
            console.log(item)
            this.importStuInfo = item
        },
        upLoad () {  // 上传到服务器
            
            this.$loading({
                lock: true,
                text: '上传中...'
            })
            const formData = new FormData(this.$refs.upStuFile)
            axios.post('student/import', formData, this.headers).then((res) => {
                console.log(res)
                if (res.status) {
                    this.isImportFileShow = false
                    this.$message({
                        message: '上传成功',
                        type: 'success'
                    })
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
        handleClose () {
            this.isImportFileShow = false
            this.isEditShow = false
            this.isAddClassShow = false
        },
        errTips (val) {
            this.$message({
                title: val || '内容不能为空',
                type: 'warning'
            })
        },
        getClassList (pageNum) {  // 获取班级列表
            this.isLoading = true
            const params = {
                currentPage: this.classPage.pageNum || 1
            }
            this.$server.getClassList(params).then((res) => {
                console.log(res)
                if (res.list.length != 0) {
                    this.isLoading = false
                    this.classList = res.list
                    this.classPage.total = res.total
                    this.classPage.pages = res.pages
                    this.classPage.pageSize = res.pageSize
                } else {
                    this.isLoading = false
                    this.classList = res.list
                    this.classPage.total = res.total
                    this.classPage.pages = res.pages
                    this.classPage.pageSize = res.pageSize
                }

            }).catch((err) => {
                console.log(err)
            })
        },
        getTeaList () {  // 获取班级列表
            this.$server.getTeaList().then((res) => {
                console.log(res)
                this.teaList = res
            }).catch((err) => {
                console.log(err)
            })
        }
    },
    created () {
        // 获取班级列表
        this.getClassList()

        // 获取辅导员列表
        this.getTeaList()
    }
}
</script>

<style scoped>
.importFile {
    height: 50px;
    box-shadow: 0px 2px 4px #ddd;
    background: #fff;
    display: flex;
    align-items: center;
    padding: 0px 15px;
    color: #666;
    margin-bottom: 15px;
}
.importFile .download {
    cursor: pointer;
    margin-left: 15px;
}
.importFile .download a {
    color: #2b99ff;
}
.importFile .download a:hover {
    text-decoration: none;
}
.importFile .upload {
    cursor: pointer;
    color: #67c23a;
}
.my-table {
    box-shadow: 0px 2px 4px #ddd;
    margin-bottom: 5px;
}
</style>
