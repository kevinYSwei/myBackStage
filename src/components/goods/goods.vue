<template>
  <el-card>
    <my-bread level1="商品管理" level2="商品列表"></my-bread>
    <el-row class="searchWrap">
      <el-col :span="8">
        <el-input clearable @clear="clearQuery" placeholder="请输入内容" v-model="query" class="input-with-select">
          <el-button slot="append" @click="searchKeys" icon="el-icon-search"></el-button>
        </el-input>
      </el-col>
      <el-col :span="2">
        <el-button type="success" @click="$router.push({name:'goodsAdd'})" class="addGoodBtn">添加商品</el-button>
      </el-col>
    </el-row>
    <!-- 表格部分 -->
    <el-table :data="goodsInfo" height="350" style="width: 100%">
      <el-table-column type="index" label="#" width="100"></el-table-column>
      <el-table-column prop="goods_name" label="商品名称"></el-table-column>
      <el-table-column prop="goods_price" label="商品价格(元)" width="160"></el-table-column>
      <el-table-column prop="goods_weight" label="商品重量" width="160"></el-table-column>
      <el-table-column label="创建日期" width="160">
        <template slot-scope="scope">{{scope.row.add_time | toDate}}</template>
      </el-table-column>
      <el-table-column label="操作" width="160">
        <template slot-scope="scope">
          <!-- 点击编辑 对单个商品进行编辑 -->
          <el-button @click="jumpEditGood(scope.row.goods_id)" type="primary" size="small" icon="el-icon-edit" plain circle></el-button>
          <el-button @click="delGood(scope.row.goods_id)" type="danger" size="small" icon="el-icon-delete" plain circle>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination class="goodsPagi" @size-change="handleSizeChange" @current-change="handleCurrentChange"
      :current-page="currPageNum" :page-sizes="[8, 16, 24, 32]" :page-size="currsize"
      layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>

    <!-- 编辑商品dialog -->
    <el-dialog title="收货地址" :visible.sync="dialogFormEditVisible">
      <el-form :model="goodsForm">
        <el-form-item label="商品名称" label-width="100px">
          <el-input v-model="goodsForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品价格(元)" label-width="100px">
          <el-input v-model="goodsForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品重量" label-width="100px">
          <el-input v-model="goodsForm.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormEditVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormEditVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
  export default {
    data() {
      return {
        query: "",
        goodsInfo: [],
        currPageNum: 1, //当前页码
        currsize: 8, //每页显示条数
        total: -1, //总数据条数
        goodsForm: {},
        dialogFormEditVisible: false
      };
    },
    created() {
      this.myGoodDatas();
    },
    methods: {
      //点击跳转 编辑页面 也即是添加商品页 只不过需要把当前的数据也传过去 在添加页都渲染出来
      jumpEditGood(id){
        console.log(id,99999)
        this.$router.push({
          name:'goodsAdd',
          query:{
            id:id
          }
        })
      },
      //点击删除good 按钮时  请求数据
      delGood(goods_id) {
        this.$confirm("您确定将永久删除该商品, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(async () => {
            const res = await this.$http.delete(`goods/${goods_id}`);
            console.log(res, 21111);
            if (res.data.meta.status === 200) {
              this.$message.success(res.data.meta.msg)
              this.currPageNum = 1
              this.myGoodDatas()
            } else {
              this.$message.warning(res.data.meta.msg)
            }
          })
          .catch(() => {
            this.$message('已取消删除')
          });
      },
      //弹出编辑商品 dialog
      editGood() {
        this.dialogFormEditVisible = true;
      },
      //当点击清除input按钮时  query因为双向数据绑定 不用重复赋值为空
      clearQuery() {
        this.myGoodDatas();
      },
      //当点击搜索按钮时 请求数据 调取关键字数据  query双向数据绑定
      searchKeys() {
        this.myGoodDatas();
        // this.query = ''
      },
      //页面进来后 调接口获取数据
      async myGoodDatas() {
        const res = await this.$http.get(
          `goods?query=${this.query}&pagenum=${this.currPageNum}&pagesize=${
          this.currsize
          }`
        );
        console.log(res, 223);
        const {
          data: { goods, total, pagenum },
          meta: { msg, status }
        } = res.data;
        if (status === 200) {
          // this.$message.success(msg);
          this.goodsInfo = goods;
          this.total = total;
        } else {
          this.$message.warning(msg);
        }
      },
      //分页操作  当每页条数发生变化时
      handleSizeChange(val) {
        //   console.log(`每页 ${val} 条`);
        this.currsize = val;
        this.currPageNum = 1;
        this.myGoodDatas();
      },
      //改变当前页码 当前页显示的数据条数
      handleCurrentChange(val) {
        //   console.log(`当前页: ${val}`);
        this.currPageNum = val;
        this.myGoodDatas();
      }
    }
  };
</script>

<style>
  .searchWrap {
    margin: 20px 0;
  }

  .searchWrap .addGoodBtn {
    margin-left: 6px;
  }

  .goodsPagi {
    margin-top: 20px;
  }
</style>