<template>

  <div class="rewards">
    <div class="header">
      <!-- 下拉列表 -->
      <el-select v-model="columeType" placeholder="请选择类型" class="isSelect">
        <el-option v-for="(item,index) in classify" :key="index" :value="item.scName" @click.native='isClassify(index)'>
        </el-option>
      </el-select>

      <div class="right">

        <div>
          <el-button type="primary" size="mini" @click="addRegulations">添加赏罚条例</el-button>
        </div>
        <!-- <div><el-input v-model="isSID" placeholder="请输入sID"></el-input></div>
                <div><el-button slot="append" icon="el-icon-search" @click="inquire"></el-button></div> -->
        <!-- <el-button type="primary">添加赏罚记录信息</el-button> -->
      </div>
    </div>


    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="赏罚判定" width="180">
        <template slot-scope="scope">

          <span style="margin-left: 10px">{{ scope.row.scName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="赏罚名称" width="300">
        <template slot-scope="scope">

          <span>{{ scope.row.sName }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column
      label="说明"
      width="180">
      <template slot-scope="scope">
        
        <span style="margin-left: 10px">{{ scope.row.sRemark }}</span>
      </template>
    </el-table-column> -->
      <el-table-column label="赏罚金额(单位:元)" width="180">
        <template slot-scope="scope">

          <span style="margin-left: 10px">{{ scope.row.sMoney }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="加减分项" width="180">
        <template slot-scope="scope">

          <span style="margin-left: 10px">{{ scope.row.sValue }}</span>
        </template>
      </el-table-column> -->

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="success" size="mini" @click="isDetails(scope.$index, scope.row)">详情</el-button>
          <el-button type="primary" size="mini" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加赏罚条例 -->
    <el-dialog title="添加赏罚条例" :visible.sync="isRegulations" width="30%" :before-close="handRegulations">
      <div class="content">
        <div style="margin: 20px;"></div>
        <el-form :label-position="labelPosition" label-width="80px" :model="formLabelAlign">
          <el-form-item label="赏罚分类">
            <!-- <el-input v-model="formLabelAlign.scID"></el-input> -->
            <el-select v-model="columeType2" placeholder="请选择赏罚分类" class="isSelect">
              <el-option v-for="(item,index) in classify2" :key="index" :value="item.scName" @click.native='isClassify2(index)'>
              </el-option>
            </el-select>
          </el-form-item>
          <!-- <el-select v-model="columeType2" placeholder="请选择赏罚分类" class="isSelect">
              <el-option v-for="(item,index) in classify2" :key="index" :value="item.scName" @click.native='isClassify2(index)'>
              </el-option>
            </el-select> -->
          <el-form-item label="规定名称">
            <el-input v-model="formLabelAlign.sName" placeholder="请输入规定的名称"></el-input>
          </el-form-item>
          <el-form-item label="赏罚金额">
            <el-input v-model="formLabelAlign.sMoney" placeholder="请输入赏罚的金额"></el-input>
          </el-form-item>
          <el-form-item label="赏罚说明">
            <el-input v-model="formLabelAlign.sRemark" placeholder="请输入赏罚说明"></el-input>
          </el-form-item>
          <!-- <el-form-item label="加减分项">
            <el-input v-model="formLabelAlign.sValue" placeholder="请输入加减分项"></el-input>
          </el-form-item> -->
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isRegulations = false">取 消</el-button>
        <el-button type="primary" @click="isaddRegulations">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改 -->
    <el-dialog title="修改" :visible.sync="ishandleEdit" width="30%" :before-close="handHandleEdit">
      <div class="content">
        <div style="margin: 20px;"></div>
        <el-form :label-position="labelPosition" label-width="80px" :model="formLabelAlign">
          <el-form-item label="规定编号">
            {{formhandleEdit.sID}}
          </el-form-item>
          <el-form-item label="赏罚名称">
            <el-input v-model="formhandleEdit.sName" placeholder="请输入赏罚名称"></el-input>
          </el-form-item>
          <el-form-item label="赏罚金额">
            <el-input v-model="formhandleEdit.sMoney" placeholder="请输入赏罚金额"></el-input>
          </el-form-item>
          <el-form-item label="赏罚说明">
            <el-input v-model="formhandleEdit.sRemark" placeholder="请输入赏罚说明"></el-input>
          </el-form-item>
          <!-- <el-form-item label="加减分项">
            <el-input v-model="formhandleEdit.sValue" placeholder="请输入加减分项"></el-input>
          </el-form-item> -->
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="ishandleEdit = false">取 消</el-button>
        <el-button type="primary" @click="isHandleEdit">确 定</el-button>
      </span>
    </el-dialog>

     <!-- 详情 -->
    <el-dialog
            title="详情"
            :visible.sync="infoDetails"
            width="30%"
            :before-close="detailsInfo">
            <div class="content">
                <el-form :label-position="labelPosition" label-width="80px" :model="formLabelAlign">
                    <el-form-item label="赏罚判定:">
                        {{thisDetails.scName}}
                    </el-form-item>
                    <el-form-item label="赏罚名称:">
                       {{thisDetails.sName}}
                    </el-form-item>
                    <el-form-item label="赏罚金额:">
                        {{thisDetails.sMoney}}
                    </el-form-item>
                    <!-- <el-form-item label="加减分项:">
                        {{thisDetails.sValue}}
                    </el-form-item> -->

                    <div>
                        <p style="margin-left: 10px;">赏罚说明:</p>
                        <div style="text-indent:25px">{{thisDetails.sRemark}}</div>
                    </div>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="infoDetails = false">取 消</el-button>
                <el-button type="primary" @click="infoDetails = false">确 定</el-button>
            </span>
        </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'rewards',
    data() {
      return {
        isSID: '',
        issMoney: '',
        tableData: [],
        classify: [],
        classify2:[],
        columeType: '',
        columeType2: '',
        classifyscID:'',
        isRegulations: false,
        ishandleEdit: false,
        labelPosition: 'right',
        isstuInfo: '',
        infoDetails:false,
        thisDetails:'',
        formLabelAlign: {
          scID: '',
          sName: '',
          sMoney: '',
          sRemark: '',
          sValue: '10',
        },
        formhandleEdit: {
          sID: '',
          sMoney: '',
          sRemark: '',
          sValue: '10',
          sName:''
        },
        thisIndex:''

      }
    },
    methods: {
      getAward() { //获取下拉列表数据
        const parms = {

        }
        this.$server.getAward(parms).then((res) => {
          //console.log(res)
          this.classify = res
          this.classify2 = res
          //console.log(this.classify)
        }).catch((err) => {
          console.log(err)
        })
      },
      isClassify(index) { //下拉列表选择
        //console.log(this.classify[index].scID)
        this.thisIndex=index
        const parms = {
          pagesNum: this.classify[index].scID
        }
        this.$server.isClassify(parms).then((res) => {
          //console.log(res)
          this.tableData = res
        }).catch((err) => {
          console.log(err)
        })
      },
      isClassify2(index){
        //console.log(this.classify2[index].scID)
        this.classifyscID = this.classify2[index].scID
      },
      addRegulations() { //添加赏罚条例按钮

        this.isRegulations = true
      },
      isaddRegulations() { //确定添加赏罚条例
        var _this = this
        if (this.classify2 == '') {
          this.$message('请选择赏罚分类');
        } else if (this.formLabelAlign.sName == '') {
          this.$message('请输入规定名称');
        } else if (this.formLabelAlign.sMoney == '') {
          this.$message('请输入赏罚金额');
        } else if (this.formLabelAlign.sRemark == '') {
          this.$message('请输入规定说明');
        } else if (this.formLabelAlign.sValue == '') {
          this.$message('请输入加减分项');
        } else {
          this.issMoney = this.formLabelAlign.sMoney * 100

          this.isRegulations = false
          var parms = new URLSearchParams
          parms.append('scID', this.classifyscID)
          parms.append('sName', this.formLabelAlign.sName)
          parms.append('sMoney', this.issMoney)
          parms.append('sRemark', this.formLabelAlign.sRemark)
          parms.append('sValue', this.formLabelAlign.sValue)

          this.$server.isaddRegulations(parms).then((res) => {
            //console.log(res)
            this.$message({
              message: '添加成功',
              type: 'success'
            });
            _this.getAward()
            this.columeType2='请选择赏罚分类'
            this.formLabelAlign.sName = ''
            this.formLabelAlign.sMoney = ''
            this.formLabelAlign.sRemark = ''
            this.formLabelAlign.sValue = ''
            if(this.thisIndex==''){

            }else{
              this.isClassify(this.thisIndex)
            }

          }).catch((err) => {
            console.log(err)
          })
        }

      },
      handleEdit(index, item) { //修改

        this.formhandleEdit = item
        this.ishandleEdit = true
        this.formhandleEdit.sID = item.sID
      },
      isHandleEdit() { //确定修改
        if (this.formhandleEdit.sName == '') {
          this.$message('请输入修改的赏罚名称');
        } else if (this.formhandleEdit.sMoney == '') {
          this.$message('请输入修改的赏罚金额');
        } else if (this.formhandleEdit.sRemark == '') {
          this.$message('请输入修改的规定说明');
        } else if (this.formhandleEdit.sValue == '') {
          this.$message('请输入修改的加减分项');
        } else {
          this.issMoney = this.formhandleEdit.sMoney * 100
          this.ishandleEdit = false
          var parms = new URLSearchParams
          parms.append('sID', this.formhandleEdit.sID)
          parms.append('sMoney', this.issMoney)
          parms.append('sRemark', this.formhandleEdit.sRemark)
          parms.append('sValue', this.formhandleEdit.sValue)
          parms.append('sName', this.formhandleEdit.sName)

          this.$server.isHandleEdit(parms).then((res) => {
            //console.log(res)
            this.$message({
            message: '修改成功',
            type: 'success'
            });
            this.getAward()
            this.isClassify()

          }).catch((err) => {
            console.log(err)
          })
        }


      },
      isDetails(index, item) { //详情
        //console.log(item.sID)
        const parms = {
          pagesNum: item.sID
        }
        this.$server.isDetails(parms).then((res) => {
          //console.log(res)
            this.infoDetails=true
            this.thisDetails =res
        }).catch((err) => {
          console.log(err)
        })

      },
      // inquire(){  //sid查询
      //     if(this.isSID==''){
      //         this.$message('请输入sID');
      //     }else{
      //         const parms = {
      //         pagesNum: this.isSID
      //     }
      //     this.$server.inquire(parms).then((res) => {
      //         console.log(res)

      //     }).catch((err) => {
      //         console.log(err)
      //     })
      //     }

      // },
      handRegulations() {
        this.isRegulations = false
      },
      handHandleEdit() {
        this.ishandleEdit = false
      },
      detailsInfo(){
          this.infoDetails = false
      }

    },
    created() {
      this.getAward()
    }
  }

</script>

<style scoped>
  .isSelect {
    margin-bottom: 10px;
  }

  .right {
    float: right;
    height: 100%;
  }

  .right div {
    display: inline-block;
    display: flex;
    height: 100%;
    align-items: center;
  }

  .header {
    background: #fff;
    padding: 5px;
    box-sizing: border-box;
    margin-bottom: 15px;
    height: 50px;
    box-shadow: 0px 2px 4px #ddd;
  }

  .my-table {
    box-shadow: 0px 2x 4px #ddd;
    
  }

</style>
