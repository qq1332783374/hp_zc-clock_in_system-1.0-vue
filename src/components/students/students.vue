<template>
  <div class="students">
      <el-select placeholder="请选择您带的年级" class="isSelect" v-model="classGrade" style="margin-bottom: 10px;">
      <el-option v-for="(item,index) in Grade" :key="index" :value="item.grade"
        @click.native='Gradeinfo(index)'>
      </el-option>
    </el-select>
    <!-- *********** -->
    <el-select placeholder="请选择类型" class="isSelect" v-model="isclassName" style="margin-bottom: 10px;">
      <el-option v-for="(item,index) in classUUID1" :key="index" :value="item.className"
        @click.native='classinfo(index)'>
      </el-option>
    </el-select>
    <el-table :data="stuInfo" style="width: 100%">
      <el-table-column prop="className" label="班级">
      </el-table-column>
      <el-table-column prop="stuName" label="姓名">
      </el-table-column>
      <el-table-column prop="email" label="邮箱">
      </el-table-column>
      <el-table-column prop="levelName" label="level">
      </el-table-column>
      <!-- <el-table-column
            prop="stuUUID"
            label="学生编号"
            >
        </el-table-column> -->
      <el-table-column prop="stuNo" label="学号">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">

          <el-button type="primary" @click="amend(scope.$index, scope.row)" size="mini" style="margin-top: 10px;">修改学生信息
          </el-button>

          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)" disabled
            style="margin-top: 10px;">删除</el-button>

        </template>
      </el-table-column>
    </el-table>

    <!-- 修改学生信息 -->
    <el-dialog title="修改学生信息" :visible.sync="isAmend" width="30%" :before-close="handleAmend">
      <div class="content">
        <el-radio-group v-model="labelPosition" size="small">
          <el-radio-button label="left">左对齐</el-radio-button>
          <el-radio-button label="right">右对齐</el-radio-button>
          <el-radio-button label="top">顶部对齐</el-radio-button>
        </el-radio-group>
        <div style="margin: 20px;"></div>
        <el-form :label-position="labelPosition" label-width="80px" :model="formLabelAlign">
          <el-form-item label="班级编号">
            <el-select placeholder="请选择类型" class="isSelect" v-model="isclassName">
              <el-option v-for="(item,index) in classUUID" :key="index" :value="item.className"
                @click.native='isclassUUID(index)'>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="名称">
            <el-input v-model="formLabelAlign.stuName" :placeholder="isstuInfo.stuName"></el-input>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="formLabelAlign.email" :placeholder="isstuInfo.email"></el-input>
          </el-form-item>
          <!-- <el-form-item label="学生编号">
                    <el-input v-model="formLabelAlign.stuUUID" :placeholder="isstuInfo.stuUUID"></el-input>
                </el-form-item> -->

        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isAmend = false">取 消</el-button>
        <el-button type="primary" @click="thisAmend">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 职位升降 -->
    <!-- <el-dialog
            title="职位升降"
            :visible.sync="isPosition"
            width="30%"
            :before-close="handPosition">
            <div class="content">
                职位升降
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="isPosition = false">取 消</el-button>
                <el-button type="primary" @click="isPosition = false">确 定</el-button>
            </span>
        </el-dialog> -->
    <!-- 工资发放 -->
    <!-- <el-dialog
            title="工资发放"
            :visible.sync="isSalary"
            width="30%"
            :before-close="handSalary">
            <div class="content">
                工资发放
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="isSalary = false">取 消</el-button>
                <el-button type="primary" @click="isSalary = false">确 定</el-button>
            </span>
        </el-dialog> -->
    <!-- 学生奖罚操作 -->
    <!-- <el-dialog
            title="学生奖罚操作"
            :visible.sync="isAward"
            width="30%"
            :before-close="handAward">
            <div class="content">
                学生奖罚操作
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="isAward = false">取 消</el-button>
                <el-button type="primary" @click="isAward = false">确 定</el-button>
            </span>
        </el-dialog> -->
  </div>
</template>

