<template>
    <el-card>
        <my-bread level1="商品管理" level2="分类参数"></my-bread>
        <el-alert title="只允许为第三级分类设置参数" type="error" class="paransAlert">
        </el-alert>
        <!-- 级联选择器 -->
        <el-form label-position="left" label-width="80px">
            <el-form-item label="商品名称">
                <!-- 级联选择器 el-cascader 
                    表单元素 :options 数据源[] 
                    v-model[]value类型为数组，指选择最终选择的label对应的value值 会放在此v-model对应的value数组中 
                    :props={} 为一个对象 需要内置的三个属性 label value children-->
                <el-cascader expand-trigger="hover" v-model="selectedOptions" :options="options" :props="defaultProps"
                    :show-all-levels="false" @change="handleChange" clearable>
                </el-cascader>
            </el-form-item>
        </el-form>
        <!-- 动态参数 静态参数选项卡 -->
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane label="动态参数" name="1">
                <el-button type="danger">设置动态参数</el-button>
                <el-table :data="arrDtParams" style="width: 100%">
                    <el-table-column type="expand" align="center" label="#" width="100">
                        <template slot-scope="scope">
                            <!-- 添加动态 Tag标签 并且遍历得出长度 -->
                            <el-tag :key="tag" v-for="tag in scope.row.attr_vals" closable :disable-transitions="false"
                                @close="handleClose(scope.row,tag)">
                                {{tag}}
                            </el-tag>
                            <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput"
                                size="small" @keyup.enter.native="handleInputConfirm(scope.row)"
                                @blur="handleInputConfirm(scope.row)">
                            </el-input>
                            <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag
                            </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column label="属性名称" align="center" prop="attr_name" width="300">
                    </el-table-column>
                    <el-table-column label="操作" align="center">
                        <template slot-scope="scope">
                            <el-button size="mini" plain type="primary" icon="el-icon-edit"
                                @click="showEditUserMsgBox(scope.row)" circle></el-button>
                            <el-button size="mini" plain type="danger" icon="el-icon-delete"
                                @click="showDelUserMsgBox(scope.row.id)" circle></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="静态参数" name="2">
                <el-button type="danger">设置静态参数</el-button>
                <el-table :data="arrStaticParams" style="width: 100%">
                    <el-table-column type="index" align="center" label="#" width="100">
                    </el-table-column>
                    <el-table-column label="属性名称" align="center" prop="attr_name" width="300">
                    </el-table-column>
                    <el-table-column label="属性值" align="center" prop="attr_vals" width="300">
                    </el-table-column>
                    <el-table-column label="操作" align="center">
                        <template slot-scope="scope">
                            <el-button size="mini" plain type="primary" icon="el-icon-edit"
                                @click="showEditUserMsgBox(scope.row)" circle></el-button>
                            <el-button size="mini" plain type="danger" icon="el-icon-delete"
                                @click="showDelUserMsgBox(scope.row.id)" circle></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>
    </el-card>
</template>

<script>
    export default {
        data() {
            return {
                selectedOptions: [], //默认显示哪一项 初始值  可以不要
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
                activeName: '1',
                //对于el-tag所需要数据
                inputVisible: false,
                inputValue: ''
            }
        },
        created() {
            //获取三级列表数据
            this.myCascader();
        },
        methods: {
            //公共方法 el-tag 请求更新标签 包括删除、添加
            async publicPutTag(row) {
                let putData = {//请求体
                    attr_name: row.attr_name,
                    attr_sel: 'many',
                    attr_vals: row.attr_vals.join(',') //这里注意 传进去的参数是字符串类型 逗号分隔
                }
                const res = await this.$http.put(`categories/${this.selectedOptions[2]}/attributes/${row.attr_id}`, putData)
                const { data, meta: { msg, status } } = res.data
                if (status === 200) {
                    return
                } else {
                    this.$message.warning(msg)
                }
            },
            //当点击关闭 el-tag标签时  并且调取后台节后 做到实时更新数据 categories/:id/attributes/:attrId  id为分类 ID  attrId 属性 ID
            handleClose(row, tag) {
                row.attr_vals.splice(row.attr_vals.indexOf(tag), 1);
                this.publicPutTag(row)
            },
            //点击新增加el-tag按钮时 触发   此时按钮隐藏 input输入框显示 且自动聚焦
            showInput() {
                this.inputVisible = true;
                this.$nextTick(_ => {
                    this.$refs.saveTagInput.$refs.input.focus();
                });
            },
            //当在输入框input内点击回车按钮或者失去input焦点时触发
            handleInputConfirm(row) {
                let inputValue = this.inputValue;
                if (inputValue) {
                    row.attr_vals.push(inputValue);
                    //当inputValue值存在的时候 需要发送请求进后台
                    this.publicPutTag(row)
                }
                this.inputVisible = false;
                this.inputValue = '';
            },
            // tab2/3 公共判断部分
            publicSelLengh() {
                if (this.selectedOptions.length !== 3) {
                    //保证此时已经选了三级分类
                    this.$message.warning("请先选择商品的三级分类");
                    return; //阻止代码继续向下执行
                }
            },
            //点击选项卡 tab切换时 触发的事件
            async handleClick() {
                // activeName
                if (this.activeName === '2') {
                    this.publicSelLengh.call(this)
                    //当 selectedOptions.length === 3时 调取接口 渲染静态数据
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
                }
            },
            //   ！！！！！！！！！！！注意这里有点bug
            //级联选择器 改变label时触发的事件 请求后台数据 获取动态/静态参数
            async handleChange() {
                //提出去的公共部分 只有当用户选择了级联选择器的第三级参数时才会触发调取
                this.publicSelLengh.call(this);
                if(this.activeName === '1'){
                    // 否则请求接口 参数列表  :id 分类ID(最后一级的分类id)  many指的是获取动态参数
                //selectedOptions[2] 指的是 分类ID--->(最后一级的分类id)
                const res = await this.$http.get(
                    `categories/${this.selectedOptions[2]}/attributes?sel=many`
                );
                console.log(res, 222);
                //取出商品的动态参数[]数组 attr_name->label  attr_vals -> 值 类型为字符串类型
                this.arrDtParams = res.data.data;
                this.arrDtParams.forEach(item => {
                    //遍历 转换成数组 因为attr_vals是一个字符串 提前遍历转为数组
                    //并不是所有的三级分类都会有动态参数 可能为空字符串 这样v-for会报错  所以要进行条件判断  trim()去掉字符串两端空格 split 分割成数组
                    item.attr_vals =
                        item.attr_vals.length === 0 ? [] : item.attr_vals.trim().split(",");
                });
                console.log(this.arrDtParams, 666)
                }else if(this.activeName === '2'){
                    //请求静态参数
                    const res = await this.$http.get(
                    `categories/${this.selectedOptions[2]}/attributes?sel=only`
                );
                console.log(res, 222);
                //这里就不再加 过多的判断了  自己知道就好
                this.arrStaticParams = data;
                }
            },
            // 当页面组建加载进来 获取级联选择器的数据
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
        },
    }
</script>

<style>
    .paransAlert {
        margin: 20px 0
    }

    .el-tag+.el-tag {
        margin-left: 10px;
    }

    .button-new-tag {
        margin-left: 10px;
        height: 32px;
        line-height: 30px;
        padding-top: 0;
        padding-bottom: 0;
    }

    .input-new-tag {
        width: 90px;
        margin-left: 10px;
        vertical-align: bottom;
    }
</style>