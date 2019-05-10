<template>
  <div class="students">
    <div class="header">
      <el-select v-model="gradeInfo.gradeName" style="margin-right: 15px;" placeholder="请选择年级" @change="getClassList">
        <el-option v-for="(item, index) in gradeInfo.gradeList" :key="index" :label="item.grade+'级'"
          :value="item.grade">
        </el-option>
      </el-select>
      <el-select v-model="classInfo.classUUID" style="margin-right: 15px;" placeholder="请选择班级"
        @change="getStuListByClassUUID">
        <el-option v-for="(item, index) in classInfo.classList" :key="index" :label="item.className"
          :value="item.classUUID">
        </el-option>
      </el-select>
    </div>
    <div class="main">
      <el-table :data="stuListInfo.stuList" v-loading="stuListInfo.isLoading" style="width: 100%;">
        <el-table-column label="班级" prop="className" />
        <el-table-column label="学号" prop="stuNo" />
        <el-table-column label="学生姓名" prop="stuName" />
        <el-table-column label="性别" prop="sex" />
        <el-table-column label="邮箱" prop="email" />
        <el-table-column label="情况" prop="status" />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">修改和查看</el-button>
            <el-button size="mini" type="danger" disabled>禁用</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-col :span="24">
        <el-pagination @current-change="handleCurrentChange" :page-size="10" layout="prev, pager, next, jumper"
          :total='stuListInfo.stuPagsInfo.total'>
        </el-pagination>
      </el-col>

      <!-- 修改学生信息 -->
      <el-dialog
        title="修改和查看"
        :visible.sync="stuListInfo.isShow"
        top="5vh"
        width="40%"
        :before-close="handleClose">
        <div class="content">
          <el-form label-width="80px" ref="editStuInfoForm" :model="editStuInfo">
            <el-form-item label="班级">
              <el-select v-model="classInfo.classUUID" style="margin-right: 15px;" placeholder="请选择班级"
                @change="getStuListByClassUUID" disabled>
                <el-option v-for="(item, index) in classInfo.classList" :key="index" :label="item.className"
                  :value="item.classUUID">
                </el-option>
              </el-select>
            </el-form-item>
            <input type="hidden" name="stuUUID" v-model="editStuInfo.stuUUID">
            <el-form-item label="姓名">
              <el-input name="stuName" v-model="editStuInfo.stuName"></el-input>
            </el-form-item>
            <el-form-item label="学号">
              <el-input name="stuNo" v-model="editStuInfo.stuNo"></el-input>
            </el-form-item>
            <el-form-item label="身份证">
              <el-input name="identity" v-model="editStuInfo.identity"></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input name="email" v-model="editStuInfo.email"></el-input>
            </el-form-item>
            <el-form-item label="性别">
              <el-input name="sex" v-model="editStuInfo.sex"></el-input>
            </el-form-item>
            <el-form-item label="本人电话">
              <el-input name="phone" v-model="editStuInfo.phone"></el-input>
            </el-form-item>
            <el-form-item label="寝室号">
              <el-input name="sroom" v-model="editStuInfo.sroom"></el-input>
            </el-form-item>
            <el-form-item label="政治面貌">
              <el-input name="politics" v-model="editStuInfo.politics"></el-input>
            </el-form-item>
            <el-form-item label="民族">
              <el-input name="nation" v-model="editStuInfo.nation"></el-input>
            </el-form-item>
            <el-form-item label="生源地">
              <el-input name="birthplace" v-model="editStuInfo.birthplace"></el-input>
            </el-form-item>
            <el-form-item label="毕业院校">
              <el-input name="graduateSchool" v-model="editStuInfo.graduateSchool"></el-input>
            </el-form-item>
            <el-form-item label="户口性质">
              <el-input name="registered" v-model="editStuInfo.registered"></el-input>
            </el-form-item>
            <el-form-item label="家庭住址">
              <el-input name="homeAddress" v-model="editStuInfo.homeAddress"></el-input>
            </el-form-item>
            <el-form-item label="家长姓名">
              <el-input name="patriarchName" v-model="editStuInfo.patriarchName"></el-input>
            </el-form-item>
            <el-form-item label="家长电话">
              <el-input name="patriarchphone" v-model="editStuInfo.patriarchphone"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="stuListInfo.isShow = false">取 消</el-button>
          <el-button type="primary" @click="upDateStuInfo()">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'students',
    data() {
      return {
        teaInfo: {}, // 教师信息
        gradeInfo: { // 年级信息
          gradeName: '',
          gradeList: []
        },
        classInfo: { // 班级信息
          classUUID: '',
          classList: []
        },
        stuListInfo: {  // 学生列表
          stuPagsInfo: { // 学生分页
            pageNum: 1,
            total: -99, // 总条数
            pages: '', // 总页数
            pageSize: 10, // 页面显示条数
          },
          stuList: [], // 学生信息
          isLoading: false,
          isShow: false,
        },
        editStuInfo: {  // 修改信息
          stuUUID: '', // 学生ID
          stuName: '', //姓名
          stuNo: '', //学号
          email: '', // 邮箱
          sex: '', //性别 0=女 1=男
          identity: '', //身份证号
          politics: '', //政治面貌
          nation: '', //民族
          birthplace: '', //生源地
          registered: '', //户口性质
          homeAddress: '', //家庭地址
          patriarchName: '', //家长姓名
          patriarchphone: '', //家长手机
          phone: '', //本人手机
          graduateSchool: '', //毕业院校
          sroom: '', //寝室号
        }
      }
    },
    methods: {
      upDateStuInfo () {
        console.log(this.editStuInfo)

        let params = new URLSearchParams

        params.append('stuName', this.editStuInfo.stuName)
        params.append('stuNo', this.editStuInfo.stuNo)
        params.append('email', this.editStuInfo.email)
        params.append('sex', this.editStuInfo.sex)
        params.append('politics', this.editStuInfo.politics)
        params.append('nation', this.editStuInfo.nation)
        params.append('birthplace', this.editStuInfo.birthplace)
        params.append('registered', this.editStuInfo.registered)
        params.append('homeAddress', this.editStuInfo.homeAddress)
        params.append('patriarchName', this.editStuInfo.patriarchName)
        params.append('patriarchphone', this.editStuInfo.patriarchphone)
        params.append('phone', this.editStuInfo.phone)
        params.append('graduateSchool', this.editStuInfo.graduateSchool)
        params.append('sroom', this.editStuInfo.sroom)
        params.append('stuUUID', this.editStuInfo.stuUUID)
        params.append('identity', this.editStuInfo.identity)

        this.$server.upDateStuDetailInfo(params).then((res) => {
          console.log(res)
          this.stuListInfo.isShow = false
          this.getStuListByClassUUID()
          if (res.status) {
            this._tips('修改成功')
          } else {
            this._tips('修改失败')
            return
          }
        })
      },
      handleClose () {  // dialo 关闭

        this.stuListInfo.isShow = false

      },
      handleEdit (index, item) {  // 修改
        console.log(item)
        this.stuListInfo.isShow = true

        this.editStuInfo.stuUUID = item.stuUUID

        // 获取学生详细信息
        this.$server.getStuDetailInfo(this.editStuInfo).then((res) => {
          console.log(res)
          if (res.sex == 1) { // 男
            res.sex = '男'
          } else if (res.sex == 0) { // 女
            res.sex = '女'
          }
          //
          this.editStuInfo.stuUUID = res.stuUUID
          this.editStuInfo.stuName = res.stuName
          this.editStuInfo.identity = res.identity
          this.editStuInfo.stuNo = res.stuNo
          this.editStuInfo.email = res.email
          this.editStuInfo.sex = res.sex
          this.editStuInfo.politics = res.politics
          this.editStuInfo.nation = res.nation
          this.editStuInfo.birthplace = res.birthplace
          this.editStuInfo.registered = res.registered
          this.editStuInfo.homeAddress = res.homeAddress
          this.editStuInfo.patriarchName = res.patriarchName
          this.editStuInfo.patriarchphone = res.patriarchphone
          this.editStuInfo.phone = res.phone
          this.editStuInfo.graduateSchool = res.graduateSchool
          this.editStuInfo.sroom = res.sroom


        }).catch((err) => {
          console.log(err)
        })
      },
      handleCurrentChange(val) { // 分页切换

        // 学生分页切换
        this.stuListInfo.stuPagsInfo.pageNum = val

      },
      getStuListByClassUUID() { // 获取班级学生
        this.stuListInfo.isLoading = true
        let params = {
          classUUID: this.classInfo.classUUID,
          pageNum: this.stuListInfo.stuPagsInfo.pageNum || 1
        }
        this.$server.getStuListByClassUUID(params).then((res) => {
          this.stuListInfo.isLoading = false

          if (res.list.length != 0) {

            // 处理性别
            res.list.forEach((item) => {
              if (item.sex == 1) { // 男
                item.sex = '男'
              } else if (item.sex == 0) { // 女
                item.sex = '女'
              }
            })

            // 学生情况
            /**
             * status 开除:0, 在校：1，  休学：2
             */
            res.list.forEach((item) => {
              if (item.status == 0) {
                item.status = '开除'
              } else if (item.status == 1) {
                item.status = '在校'
              } else if (item.status == 2) {
                item.status = '休学'
              }
            })

            this.stuListInfo.stuList = res.list

            // 分页
            this.stuListInfo.stuPagsInfo.total = res.total
            this.stuListInfo.stuPagsInfo.pages = res.pages
            this.stuListInfo.stuPagsInfo.pageSize = res.pageSize

          } else {
            this.stuListInfo.stuList = res.list
            this._tips('暂无数据')
            return
          }
          console.log(res)
        }).catch((err) => {
          console.log(err)
        })
      },
      getClassList() { // 获取班级列表

        let params = {
          grade: this.gradeInfo.gradeName,
          currentPage: 1
        }

        this.$server.getClassListByGrade(params).then((res) => {
          this.classInfo.classList = res.list
        }).catch((err) => {
          console.log(err)
        })
      },
      getGradeList() { // 获取年级列表
        this.$server.getGradeListByteaUUID(this.teaInfo).then((res) => {
          this.gradeInfo.gradeList = res
          //console.log(res)
        }).catch((err) => {
          console.log(err)
        })
      },
      _tips(_val, _type) {
        this.$message({
          message: _val || '成功',
          type: _type || 'success'
        })
      }
    },
    created() {
      // 获取教师信息
      this.teaInfo = JSON.parse(localStorage.getItem('user')).teacher
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

</style>
