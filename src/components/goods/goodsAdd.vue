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
    <el-form label-position="top" label-width="80px" :model="addGoodForm" style="height:400px;overflow:auto">
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
            :show-all-levels="false"
            expand-trigger="hover" 
            v-model="selectedOptions" 
            :options="options" 
            :props="defaultProps" 
            @change="handleChange" 
            clearable>
            </el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="2" label="商品参数">
          <!-- 显示的是该三级分类的商品参数 -->
          <!-- 这个是 label input头 -->
          <el-form-item :label="item1.attr_name" v-for="(item1,i) in arrDtParams" :key="i">
            <!-- 这里v-model 绑定的是label选中的组成的数组 因为在请求数据后attr_vals已经转换成数组 所以刚好符合这里参数为数组的要求-->
            <el-checkbox-group v-model="item1.attr_vals">
              <!-- 每一组复选框 -->
              <el-checkbox border :label="item2" v-for="(item2,i) in item1.attr_vals" :key="i"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="3" label="商品属性">
          <!-- 静态 商品属性参数 -->
          <el-form-item :label="item.attr_name" v-for="(item,index) in arrStaticParams" :key="index">
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="4" label="商品图片">
          <!-- 图片上传 -->
          <el-form-item>
            <!-- 
                action 上传文件的http开头请求的全路径  
                headers 请求头 因为除了登录之外等需要进行后台权限token验证 否则不放
                这里还需设置请求头 因为之前头部设置是给axios发起请求设置的 包括baseURL一样
            -->
            <el-upload :headers="uploadHeader" action="http://47.97.214.102:8888/api/private/v1/upload"
              :on-preview="handlePreview" :on-remove="handleRemove" :on-success="handleSuccess" list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="5" label="商品内容">
          <el-form-item>
            <el-button type="primary" @click="addGoods">添加商品</el-button>
            <!-- v-model绑定数据 传递给后台的参数 -->
            <quill-editor v-model="addGoodForm.goods_introduce" class="quillEditor"></quill-editor>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </el-card>
</template>

