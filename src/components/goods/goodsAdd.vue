<template>
  <el-card>
    <my-bread level1="商品管理" level2="商品列表"></my-bread>
    <el-alert class="addGoodInfoAlert" title="添加商品信息" type="success" center show-icon></el-alert>
    <!-- 添加步骤条 el-steps  :active 当前正在第几步 -->
    <el-steps class="addGoodsStep" align-center :active="activeTab*1" finish-status="success">
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>
    <!-- 最外层包裹一个 el-form -->
    <el-form
      label-position="top"
      label-width="80px"
      :model="addGoodForm"
      style="height:400px;overflow:auto"
    >
      <!-- Tabs标签页  el-tabs表单元素  value即指向name 且与上面联动绑定同一个-->
      <el-tabs v-model="activeTab" tab-position="left" @tab-click="tabChange()">
        <el-tab-pane name="1" label="基本信息">
          <el-form-item label="商品名称">
            <el-input v-model="addGoodForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="addGoodForm.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="addGoodForm.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="addGoodForm.goods_number"></el-input>
          </el-form-item>
          <!-- 级联选择器 el-cascader 
          表单元素 :options 数据源[] 
          v-model[]value类型为数组，指选择最终选择的label对应的value值 会放在此v-model对应的value数组中 
          :props={} 为一个对象 需要内置的三个属性 label value children-->
          <el-form-item label="商品分类">
            <el-cascader
              expand-trigger="hover"
              v-model="selectedOptions"
              :options="options"
              :props="defaultProps"
              @change="handleChange"
              clearable
            ></el-cascader>
            <!-- 在这里注意：在点击商品参数之前 必须先选择商品分类 -->
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="2" label="商品参数">
          <!-- 显示的是该三级分类的商品参数 -->
          <!-- 这个是 label input头 -->
          <el-form-item :label="item1.attr_name" v-for="(item1,i) in arrDtParams" :key='i'>
              <!-- 这里v-model 绑定的是label选中的组成的数组 因为在请求数据后attr_vals已经转换成数组 所以刚好符合这里参数为数组的要求-->
            <el-checkbox-group v-model="item1.attr_vals" >
                <!-- 每一组复选框 -->
              <el-checkbox border :label="item2" v-for="(item2,i) in item1.attr_vals" :key='i'></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="3" label="商品属性">商品属性</el-tab-pane>
        <el-tab-pane name="4" label="商品图片">商品图片</el-tab-pane>
        <el-tab-pane name="5" label="商品内容">商品内容</el-tab-pane>
      </el-tabs>
    </el-form>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      /* goods_name	商品名称	不能为空
        goods_cat 以为','分割的分类列表(字符串)不能为空 ->级联选择器绑定的selectedOptions
        goods_price	价格	不能为空
        goods_number	数量	不能为空
        goods_weight	重量	不能为空
        goods_introduce	介绍	可以为空
        pics	上传的图片临时路径（对象）	可以为空
        attrs */
      activeTab: "1",
      addGoodForm: {
        //添加商品需要提交的表单数据
        goods_name: "",
        //goods_cat以为','分割的分类列表 不为空 它就是selectedOptions 需要将数组转成字符串
        goods_cat: "",
        goods_price: "",
        goods_number: "",
        goods_weight: "",
        goods_introduce: "",
        pics: "",
        attrs: ""
      },
      //级联选择器 数据
      //   selectedOptions: [], //双向数据绑定 选择label对应的value值 组成的数组
      selectedOptions: [1, 3, 6], //默认显示哪一项 初始值
      options: [], //数据源
      defaultProps: {
        label: "cat_name",
        value: "cat_id",
        children: "children"
      },
      //获取商品的动态参数 数据源  数组
      arrDtParams: [],
      checkList:[]
    };
  },
  created() {
    this.myCascader();
  },
  methods: {
    //当tab切换时 当点击的是第2个 tab时，且此时第一个tab中已经选了三级分类 有值的前提下
    async tabChange() {
      if (this.activeTab === "2") {
        if (this.selectedOptions.length !== 3) {
          //保证此时已经选了三级分类
          this.$message.warning("请先选择商品的三级分类");
          return; //阻止代码继续向下执行
        }
        // 否则请求接口 参数列表  :id 分类ID(最后一级的分类id)  many指的是获取动态参数
        //selectedOptions[2] 指的是 分类ID--->(最后一级的分类id)
        const res = await this.$http.get(
          `categories/${this.selectedOptions[2]}/attributes?sel=many`
        );
        console.log(res, 222);
        //取出商品的动态参数[]数组 attr_name->label  attr_vals -> 值 类型为字符串类型
        this.arrDtParams = res.data.data;
        this.arrDtParams.forEach(item=>{//遍历 转换成数组
            //并不是所有的三级分类都会有动态参数 可能为空字符串 这样v-for会报错  所以要进行条件判断  trim()去掉字符串两端空格 split 分割成数组
            item.attr_vals = item.attr_vals.length === 0 ? [] :item.attr_vals.trim().split(',')
        })

      }
    },
    //级联选择器 change事件触发的方法
    handleChange() {},
    //页面进来就加载 级联选择器
    async myCascader() {
      const res = await this.$http.get(`categories?type=3`);
      console.log(res, 111);
      const {
        data,
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        //获取数据源
        this.options = data;
        // this.$message.success(msg);
      } else {
        this.$message.warning(msg);
      }
    }
  }
};
</script>

<style>
.addGoodInfoAlert {
  margin-top: 16px;
}
.addGoodsStep {
  margin: 20px 0;
}
</style>