<script>
  export default {
    name: 'students',
    data() {
      return {
        Grade:'',
        classGrade:'',//年级
        isclassName: '',
        isEditShow: false,
        isAmend: false,
        isPosition: false,
        isSalary: false,
        isAward: false,
        stuInfo: [

        ],
        isstuInfo: '',
        labelPosition: 'right',
        formLabelAlign: {
          stuName: '',
          email: '',
          stuUUID: ''
        },
        classUUID: [

        ],
        classUUID1:[],
        classID: ''
      }
    },
    methods: {
      studentlist() {
          console.log('teaUUID')//7c84fc519f174f578332998cb1e1a7c8
        //  const parms = {

        // }
        // this.$server.studentlist(parms).then((res) => {
        //     console.log('获取学生信息')
        //     console.log(res)
        //     this.stuInfo=res
        // }).catch((err) => {
        //     console.log(err)
        // })
      },
      grade(){     //获取年级
        //    const parms = {
        //        teaUUID:'7c84fc519f174f578332998cb1e1a7c8'
        // }
        var parms = new URLSearchParams
          parms.append('teaUUID', '7c84fc519f174f578332998cb1e1a7c8')
        this.$server.grade(parms).then((res) => {
            console.log('获取年级')
            console.log(res)
            this.Grade=res
        }).catch((err) => {
            console.log(err)
        })
      },
      Gradeinfo(index){ //获取班级
        console.log(this.classGrade)
        const parms = {
          teaUUID:'7c84fc519f174f578332998cb1e1a7c8',
          grade:this.classGrade
        }
        this.$server.Gradeinfo(parms).then((res) => {
          console.log('获取对应班级')
          console.log(res)
         this.classUUID1=res
        }).catch((err) => {
          console.log(err)
        })

      },
      classinfo(index) {
        const parms = {
          classUUID: this.classUUID1[index].classUUID,
          pageNum: 1
        }
        this.$server.classinfo(parms).then((res) => {
          console.log('获取学生信息')
          console.log(res)
          this.stuInfo = res.list
          this.classID = this.classUUID1[index].classUUID
        }).catch((err) => {
          console.log(err)
        })
        console.log(index)
        console.log(this.classUUID1[index].classUUID)
      },
      isClassUUID() {

        const parms = {
          currentPage: 1
        }
        this.$server.isClassUUID(parms).then((res) => {
          console.log('获取classUUID')
          console.log(res.list)
          this.classUUID = res.list
        }).catch((err) => {
          console.log(err)
        })
      },
      handleDelete(index, item) { // 编辑
        console.log(item)
        const parms = {
          stuUUID: item.stuUUID
        }
        this.$server.handleDelete(parms).then((res) => {
          console.log('获取classUUID')
          console.log(res.list)

        }).catch((err) => {
          console.log(err)
        })
      },
      amend(index, item) { //修改学生信息

        this.isAmend = true

        this.isstuInfo = item
        console.log(this.isstuInfo)
      },
      thisAmend() { //确定修改学生信息

        console.log(this.classID)
        console.log(this.formLabelAlign.email)
        console.log(this.formLabelAlign.stuUUID)
        console.log(this.formLabelAlign.stuName)
        if (this.isclassName == '') {
          this.$message('请选择班级');
        } else if (this.formLabelAlign.stuName == '') {
          this.$message('请输入姓名');
        } else if (this.formLabelAlign.email == '') {
          this.$message('请输入email');
          // }else if(this.formLabelAlign.stuUUID==''){
          //     this.$message('请输入学生编号');
        } else {
          this.isAmend = false

          var parms = new URLSearchParams
          parms.append('stuName', this.formLabelAlign.stuName)
          parms.append('classUUID', this.classID)
          parms.append('email', this.formLabelAlign.email)
          parms.append('stuUUID', this.isstuInfo.stuUUID)


          this.$server.thisAmend(parms).then((res) => {
            console.log(res)
            this.$message({
            message: '修改成功',
            type: 'success'
            });
          }).catch((err) => {
            console.log(err)
          })
        }

      },
      isposition(index, item) { //职位升降

        this.isPosition = true
      },
      salary(index, item) { //工资发放

        this.isSalary = true
      },
      award(index, item) { //学生奖罚操作

        this.isAward = true

      },
      isclassUUID(index) {
        console.log(index)
        console.log(this.classUUID[index].classUUID)
        this.classID = this.classUUID[index].classUUID
      },


      handleClose() {
        this.isEditShow = false
      },
      handleAmend() {
        this.isAmend = false
      },
      handPosition() {
        this.isPosition = false
      },
      handSalary() {
        this.isSalary = false
      },
      handAward() {
        this.isAward = false
      },

    },
    created() {
      this.grade()
      this.studentlist()
      this.isClassUUID()

    }

  }

</script>

<style scoped>

</style>
