<template>
  <div>
    <div class="header">

      <el-select placeholder="请选择年级" class="isSelect" v-model="classGrade" style="margin-bottom: 10px;">
        <el-option v-for="(item,index) in Grade" :key="index" :value="item.grade" @click.native='Gradeinfo(index)'>
        </el-option>
      </el-select>

      <!-- *********** -->
      <el-select placeholder="请选择班级" class="isSelect" v-model="isclassName" style="margin-bottom: 10px;">
        <el-option v-for="(item,index) in classUUID" :key="index" :value="item.className"
          @click.native='classinfo(index)'>
        </el-option>
      </el-select>

      <el-button type="primary" @click="isDownRewardsShow = true">下载赏罚记录表格</el-button>

    </div>


    <el-table :data="stuInfo" style="width: 100%">
      <el-table-column prop="className" label="班级">
      </el-table-column>
      <el-table-column prop="stuName" label="姓名">
      </el-table-column>
      <el-table-column prop="email" label="邮箱">
      </el-table-column>
      <el-table-column prop="levelName" label="level">
      </el-table-column>

      <el-table-column prop="stuNo" label="学号">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-row>
            <el-button type="primary" @click="addRecord(scope.$index, scope.row)" size="mini" style="margin-top: 10px;">
              添加赏罚记录
            </el-button>

            <el-button type="success" @click="inqRecord(scope.$index, scope.row)" size="mini" style="margin-top: 10px;">
              查询赏罚记录
            </el-button>
          </el-row>

        </template>
      </el-table-column>
    </el-table>


    <!-- 添加赏罚记录信息 -->
    <el-dialog title="添加赏罚记录信息" :visible.sync="isAmend" width="30%" :before-close="hidden">
      <div class="content">
        <el-select v-model="columeType" placeholder="请选择赏罚类型" class="isSelect">
          <el-option v-for="(item,index) in classify" :key="index" :value="item.scName"
            @click.native='isClassify(index)'>
          </el-option>
        </el-select>

        <el-select v-model="columeForm" placeholder="请选择详细类型" class="isSelect">
          <el-option v-for="(item,index) in classform" :key="index" :value="item.sName"
            @click.native='isclassform(index)'>
          </el-option>
        </el-select>
        <el-form label-width="80px" :model="formLabelAlign">


          <el-form-item label="学生名字">
            {{infoStu.stuName}}
          </el-form-item>
          <el-form-item label="记录标题">
            <el-input v-model="formLabelAlign.srName"></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="formLabelAlign.remark"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isAmend = false">取 消</el-button>
        <el-button type="primary" @click="recordAdd">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 查询赏罚记录 -->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <div>
        <el-form label-width="80px" :model="formLabelAlign">
          <el-form-item label="学生名字">
            {{infoStu.stuName}}
          </el-form-item>
          <el-radio v-model="radio" label="1" @click.native="award">获奖</el-radio>
          <el-radio v-model="radio" label="2" @click.native="penalize">处罚</el-radio>

          <div class="block" style="margin: 20px 0;">
            <span class="demonstration">赏罚开始时间</span>
            <el-date-picker v-model="value1" align="right" type="date" placeholder="选择日期"
              :picker-options="pickerOptions">
            </el-date-picker>
          </div>

          <div class="block">
            <span class="demonstration">赏罚结束时间</span>
            <el-date-picker v-model="value2" align="right" type="date" placeholder="选择日期"
              :picker-options="pickerOptions">
            </el-date-picker>
          </div>
        </el-form>
        <div class="particulars" v-if="show">
          <div class="particulars-title">
            <div>
              赏罚详情
            </div>
            <div>
              <span @click="downPerRewList()">下载个人赏罚记录</span>
            </div>
          </div>
          <div style="margin: 10px 0;" v-for="(item,index) in particulars" :key="index">
            <div>姓名：{{item.stuName}}</div>
            <div>时间：{{item.createTime}}</div>
            <div>规定名称：{{item.sName}}</div>
            <div>赏罚名称：{{item.srName}}</div>
            <div>说明：{{item.remark}}</div>
          </div>

        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="inquireInfo">确 定</el-button>
      </span>
    </el-dialog>
    <div class="block" v-if="stuInfoShow">

      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-size="100"
        layout="prev, pager, next, jumper" :total='this.navigatepageNumsList.length*100'>
      </el-pagination>
    </div>

    <el-dialog
      title="下载赏罚记录表格"
      :visible.sync="isDownRewardsShow"
      width="30%"
      :before-close="handleClose">
      <div class="content">
        <el-form label-width="80px">
          <el-form-item label="年级选择">
            <el-select placeholder="请选择年级" class="isSelect" v-model="downGrade" style="margin-bottom: 10px;">
              <el-option v-for="(item,index) in Grade" :key="index" :value="item.grade" @click.native='getDownGradeInfo(item)'>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="班级选择">
            <el-select placeholder="请选择班级" class="isSelect" v-model="downRewardsInfo.classUUID" style="margin-bottom: 10px;">
              <el-option v-for="(item,index) in downClasslist" :key="index" :value="item.classUUID" :label="item.className">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="赏罚选择">
            <el-select placeholder="请选择赏罚类型" v-model="downRewardsInfo.flag">
              <el-option label="赏" value="1"></el-option>
              <el-option label="罚" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="开始时间">
            <el-date-picker
              v-model="downRewardsInfo.beginTime"
              type="date"
              placeholder="请选择赏罚开始日期"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间">
            <el-date-picker
              v-model="downRewardsInfo.endTime"
              type="date"
              placeholder="请选择赏罚结束日期"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isDownRewardsShow = false">取 消</el-button>
        <el-button type="primary" @click="downRewardsList()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        isDownRewardsShow: false,  // 下载信息模态框
        downGrade: '', // 年级
        downClasslist: [],  // 班级
        downRewardsInfo: {   // 下载赏罚信息
          classUUID: '',  // 班级ID
          flag: '',  // 赏罚类型  1：赏  0：罚
          beginTime: '', // 赏罚开始时间
          endTime: '', // 赏罚结束时间
        },
        //时间
        pickerOptions: {
          //   disabledDate(time) {
          //     return time.getTime() > Date.now();
          //   },
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
        },
        value1: '',
        value2: '',
        //时间
        radio: '',
        dialogVisible: false,
        labelPosition: 'right',
        formLabelAlign: {
          srName: '无',
          remark: '无',
          stuUUID: ''
        },
        classifyinfo: [],
        isclassName: '', //选择班级
        stuInfo: [], //学生列表
        stuInfoShow: false,
        isstuInfo: '',
        classUUID: [], //班级选项
        classID: '', //班级id
        isAmend: false,
        classify: '', //赏罚类型
        columeType: '',
        classform: '', //通过scid获取赏罚列表
        columeForm: '',
        sID: '',
        infoStu: '',
        judge: '',
        show: false,
        particulars: [],
        classGrade: '', //年级
        teaInfo: '',
        Grade: '',
        navigatepageNums: 1, //分页
        navigatepageNumsList: '', //分页列表
        isIndex: '',
        downPerRewInfo: {},  // 下载个人赏罚记录
      }
    },
    methods: {
      downPerRewList () {  // 下载个人赏罚记录
        console.log(this.downPerRewInfo)
        window.location.href = `http://192.168.22.46/stipulation/record/statisticsByStuUUID?stuUUID=${this.downPerRewInfo.stuUUID}&stuName=${this.downPerRewInfo.stuName}&flag=${this.downPerRewInfo.flag}&beginTime=${this.downPerRewInfo.beginTime}&endTime=${this.downPerRewInfo.endTime}`
      },
      errTips (_val, _type) {
        this.$message({
          message: _val,
          type: _type
        })
      },
      downRewardsList () {  // 下载

        if (this.downGrade == '') {
          this.errTips('请选择年级', 'warning');
          return;
        } else if (this.downRewardsInfo.classUUID == '') {
          this.errTips('请选择班级', 'warning');
          return;
        } else if (this.downRewardsInfo.flag == '') {
          this.errTips('请选择赏罚类型', 'warning');
          return;
        } else if (this.downRewardsInfo.beginTime == '') {
          this.errTips('请选择起始时间', 'warning');
          return;
        } else if (this.downRewardsInfo.endTime == '') {
          this.errTips('请选择结束时间', 'warning');
          return;
        } else {
          console.log(this.downRewardsInfo)
          window.location.href = `http://192.168.22.46/stipulation/record/statistics?classUUID=${this.downRewardsInfo.classUUID}&flag=${this.downRewardsInfo.flag}&beginTime=${this.downRewardsInfo.beginTime}&endTime=${this.downRewardsInfo.endTime}`
        }
      },
      getDownGradeInfo (item) {  // 获取下载信息  年级
        var params = {
          teaUUID: this.teaInfo.teaUUID,
          grade: item.grade
        }
        this.$server.getClassListByTeaUUID(params).then((res) => {
          console.log(res)
          this.downClasslist = res
        }).catch((err) => {
          console.log(err)
        })
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.navigatepageNums = val
        this.isClassid = this.classUUID[this.isIndex].classUUID
        // console.log(this.classUUID1[index].classUUID)
        const parms = {
          classUUID: this.classUUID[this.isIndex].classUUID,
          pageNum: this.navigatepageNums
        }
        this.$server.handleCurrentChange(parms).then((res) => {
          // console.log('获取学生信息')
          // console.log(res)
          this.stuInfo = res.list
          this.classID = this.classUUID1[this.isIndex].classUUID
          this.navigatepageNumsList = res.navigatepageNums
        }).catch((err) => {
          console.log(err)
        })
      }, //分页
      grade() { //获取年级
        // console.log('******')
        // console.log(this.teaInfo)
        this.$server.getGradeListByteaUUID(this.teaInfo).then((res) => {
          console.log('获取年级')
          console.log(res)
          this.Grade = res
        }).catch((err) => {
          console.log(err)
        })
      },
      Gradeinfo(index) { //获取班级
        // console.log(this.classGrade)
        const parms = {
          teaUUID: this.teaInfo.teaUUID,
          grade: this.classGrade
        }
        this.$server.Gradeinfo(parms).then((res) => {
          console.log('获取对应班级')
          console.log(res)
          this.classUUID = res
        }).catch((err) => {
          console.log(err)
        })

      },
      classinfo(index) {
        this.isIndex = index
        const parms = {
          classUUID: this.classUUID[index].classUUID,
          pageNum: this.navigatepageNums
        }
        this.$server.classinfo(parms).then((res) => {
          // console.log('获取学生信息')
          // console.log(res)
          this.stuInfo = res.list
          this.classID = this.classUUID[index].classUUID
          this.navigatepageNumsList = res.navigatepageNums
          if (this.stuInfo == 0) {
            this.stuInfoShow = false
          } else {
            this.stuInfoShow = true
          }
        }).catch((err) => {
          console.log(err)
        })
        // console.log(index)
        // console.log(this.classUUID[index].classUUID)
      },
      isClassUUID() {

        const parms = {
          currentPage: 1
        }
        this.$server.isClassUUID(parms).then((res) => {
          // console.log('获取classUUID')
          // console.log(res.list)
          this.classUUID = res.list
        }).catch((err) => {
          console.log(err)
        })

      },
      getAward() { //获取下拉列表数据
        console.log('获取下拉列表数据')
        const parms = {

        }
        this.$server.getAward(parms).then((res) => {
          // console.log(res)
          this.classify = res
          console.log(this.classify)
        }).catch((err) => {
          console.log(err)
        })
      },
      isClassify(index) { //下拉列表选择
        // console.log(index)
        // console.log(this.classify[index].scID)
        const parms = {
          pagesNum: this.classify[index].scID
        }
        this.$server.isClassify(parms).then((res) => {
          //console.log(res)
          this.classform = res
        }).catch((err) => {
          console.log(err)
        })
      },

      isclassform(index) {

        //console.log(this.classform[index].sID)
        this.sID = this.classform[index].sID
      },
      addRecord(index, item) {
        //console.log(item)
        this.isAmend = true
        this.infoStu = item
        //console.log(this.infoStu.stuUUID)
      },
      recordAdd() {
        if (this.columeType == '') {
          this.$message('请选择赏罚类型');
        } else if (this.columeForm == '') {
          this.$message('请选择详细类型');
        } else if (this.formLabelAlign.srName == '') {
          this.$message('请输入赏罚名称');
        } else if (this.formLabelAlign.remark == '') {
          this.$message('请输入赏罚说明');
        } else {
          this.isAmend = false
          var parms = new URLSearchParams
          parms.append('stuUUID', this.infoStu.stuUUID)
          parms.append('sID', this.sID)
          parms.append('srName', this.formLabelAlign.srName)
          parms.append('remark', this.formLabelAlign.remark)

          this.$server.recordAdd(parms).then((res) => {
            //console.log(res)
            this.$message({
              message: '添加成功',
              type: 'success'
            });
            this.formLabelAlign.srName = ''
            this.formLabelAlign.remark = ''

          }).catch((err) => {
            console.log(err)
          })
        }

      },
      inqRecord(index, item) { //查询赏罚记录信息
        //console.log(item)
        this.dialogVisible = true
        this.infoStu = item
      },
      inquireInfo() { ////确定查询赏罚记录信息
        var d = new Date(this.value1);
        var beginTime = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        var c = new Date(this.value2);
        var endTime = c.getFullYear() + '-' + (c.getMonth() + 1) + '-' + c.getDate();
        if (this.judge == '') {
          this.$message('请选择赏罚类型');
        } else if (this.value1 == '') {
          this.$message('请选择开始时间');
        } else if (this.value2 == '') {
          this.$message('请选择结束时间');
        } else {

          this.isAmend = false
          var parms = new URLSearchParams
          parms.append('stuUUID', this.infoStu.stuUUID)
          parms.append('flag', this.judge)
          parms.append('beginTime', beginTime)
          parms.append('endTime', endTime)

          this.downPerRewInfo = {
            stuUUID: this.infoStu.stuUUID,
            stuName: this.infoStu.stuName,
            flag: this.judge,
            beginTime: beginTime,
            endTime: endTime
          }

          this.$server.inquireInfo(parms).then((res) => {
            this.particulars = res
            if (this.particulars == '') {
              this.$message('无赏罚记录')
            } else {
              this.show = true
            }
          }).catch((err) => {
            console.log(err)
          })
        }

      },
      handleClose() {
        this.dialogVisible = false
        this.value1 = ''
        this.value2 = ''
        this.radio = ''
        this.show = false
        this.isDownRewardsShow = false
      },
      hidden() {
        this.isAmend = false
      },
      award() {
        console.log('奖')
        this.judge = 1
      },
      penalize() {
        console.log('罚')
        this.judge = '0'
      },
    },

    created() {
      this.teaInfo = JSON.parse(localStorage.getItem('user')).teacher

      this.getAward();

      this.isClassUUID();

      this.grade();

    }
  }

</script>
<style>
  .isSelect {
    margin-bottom: 10px;
  }

  .particulars {
    margin-top: 20px;
  }

  .header {
    margin-bottom: 15px;
  }
  .particulars-title {
    display: flex;
  }
  .particulars-title div {
    flex: 1;
  }
  .particulars-title div:nth-child(2) {
    text-align: right;
    cursor: pointer;
  }
  .particulars-title div:nth-child(2):hover {
    color: #2b99ff;
    transition: all 0.5s;
  }
</style>
