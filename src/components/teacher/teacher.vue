<template>
    <div class="teacher">
        <div class="importFile">
            <span class="downFile">
                <a href="http://192.168.22.46/teacher/download"><i class="iconfont icon-xiazai-"></i> 下载辅导员信息模板</a>
            </span>
            <span class="importTitle" @click="isImportFileShow = true"><i class="iconfont icon-shangchuan"></i> 导入辅导员信息</span>
            
        </div>
        <div class="teaList">
            <el-row>
                <el-table
                    :data="teacherInfoList"
                    border
                    style="width: 100%"
                    v-loading="isLoading"
                    >
                    <el-table-column
                        prop="teaName"
                        label="姓名">
                    </el-table-column>
                    <el-table-column
                        prop="telephone"
                        label="电话">
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button
                            size="mini"
                             type="danger"
                            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-row>
        </div>
        <!-- 导入信息 -->
        <el-dialog
            title="导入辅导员信息"
            :visible.sync="isImportFileShow"
            width="30%"
            :before-close="handleClose">
            <div class="content">
                <form ref="upTeaFile">
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
    </div>
</template>

<script>
import axios from 'axios'
export default {
    name: 'teacher',
    components: {
    },
    data () {
        return {
            isLoading: false,
            isImportFileShow: false,
            teacherInfoList: [],
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
    },
    methods: {
        upLoad () {  // 上传到服务器
            this.$loading({
                lock: true,
                text: '上传中...'
            })
            const formData = new FormData(this.$refs.upTeaFile)
            axios.post('/teacher/import', formData, this.headers).then((res) => {
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
        handleDelete (index, item) {  // 删除
            console.log(item)
            this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$server.delTeaByteaUUID(item).then((res) => {
                    console.log(res)
                    if (res.status) {

                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });

                        this.getTeaList()
                    }
                }).catch((err) => {
                    console.log(err)
                    this.$message.error('删除失败')
                })
                
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });         
            });
        },
        handleClose () {
            this.isImportFileShow = false
        },
        getTeaList () {
            this.isLoading = true
            this.$server.getTeaList().then((res) => {
                console.log(res)
                if (res.length != 0) {
                    this.isLoading = false
                    this.teacherInfoList = res
                } else {
                    this.isLoading = false
                }
            }).catch((err) => {
                console.log(err)
            })
        }
    },
    created () {
        // 获取数据
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
.importFile .importTitle {
    color: #2b99ff;
}

.importFile .downFile {
    margin-right: 15px;
}
.importFile .downFile a{
    color: #67c23a;
}
.importFile .downFile a:hover {
    text-decoration: none;
}
.teaList {
    box-shadow: 0px 2px 4px #ddd;
}
</style>
