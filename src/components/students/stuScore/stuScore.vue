<template>
    <div class="stuScore">
        <div class="header">
            <el-select v-model="gradeName" style="margin-right: 15px;" placeholder="请选择年级" @change="getClassList">
                <el-option v-for="(item, index) in gradeList" :key="index" :label="item.grade+'级'" :value="item.grade"></el-option>
            </el-select>
            <el-select v-model="classUUID" style="margin-right: 15px;" placeholder="请选择班级" @change="getClassUUID">
                <el-option v-for="(item, index) in classList" :key="index" :label="item.className" :value="item.classUUID"></el-option>
            </el-select>
            <!-- 时间选择 -->
            <el-date-picker
                v-model="prDate"
                type="month"
                placeholder="选择月"
                @change="getPerformanceList"
                value-format="yyyy-MM"
                style="margin-right: 15px;" 
                >
            </el-date-picker>
            <el-tooltip class="item" effect="dark" content="统计上月情况" placement="right" v-model="hoverHide">
                <el-button type="primary" :disabled="isStatisticsDis" @click="statistics()">统计</el-button>
            </el-tooltip>
        </div>
        <div class="main">
            <!-- <el-table
                :data="prList"
                style="width: 100%;"
                highlight-current-row
                v-loading="isLoading"
            >
                <el-table-column label="学号" prop="stuNo"/>
                <el-table-column label="姓名" prop="stuName"/>
                <el-table-column label="绩效分" prop="score"/>

                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="success" size="mini" @click="handleAddPr(scope.$index, scope.row)">添加绩效分</el-button>
                        <el-button type="primary" size="mini" @click="handleUpdatePr(scope.$index, scope.row)">调整绩效分</el-button>
                    </template>
                </el-table-column>
            </el-table> -->
            <table class="my-table">
                <thead>
                    <tr>
                        <td>学号</td>
                        <td>姓名</td>
                        <td>绩效分</td>
                        <td>操作</td>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in prList" :key="index">
                        <td>
                            <span>{{item.stuNo}}</span>
                        </td>
                        <td>
                            <span>{{item.stuName}}</span>
                        </td>
                        <td>
                            <span v-if="isChangInputShow != index">{{item.score}}</span>
                            <span v-else>
                                <input  type="text" name="score" :placeholder="item.score"  maxlength="3" v-model="addPrInfo.score">
                                <el-button size="mini" type="success" @click="addScore()"> <i class="el-icon-check"></i></el-button>
                                <el-button size="mini" @click="closeAddInfo()"><i class="el-icon-close"></i></el-button>
                            </span>
                        </td>
                        <td>
                            <el-button type="success" size="mini" @click="changStu(index, item)">添加绩效分</el-button>
                            <el-button type="primary" size="mini" @click="handleUpdatePr(index, item)">调整绩效分</el-button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <!-- 分页 -->
            <el-col :span="24">
                <el-pagination
                    background
                    layout="prev, pager, next"
                    :total="prPage.total"
                    :page-size="prPage.pageSize"
                    @current-change="handleCurrentChange"
                >
                </el-pagination>
            </el-col>
        </div>
        <!-- 添加绩效分 -->
        <el-dialog
            title="添加绩效分"
            :visible.sync="isAddPrShow"
            width="30%"
            :before-close="handleClose">
            <div class="content">
                <el-form label-width="80px">
                    <input type="hidden" name="stuUUID" v-model="addPrInfo.stuUUID">
                    <el-form-item label="分数">
                        <el-input v-model="addPrInfo.score" placeholder="请输入分数，最高为100分" maxlength="3"></el-input>
                    </el-form-item>
                    <el-form-item label="评分时间">
                        <el-date-picker
                            v-model="addPrInfo.createTime"
                            type="date"
                            placeholder="选择日期"
                            value-format="yyyy-MM-dd"
                            disabled
                            >
                        </el-date-picker>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="isAddPrShow = false">取 消</el-button>
                <el-button type="primary" @click="addPr()">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 调整绩效分 -->
        <el-dialog
            title="调整绩效分"
            :visible.sync="isUpdatePrShow"
            width="30%"
            :before-close="handleClose">
            <div class="content">
                <el-form label-width="80px">
                    <input type="hidden" name="stuUUID" v-model="updatePrInfo.perUUID">
                    <el-form-item label="分数">
                        <el-input v-model="updatePrInfo.score" placeholder="请输入分数，最高为100分" maxlength="3"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="isUpdatePrShow = false">取 消</el-button>
                <el-button type="primary" @click="updatePrScore()">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 统计上月情况 -->
        <el-dialog
            title="上个月未评绩效分情况"
            :visible.sync="isStatisticsShow"
            width="30%"
            :before-close="handleClose">
            <div class="content">
                <el-button type="success" size="mini" v-if="stuStatisticsList.length == 0" @click="downWageInfo">工资汇总表格下载</el-button>
                <el-table
                    :data="stuStatisticsList"
                    style="width: 100%;"
                    highlight-current-row
                >
                    <el-table-column label="学生" prop="stu"/>
                    <el-table-column label="备注" prop="txt"/>
                </el-table>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="isStatisticsShow = false">取 消</el-button>
                <el-button type="primary" @click="updatePrScore()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'stuScore',
    data () {
        return {
            hoverHide: true,
            isLoading: false,
            gradeName:'', // 年级
            gradeList: [],  // 年级列表
            classUUID: '', // 班级ID 获取学生列表
            classList: [],  // 班级列表
            prDate: '',  // 绩效时间段
            prPage: {
                pageNum: 1,
                total: -99,   // 总条数
                pages: '',  // 总页数
                pageSize: 10,  // 页面显示条数
            },
            prList: [],  // 绩效分
            isPr: false,
            isAddPrShow: false, 
            addPrInfo: {
                stuUUID: '',
                score: '',
                createTime: '',
            },
            isUpdatePrShow: false,
            updatePrInfo: {
                score: '',
                perUUID: ''
            },
            isStatisticsDis: true,  // 统计按钮
            isStatisticsShow: false, // 
            stuStatisticsList: [],  // 学生未评分列表
            isChangInputShow: '-99',  // 
        }
    },
    methods: {
        addScore () {  // 添加绩效分
            if (this.addPrInfo.score == '') {
                this.tips('请输入评分', 'error');
                return;
            } else if (this.addPrInfo.score > 100) {
                this.tips('评分不能大于一百分', 'warning');
                return;
            } else if (this.addPrInfo.score < 0) {
                this.tips('评分不能为负数', 'warning');
                return;
            } else {
                console.log(this.addPrInfo);
                this.$loading({
                    lock: true,
                    text: 'Loading'
                });

                let params = new URLSearchParams
                params.append('stuUUID', this.addPrInfo.stuUUID);
                params.append('score', this.addPrInfo.score);
                params.append('createTime', this.addPrInfo.createTime);

                this.$server.addPerformanceScore(params).then((res) => {
                    console.log(res)
                    if (res.status) {
                        this.tips('添加成功', 'success');
                        this.$loading().close();
                        this.getPerformanceList();
                        this.isAddPrShow = false;

                        this.isChangInputShow = -99;
                    } else {
                        this.tips('添加失败', 'error');
                        this.$loading().close();
                        this.getPerformanceList();
                        this.isAddPrShow = false;

                        this.isChangInputShow = -99;
                    }
                    this.addPrInfo.stuUUID = '';
                    this.addPrInfo.score = '';
                    this.addPrInfo.createTime = '';
                    this.isChangInputShow = -99;
                }).catch((err) => {
                    console.log(err)
                })

            }
        },
        closeAddInfo () {
            this.isChangInputShow = -99;
        },
        changStu (index, item) {
            console.log(item)
            if (item.score == "暂无评分,请进行评分") {
                this.isChangInputShow = index;
                this.addPrInfo.stuUUID = item.stuUUID
                this.addPrInfo.createTime = this.prDate + '-01'

            } else {
                this.tips('该学生已经评分', 'success');
                this.isChangInputShow = -99;
                return
            }
            
        },
        downWageInfo () {  // 下载工资信息
            console.log(this.classUUID)
            location.href = "http://192.168.22.46/statistics/statistics/"+this.classUUID
        },
        statistics () {  // 统计
            this.isStatisticsShow = true;
            this.stuStatisticsList = [];
            let params = {
                classUUID: this.classUUID
            };
            this.$server.lastMonStatistics(params).then((res) => {
                console.log(res)
                if (res.length != 0) {
                    res.forEach((item) => {
                        var obj = {
                            stu: item,
                            txt: '暂未评分,请及时评分'
                        };
                        this.stuStatisticsList.push(obj);
                    })
                    console.log(this.stuStatisticsList);
                } else {
                    this.stuStatisticsList = res;
                    // 下载工资模板
                };
            }).catch((err) => {
                console.log(err)
            })
        },
        handleClose () {
            this.isAddPrShow = false;
            this.isUpdatePrShow = false;
            this.isStatisticsShow = false;
        },
        updatePrScore () {  // 确定调整
            if (this.updatePrInfo.score == '') {
                this.tips('请输入评分', 'error');
                return;
            } else if (this.updatePrInfo.score > 100) {
                this.tips('评分不能大于一百分', 'warning');
                return;
            } else if (this.updatePrInfo.score < 0) {
                this.tips('评分不能为负数', 'warning');
                return;
            } else {
                this.$loading({
                    lock: true,
                    text: 'Loading'
                });
                let params = new URLSearchParams;
                params.append('score', this.updatePrInfo.score);
                params.append('perUUID', this.updatePrInfo.perUUID);

                this.$server.updatePerformanceScore(params).then((res) => {
                    console.log(res);   
                    if (res.status) {
                        this.tips('调整成功', 'success');
                        this.$loading().close();
                        this.getPerformanceList();
                        this.isUpdatePrShow = false;
                    } else {
                        this.tips('调整成功', 'error');
                        this.$loading().close();
                        this.getPerformanceList();
                        this.isUpdatePrShow = false;
                    }

                }).catch((err) =>{
                    console.log(err);
                })
            }
        },
        handleUpdatePr (index, item) {
            console.log(item)
            if (item.score == "暂无评分,请进行评分") {
                this.tips('该学生尚未评分，请先进行评分', 'warning');
                return;
            } else {
                this.isUpdatePrShow = true
                this.updatePrInfo.perUUID = item.perUUID
                this.updatePrInfo.score = item.score

            }
        },
        addPr () {  // 确定添加
            
            if (this.addPrInfo.score == '') {
                this.tips('请输入评分', 'error');
                return;
            } else if (this.addPrInfo.score > 100) {
                this.tips('评分不能大于一百分', 'warning');
                return;
            } else if (this.addPrInfo.score < 0) {
                this.tips('评分不能为负数', 'warning');
                return;
            } else if (this.addPrInfo.createTime == '') {
                this.tips('请选择日期', 'warning');
                return;
            } else {
                console.log(this.addPrInfo);
                this.$loading({
                    lock: true,
                    text: 'Loading'
                });
                this.addPrInfo.createTime = this.prDate + '-01'
                let params = new URLSearchParams
                params.append('stuUUID', this.addPrInfo.stuUUID);
                params.append('score', this.addPrInfo.score);
                params.append('createTime', this.addPrInfo.createTime);

                this.$server.addPerformanceScore(params).then((res) => {
                    console.log(res)
                    if (res.status) {
                        this.tips('添加成功', 'success');
                        this.$loading().close();
                        this.getPerformanceList();
                        this.isAddPrShow = false;
                    } else {
                        this.tips('添加失败', 'error');
                        this.$loading().close();
                        this.getPerformanceList();
                        this.isAddPrShow = false;
                    }
                    this.addPrInfo.stuUUID = ''
                    this.addPrInfo.score = ''
                    this.addPrInfo.createTime = ''
                }).catch((err) => {
                    console.log(err)
                })
            }
        },
        handleAddPr (index, item) {  // 添加绩效分
            console.log(item)
            
            if (item.score == "暂无评分,请进行评分") {
                this.isAddPrShow = true
                this.addPrInfo.stuUUID = item.stuUUID
                this.addPrInfo.createTime = this.prDate + '-01'
            } else {
                this.tips('该学生已经评分', 'success')
                return
            }
        },
        handleCurrentChange (vla) {  // 分页切换
            this.prPage = val;
            this.getPerformanceList();
        },
        getPerformanceList () {  // 根据班级 classUUID 获取学生绩效分
            
            console.log(this.prDate)
            if (this.gradeName == '') {
                this.tips('请先选择年级', 'warning');
                this.prDate = '';
                return;
            } else if (this.classUUID == '') {
                this.tips('请选择班级', 'warning');
                this.prDate = '';
                return;
            } else {

                let params = {
                    classUUID: this.classUUID,
                    date: this.prDate,
                    pageNum: this.prPage.pageNum || 1
                };
                console.log(params)
                this.isLoading = true;
                this.$server.getPerformanceByClassUUID(params).then((res) => {
                    console.log(res);
                    // 统计btn
                    this.isStatisticsDis = false

                    if (res.list.length != 0) {
                        this.isLoading = false;
                        this.prList = res.list;
                        this.prList.forEach((item) => {
                            if (item.score == -1) {
                                item.score = '暂无评分,请进行评分'
                            }
                        });
                        
                        console.log(this.prList)
                        this.prPage.total = res.total;
                        this.prPage.pages = res.pages;
                        this.prPage.pageSize = res.pageSize;

                    } else {
                        this.isLoading  =false

                        this.tips('暂无数据', 'success')

                        this.prList = res.list
                        this.prPage.total = res.total
                        this.prPage.pages = res.pages
                        this.prPage.pageSize = res.pageSize
                    }
                }).catch((err) => {
                    console.log(err)
                });
            };
        },
        getClassUUID () {
            console.log(this.classUUID)
            this.prDate = ''
            this.prList = []
            // 统计btn
            this.isStatisticsDis = true
        },
        getClassList () {  // 获取班级列表
            this.prDate = ''
            this.prList = []
            console.log(this.gradeName)
            let params = {
                grade: this.gradeName,
                currentPage: 1
            }
            this.$server.getClassListByGrade(params).then((res) => {
                console.log(res.list)
                this.classList = res.list
            }).catch((err) => {
                console.log(err)
            })
        },
        getGradeList () { // 获取年级列表
            this.$server.getAllGeadeList().then((res) => {
                this.gradeList = res
                console.log(res)
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
        // 获取年级列表
        this.getGradeList()
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
.my-table {
    width: 100%;
    background: #fff;
}
.my-table thead tr td {
    font-weight: bold;
    color: #666;
}
.my-table tr td {
    padding: 12px;
    border-bottom: 1px solid #ddd;
}
</style>
