<template>
    <div class="level">
         <el-tooltip class="item right" effect="dark" content="三个月调整一次" placement="bottom" @click="adjustment">
      <el-button>等级调整</el-button>
    </el-tooltip>
      <el-table
    :data="levelInfo"
    style="width: 100%">
    <el-table-column
      label="序号号"
      width="180">
      <template slot-scope="scope">
        
        <span style="margin-left: 10px">{{ scope.row.levelID }}</span>
      </template>
    </el-table-column>

    <el-table-column
      label="等级编号"
      width="180">
      <template slot-scope="scope">
        
        <span style="margin-left: 10px">{{ scope.row.levelName }}</span>
      </template>
    </el-table-column>

    <el-table-column
      label="基本月薪/元"
      width="180">
      <template slot-scope="scope">
        
        <span style="margin-left: 10px">{{ scope.row.salary }}</span>
      </template>
    </el-table-column>

    <el-table-column
      label="级别最低积分"
      width="180">
      <template slot-scope="scope">
        
        <span style="margin-left: 10px">{{ scope.row.integral }}</span>
      </template>
    </el-table-column>

    <el-table-column
      label="绩效考核系数"
      width="380">
      <template slot-scope="scope">
        <span style="margin-left: 10px">{{ scope.row.coefficient }}</span>
      </template>
    </el-table-column>
    <el-table-column label="操作">
        
      <template slot-scope="scope">
        <el-button
          size="mini"
          type="success"
          @click="alterLevel(scope.$index, scope.row)">修改</el-button>
        
      </template>
    </el-table-column>
    
  </el-table>

    <el-dialog
    title='修改等级基本工资'
    :visible.sync="levelShow"
    width="30%"
    :before-close="handlelevel">
    <div>

<div style="margin: 20px;"></div>
<el-form :label-position="labelPosition" label-width="80px" :model="formLabelAlign">
  <el-form-item label="等级编号">
    {{levelID}}
  </el-form-item>
  <el-form-item label="工资/元">
    <el-input v-model="formLabelAlign.salary"></el-input>
  </el-form-item>
  <el-form-item label="等级系数">
    <!-- {{coefficient}} -->
    <el-input v-model="formLabelAlign.coefficient"></el-input>
  </el-form-item>
</el-form>
    </div>
    <span slot="footer" class="dialog-footer">
        <el-button @click="levelShow = false">取 消</el-button>
        <el-button type="primary" @click="ensureLevel">确 定</el-button>
    </span>
    </el-dialog>

    </div>
</template>

<script>
export default {
    name: 'level',
    data(){
        return{
            levelInfo: [
                
            ],
            levelID:'',
            coefficient:'',
            levelShow:false,
            labelPosition: 'right',
            Salary:'',
        formLabelAlign: {
          levelID: '',
          salary: '',
          coefficient: ''
        }, 
        }
    },
    methods:{
        Level(){
        const parms = {
          
        }
        this.$server.Level(parms).then((res) => {
          console.log('获取对应班级')
          console.log(res)
         this.levelInfo=res
         for(var i=0;i<res.length;i++){
             this.levelInfo[i].salary=this.levelInfo[i].salary/100
         }
         
        }).catch((err) => {
          console.log(err)
        })
        },
        alterLevel(index,item){
            console.log(item)
            this.levelShow = true
            this.levelID=item.levelID
            this.formLabelAlign =item
            this.coefficient = item.coefficient
            console.log(this.levelID)
            
        },
        handlelevel(){
             this.levelShow = false
        },
        ensureLevel(){
             if (this.formLabelAlign.salary == '') {
          this.$message('请输入工资');
        } else if (this.formLabelAlign.coefficient == '') {
          this.$message('请输入等级系数');
        } else {
          this.levelShow = false

          var parms = new URLSearchParams
         
          parms.append('levelID', this.levelID)
          parms.append('salary', this.formLabelAlign.salary*100)
          parms.append('coefficient',this.formLabelAlign.coefficient)


          this.$server.ensureLevel(parms).then((res) => {
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
        adjustment(){  //等级调整
            const parms = {
          
        }
        this.$server.adjustment(parms).then((res) => {
         
          console.log(res)
          this.$message({
            message: '调整成功',
            type: 'success'
            });

        }).catch((err) => {
          console.log(err)
        })
        },
    },
     created() {
      this.Level()
      

    }
    
}
</script>

<style scoped>
    .right{
        
        margin: 15px 0;
    }
</style>