<script>
  /* 引入富文本编辑器包 */
  import "quill/dist/quill.core.css";
  import "quill/dist/quill.snow.css";
  import "quill/dist/quill.bubble.css";
  import { quillEditor } from "vue-quill-editor";
  export default {
    data() {
      return {
        /* goods_name	商品名称	不能为空
          goods_price	价格	不能为空
          goods_number	数量	不能为空
          goods_weight	重量	不能为空
          goods_introduce	介绍	可以为空 这个就是富文本编译器相关联的数据  内容介绍
          下面三组数据需要处理
          pics	上传的图片临时路径（对象）可以为空  pics是数组 [{pic:图片临时路径}]
          attrs 商品的参数（数组） 是指商品的动态参数和静态参数合在一起组成的数组数据 
          goods_cat 以为','分割的分类列表(字符串)不能为空 ->级联选择器绑定的selectedOptions
          */
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
          pics: [], //请求参数是数组类型  里面每个图片对象内部 都携带着图片的临时路径
          attrs: []
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
        //获取商品的静态参数 数据源  数组
        arrStaticParams: [],
        //图片上传时 请求头信息
        uploadHeader: {
          Authorization: localStorage.getItem("token")
        }
      };
    },
    components: {
      quillEditor
    },
    created() {
      this.myCascader();
      if (this.$route.query.id) {
        this.getEditGoodData(this.$route.query.id)
      }
    },
    methods: {
      //当用户点击商品编辑按钮时 调取数据  根据商品id查询商品  goods/:id
      async getEditGoodData(id) {
        const res = await this.$http.get(`goods/${id}`)
        console.log(res, 777)
        const { data, meta: { msg, status } } = res.data
        if (status === 200) {
          this.$message.success(msg)
          this.addGoodForm = data
          //在这里注意 要进行那三个变量数据的转换
          // 获取goods_cat  
          this.selectedOptions = this.addGoodForm.goods_cat.split(',')
          this.selectedOptions = this.selectedOptions.map(item=>{
            return item*1   //需要将字符串转为数字
          })
          // 获取 pics
          // this.addGoodForm.pics

        } else {
          this.$message.warning(msg)
        }
      },
      //点击添加商品按钮时 提交数据
      async addGoods() {
        //goods_cat 以为','分割的分类列表--字符串
        this.addGoodForm.goods_cat = this.selectedOptions.join(',')
        //pics pics是数组 [{pic:图片临时路径}]  在handleRemove handleSuccess中已经处理好
        //对于attrs 商品的静态参数和动态参数组成的数组集合的处理
        //每一个商品静态/动态参数的请求数据格式为 {"attr_id":15,"attr_value":"ddd"} 
        console.log(this.arrDtParams);
        console.log(this.arrStaticParams);
        //获取动态数据参数  map()  遍历数组 并将所获取的对象参数存到数组中 返回值为数组
        let arr1 = this.arrDtParams.map(item => {
          return { "attr_id": item.attr_id, "attr_value": item.attr_vals }
        })
        //获取静态数据参数  map()  遍历数组 并将所获取的对象参数存到数组中
        let arr2 = this.arrStaticParams.map(item => {
          return { "attr_id": item.attr_id, "attr_value": item.attr_vals }
        })
        this.addGoodForm.attrs = [...arr1, ...arr2]
        //再提交数据之前 需要对addGoodForm内的 goods_cat pics attrs 进行赋值操作
        const res = await this.$http.post(`goods`, this.addGoodForm)
        console.log(res, '添加商品提交')
        if (res.data.meta.status === 201) {
          this.$message.success(res.data.meta.msg)
          //成功创建商品后 跳转回商品列表页 进行显示
          // this.$router.push({name:'goods'})
          this.$router.go(-1)
          //这里不用再清除表单的每一个数据，因为本身添加商品跳转的就是一个新的组件 所有的数据均是初始化 均没有赋值
        } else {
          this.$message.warning(res.data.meta.msg)
        }
      },
      // 文件上传 用到的相关方法
      // handlePreview   handleRemove关闭移除图片时触发 handleSuccess上传临时图片成功时触发
      handlePreview(file) {
        console.log(file, 111);
      },
      handleRemove(file) {
        //属性 file.response.data.tmp_path 指的是 移除图片上传时候的临时路径
        //findIndex(()=>{回调}) 遍历数组 把符合条件的元素索引进行返回  并声明一个变量进行接收
        console.log(file, 222);
        let index = this.addGoodForm.pics.findIndex(item => {
          return file.response.data.tmp_path === item.pic
        })
        // console.log(index,'index')
        //删除一个图片数据后 对addGoodForm中期pics图片数据源的变化
        this.addGoodForm.pics.splice(index, 1)
      },
      handleSuccess(file) {
        //属性file.data.tmp_path指的是图片上传时候的临时路径 拿到传给后台图片所在的临时路径
        //这里传上不是真正上传 真正上传还需提交表单才可 这里仅暂时保存到后台服务器的临时文件
        // console.log(file, 333);
        this.addGoodForm.pics.push({
          //上传成功后 将数据push进数组 等待表单的最后提交
          pic: file.data.tmp_path
        })
      },
      // tab2/3 公共判断部分
      publicSelLengh() {
        if (this.selectedOptions.length !== 3) {
          //保证此时已经选了三级分类
          this.$message.warning("请先选择商品的三级分类");
          return; //阻止代码继续向下执行
        }
      },
      //当tab切换时 当点击的是第2个 tab时，且此时第一个tab中已经选了三级分类 有值的前提下
      async tabChange() {
        if (this.activeTab === "2") {
          //提出去的公共部分
          this.publicSelLengh.call(this);
          // 否则请求接口 参数列表  :id 分类ID(最后一级的分类id)  many指的是获取动态参数
          //selectedOptions[2] 指的是 分类ID--->(最后一级的分类id)
          const res = await this.$http.get(
            `categories/${this.selectedOptions[2]}/attributes?sel=many`
          );
          // console.log(res, 222);
          //取出商品的动态参数[]数组 attr_name->label  attr_vals -> 值 类型为字符串类型
          this.arrDtParams = res.data.data;
          this.arrDtParams.forEach(item => {
            //遍历 转换成数组
            //并不是所有的三级分类都会有动态参数 可能为空字符串 这样v-for会报错  所以要进行条件判断  trim()去掉字符串两端空格 split 分割成数组
            item.attr_vals =
              item.attr_vals.length === 0 ? [] : item.attr_vals.trim().split(",");
          });
        } else if (this.activeTab === "3") {
          //获取第三个tab页的 静态参数
          //这里也是需要判断 必须在第一个tab中 已经选择好了三级分类 否则警告提示
          //将公共判断部分封装一个方法 提出去
          this.publicSelLengh.call(this);
          const res = await this.$http.get(
            `categories/${this.selectedOptions[2]}/attributes?sel=only`
          );
          const {
            data,
            meta: { msg, status }
          } = res.data;
          if (status === 200) {
            //   this.$message.success(msg);
            this.arrStaticParams = data;
          } else {
            this.$message.warning(msg);
          }
          // console.log(res, 333);
        }
      },
      //级联选择器 change事件触发的方法
      handleChange() { },
      //页面进来就加载 级联选择器
      async myCascader() {
        const res = await this.$http.get(`categories?type=3`);
        //   console.log(res, 111);
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

  .quillEditor {
    margin-top: 20px;
  }

  .ql-editor {
    min-height: 300px;
    /* 当高度超出的时候 自动增加 */
  }
</style>