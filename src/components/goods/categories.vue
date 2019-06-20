<template>
    <el-card>
        <!-- 商品分类 -->
        <my-bread level1="商品管理" level2="商品分类"></my-bread>
        <el-button type="success" class="addExtraCate" @click="addCategory()">添加分类</el-button>
        <!-- 表格 -->
        <el-table :data="list" style="width: 100%" height='400' stripe>
            <!-- <el-table-column prop="cat_name" label="分类名称" width='280'>
            </el-table-column>  这个不支持树形结构控件-->
            <!--
                因为element-ui中没有实现树形结构控件的组件 所以需要额外引入elementui table插件 
                将单元格变为 -> 树形结构 -> el-table（原生不支持） -> elementui table插件
                插件名 element-tree-grid -> 增强了el-table的单元格
            -->
            <!-- 
                treeKey ->相当于树形组件中的 nodekey -> 节点唯一标识 id
                parentKey  -> 父节点的id
                levelKey -> 当前节点的级别   层级
                childKey -> 当前节点子节点的key id
             -->
            <el-tree-grid prop="cat_name" label="分类名称" width='280' treeKey='cat_id' parentKey='cat_pid'
                levelKey='cat_level' childKey='children'>
            </el-tree-grid>
            <el-table-column prop="cat_level" label="级别" width='180'>
                <template slot-scope="scope">
                    <span v-if="scope.row.cat_level === 0">一级</span>
                    <span v-else-if="scope.row.cat_level === 1">二级</span>
                    <span v-else="scope.row.cat_level === 2">三级</span>
                </template>
            </el-table-column>
            <el-table-column prop="cat_deleted" label="是否有效" align='center' width='380'>
                <template slot-scope="scope">
                    <span v-if="scope.row.cat_deleted === false">有效</span>
                    <span v-else="scope.row.cat_deleted === true">无效</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align='center'>
                <template slot-scope='scope'>
                    <el-button size="mini" plain type="primary" icon="el-icon-edit"
                        @click="showEditCateMsgBox(scope.row)" circle></el-button>
                    <el-button size="mini" plain type="danger" icon="el-icon-delete"
                        @click="showDelCateMsgBox(scope.row.cat_id)" circle></el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination class="catePage" @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="pagenum" :page-sizes="[4, 8, 12, 16]" :page-size="pagesize"
            layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
        <!-- 添加分类 dialog -->
        <el-dialog title="添加分类" :visible.sync="dialogAddCateVisible" label-width="120">
            <el-form :model="addForm" label-width="100px">
                <el-form-item label="分类名称">
                    <el-input v-model="addForm.cat_name" autocomplete="off" width='200'></el-input>
                </el-form-item>
                <!-- 这里只需要最多选到二级分类即可 默认不选的话是添加进一级分类里
                    选一个一级分类 则是将分类名称添加进二级分类里
                    选二级分类后 则是将分类名称添加进三级分类里
                    不能给三级分类的子级添加四级分类
                -->
                <el-form-item label="选择分类" >
                    <el-cascader v-model="selectedOptions" expandTrigger='hover' :options="caslist" :props="defaultProps" change-on-select  @change="handleChange"  clearable></el-cascader>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogAddCateVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmAddCate">确 定</el-button>
            </div>
        </el-dialog>
    </el-card>
</template>

