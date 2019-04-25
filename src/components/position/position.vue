<template>
    <div class="position">
        <div class="header">
            <div class="addPos">
                <el-button type="success" size="mini" @click="isAddPosShow = true">添加职位信息</el-button>
            </div>
        </div>
        <div class="main">
            <el-table
                :data="posList"
                border
                style="width: 100%"
                v-loading="isLoading"
                class="my-table"
                >
                <el-table-column
                    prop="postName"
                    label="职位名称">
                </el-table-column>
                <el-table-column
                    prop="postSubsidy"
                    label="岗位补贴">
                </el-table-column>
                <el-table-column label="操作" >
                    <template slot-scope="scope">
                        <el-button
                        size="mini"
                        type="primary"
                        @click="handleCheck(scope.$index, scope.row)">查看职位信息</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 修改 -->
        <el-dialog
            title="查看职位信息"
            :visible.sync="isUpDatePosShow"
            width="30%"
            :before-close="handleClose">
            <div class="content">
                <el-form ref="form" label-width="80px">
                    <el-form-item label="职位名称">
                        <el-input v-model="upDatePosInfo.postName" placeholder="请输入职位名称" :disabled="isChangePosInfo"></el-input>
                    </el-form-item>
                    <el-form-item label="岗位补贴">
                        <el-input v-model="upDatePosInfo.postSubsidy" placeholder="请输入岗位补贴" :disabled="isChangePosInfo"></el-input>
                    </el-form-item>
                    <input type="hidden" name="postID" v-model="upDatePosInfo.postID">
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose()">取 消</el-button>
                <el-button type="success" @click="isChangePosInfo = false" v-if="isChangePosInfo">修 改</el-button>
                 <el-button type="primary" @click="upadtePos()"  v-else>确 定</el-button>
            </span>
        </el-dialog>

        <!-- 添加 -->
        <el-dialog
            title="添加职位信息"
            :visible.sync="isAddPosShow"
            width="30%"
            :before-close="handleClose">
            <div class="content">
                <el-form ref="form" label-width="80px">
                    <el-form-item label="职位名称">
                        <el-input v-model="addPosInfo.postName" placeholder="请输入职位名称" ></el-input>
                    </el-form-item>
                    <el-form-item label="岗位补贴">
                        <el-input v-model="addPosInfo.postSubsidy" placeholder="请输入岗位补贴" maxlength="11"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCancel()">取 消</el-button>
                 <el-button type="primary" @click="addPos()"  >确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'position',
    data () {
        return {
            posList: [],
            isLoading: false,
            isUpDatePosShow: false,
            isChangePosInfo: true,
            upDatePosInfo: {
                postName: '',
                postSubsidy: '',
                postID: ''
            },
            isAddPosShow: false,
            addPosInfo: {
                postName: '',
                postSubsidy: ''
            }
        }
    },
    methods: {
        addPos () {  // 添加职位信息
            console.log(this.addPosInfo)
            if (this.addPosInfo.postName == '') {
                 this.errTips('职位名称不能为空')
                return 
            } else if (this.addPosInfo.postSubsidy == '') {
                this.errTips('岗位补贴不能为空')
                return
            } else {

                let params = new URLSearchParams 
                params.append('postName', this.addPosInfo.postName)
                params.append('postSubsidy', parseInt(this.addPosInfo.postSubsidy)*100)

                this.$server.addPosInfo(params).then((res) => {
                    console.log(res)
                    if (res.status) {
                        this.isAddPosShow = false
                        this.$message({
                            message: '修改成功',
                            type: 'success'
                        })
                        this.getPosList()

                        this.addPosInfo.postName = ''
                        this.addPosInfo.postSubsidy = ''

                    } else {
                        this.isAddPosShow = false
                        this.errTips('修改失败')
                    }

                }).catch((err) => {
                    console.log(err)
                })
            }
        },
        addCancel () {  // 取消添加
            this.isAddPosShow = false
            this.addPosInfo.postName = ''
            this.addPosInfo.postSubsidy = ''
        },
        upadtePos () {  // 确定修改
            console.log(this.upDatePosInfo)
            if (this.upDatePosInfo.postName == '') {
                this.errTips('职位名称不能为空')
                return 
            } else if (this.upDatePosInfo.postSubsidy == '') {
                this.errTips('岗位补贴不能为空')
                return
            } else {

                let params = new URLSearchParams
                params.append('postName', this.upDatePosInfo.postName)
                params.append('postSubsidy', parseInt(this.upDatePosInfo.postSubsidy)*100)
                params.append('postID', this.upDatePosInfo.postID)

                this.$server.upDatePositionList(params).then((res) => {
                    console.log(res)
                    if (res.status) {
                        this.isUpDatePosShow = false
                        this.isChangePosInfo = true
                        this.$message({
                            message: '修改成功',
                            type: 'success'
                        })
                        this.getPosList()
                    } else {
                        this.isUpDatePosShow = false
                        this.isChangePosInfo = true
                        this.errTips('修改失败')
                    }
                }).catch((err) => {
                    console.log(err)
                })
            }

            
        },
        handleCheck (index, item) {  // 查看
            console.log(item)
            this.isUpDatePosShow = true
            this.upDatePosInfo = item
            
        },  
        handleClose () {
            this.isUpDatePosShow = false
            this.isChangePosInfo = true
            this.isAddPosShow = false
        },
        errTips (val) {
            this.$message({
                title: val || '内容不能为空',
                type: 'warning'
            })
        },
        getPosList () {  // 获取职位列表
            this.isLoading = true
            this.$server.getPositionList().then((res) => {
                console.log(res)
                if (res.length != 0) {
                    this.posList = res
                    this.isLoading = false
                } else {
                    this.isLoading =false
                }
            }).catch((err) => {
                console.log(err)
            })
        }
    },
    created () {
        // 获取职位列表
        this.getPosList()
    }
}
</script>

<style scoped>
.header {
    height: 50px;
    box-shadow: 0px 2px 4px #ddd;
    background: #fff;
    display: flex;
    align-items: center;
    padding: 0px 15px;
    color: #666;
    margin-bottom: 15px;
}
.my-table {
    box-shadow: 0px 2px 4px #ddd;
}
</style>