<script>
    // 组件局部引入 element-tree-grid
    var ElTreeGrid = require('element-tree-grid');
    export default {
        components: {
            ElTreeGrid
        },
        data() {
            return {
                list: [],//表格绑定数据
                pagenum: 1,
                pagesize: 4,
                total: 1,
                // 添加数据 dialog框
                addForm: {
                    cat_pid: -1,//需要处理
                    cat_name: '',//不需处理 已双向数据绑定
                    cat_level: -1  //需要处理
                },
                //级联选择器要用的数据
                // 即每一级分类列表的 cat_id组成的数组集合  例如[1,3,8]
                selectedOptions: [], //默认数据  默认显示哪一项 初始值  可以不要
                caslist: [], //数据源
                defaultProps: {
                    label: "cat_name",
                    value: "cat_id",
                    children: "children"
                },
                dialogAddCateVisible: false,

            }
        },
        created() {
            this.getCategoryList()
        },
        methods: {
            //当点击编辑按钮时 弹出Add dialog  并且有数据渲染在上面
            async showEditCateMsgBox(row){
                this.dialogAddCateVisible = true
                //其实每次点击编辑的时候都需要向后台请求数据 获取当前编辑所在数据 防止在之前用户修改数据后点击了取消 导致表单内数据已经被修改了
                const res = await this.$http.get(`categories/${row.cat_id}`)
                console.log(res,111222)
                const {data,meta:{msg,status}} = res.data
                if(status === 200){
                    this.addForm = data
                    // 这里写不下去了 按理来说需要一个弹出编辑的的dialog 不然在同时与add dialog操作同一个时 需要加判断
                }else{
                    this.$message.warning(msg)
                }
                //获取级联选择器上的数据
                const res1 = await this.$http.get(`categories?type=2`);
                this.caslist = res1.data.data;

            },
            //根据cat_id 删除当前分类
            async showDelCateMsgBox(cat_id){
                const res = await this.$http.delete(`categories/${cat_id}`)
                if(res.data.meta.status === 200){
                    this.$message.success(res.data.meta.msg)
                    this.getCategoryList()
                }
            },
            //点击确定按钮 添加分类 发起请求 请求体为 addForm 要处理数据cat_pid和cat_level 这里的cat_pid就跟父cat_id 相同，
            // 三种情况 一级分类 selectedOptions.length = 0  cat_pid 0   cat_level 0 
            // 三种情况 二级分类 selectedOptions.length = 1  cat_pid selectedOptions[0]  cat_level 1 
            // 三种情况 三级分类 selectedOptions.length = 2  cat_pid selectedOptions[1] cat_level 2 
            async confirmAddCate(){
                this.dialogAddCateVisible = false
                if(this.selectedOptions.length === 0){
                    this.addForm.cat_pid = 0
                    this.addForm.cat_level = 0
                }else if(this.selectedOptions.length === 1){ 
                    this.addForm.cat_pid = this.selectedOptions[0]
                    this.addForm.cat_level = 1
                }else{ //此时划归为三级分类
                    this.addForm.cat_pid = this.selectedOptions[1]
                    this.addForm.cat_level = 2
                }
                const res = await this.$http.post(`categories`,this.addForm)
                console.log(res,999)
                const {data,meta:{msg,status}} = res.data
                if(status === 201){
                    this.$message.success(msg)
                    //再重新刷新试图
                    this.pagenum = 1
                    this.getCategoryList()
                    //清空form
                    this.addForm = {}
                }else{
                    this.$message.warning(msg)
                }
            },
            //级联选择器 发生改变时 触发的方法
             handleChange(){
               
            },
            //点击添加分类按钮 弹出dialog窗口  并且获取级联选择器的二级分类
            async addCategory() {
                this.dialogAddCateVisible = true

                const res = await this.$http.get(`categories?type=2`);
                //   console.log(res, 111);
                const {
                    data,
                    meta: { msg, status }
                } = res.data;
                if (status === 200) {
                    //获取二级分类数据源
                    this.caslist = data;
                    console.log(data,7766)
                    // this.$message.success(msg);
                } else {
                    this.$message.warning(msg);
                }
            },
            //用户进来后自动获取
            async getCategoryList() {
                const res = await this.$http.get(`categories?type=3&pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
                // console.log(res, 111)
                const { meta: { status, msg }, data: { result, total } } = res.data
                if (status === 200) {
                    this.list = result
                    // console.log(this.list,8877)
                    this.total = total
                } else {
                    this.$message.warning(msg)
                }
            },
            //分页操作
            handleSizeChange(val) {
                //改变每页显示条数
                // console.log(`每页 ${val} 条`);
                this.pagesize = val;
                //并且无论原先页码是多少 只要切换页内数据量后 都让他从第一页开始展示
                this.pagenum = 1;
                //此方法触发时 要重新从后台获取数据
                this.$nextTick(() => {
                    //延迟加载，在将DOM结构重新加载完成以后再触发
                    this.getCategoryList();
                });
            },
            handleCurrentChange(val) {
                //改变页码
                // console.log(`当前页: ${val}`);
                this.pagenum = val;
                //此方法触发时 要重新从后台获取数据
                this.getCategoryList();
            },
        },
    }
</script>

<style>
    .addExtraCate {
        margin: 20px 0;
    }

    .catePage {
        margin-top: 20px;
    }
</style>