<template>
    <el-card>
        <my-bread class="orderBread" level1="订单管理" level2="订单列表"></my-bread>
        <!-- 表格 -->
        <el-table :data="ordersList" style="width: 100%">
            <el-table-column type="index" label="#" width="80">
            </el-table-column>
            <el-table-column prop="order_number" label="订单编号" width="220">
            </el-table-column>
            <el-table-column prop="order_price" label="订单价格" align='center'>
            </el-table-column>
            <el-table-column label="是否付款" width="120">
                <!-- 判断是否付款 1 0 -->
                <template slot-scope="scope">
                    <el-button v-if="scope.row.pay_status === 1" type="primary" plain size="mini">已付款</el-button>
                    <el-button v-else type="danger" plain size="mini">未付款</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="is_send" label="是否发货" align='center' width="100">
            </el-table-column>
            <el-table-column label="下单时间" width="180" align='center'>
                <template slot-scope="scope">
                    {{scope.row.create_time | toDate}}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                    <el-button size="mini" plain type="primary" icon="el-icon-edit"
                        @click="showEditOrderMsgBox(scope.row)" circle></el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <!-- 分页 首先需要当前该接口支持分页 url参数中有pagenum pagesize -->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagenum"
            :page-sizes="[8, 16, 24, 32]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper"
            :total="total" class="ordersPage">
        </el-pagination>
        <!-- 点击编辑 弹出修改dialog -->
        <el-dialog title="修改订单地址" :visible.sync="dialogFormVisibleOrder">
            <el-form :model="form" label-width="80px">
                <el-form-item label="省市区">
                    <el-cascader expand-trigger="hover" v-model="selectedOptions" :options="options"
                        :props="defaultProps" :show-all-levels="false" @change="handleChange" clearable>
                    </el-cascader>
                </el-form-item>
                <el-form-item label="详细地址" >
                    <el-input v-model="form.consignee_addr" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleOrder = false">取 消</el-button>
                <el-button type="primary" @click="confirmOrderDia">确 定</el-button>
            </div>
        </el-dialog>
    </el-card>
</template>

<script>
    import options from '@/assets/js/city.js'
    export default {
        data() {
            return {
                ordersList: [],
                //分页相关数据
                total: -1, //总数据条数
                pagenum: 1, //当前页
                pagesize: 8, //每页显示条数,
                //添加用户dialog
                dialogFormVisibleOrder: false,
                //order dialog
                selectedOptions: [], //默认显示哪一项 初始值  可以不要
                options: [], //数据源
                defaultProps: {
                    label: "name",
                    value: "city",
                    children: "city"
                },
                form:{}
            }
        },
        created() {
            this.myOrdersList()
        },
        methods: {
            //点击 dialog确认按钮时   触发更新put 请求数据
            confirmOrderDia(){
                this.dialogFormVisibleOrder = false
            },
            //当点击编辑按钮时 弹出dialog  当然 每次点击这个按钮的时候   最好都向后台请求一次数据 不然会有点击取消但是修改参数未提交 参数也被修改的问题
            showEditOrderMsgBox(row){
                this.dialogFormVisibleOrder = true
                this.options = options
                this.form = row //获取每一个对象的 发货地址  
                //这里获取到的 发货地址 a:7:{s:6:"cgn_id";i:3;s:7:"user_id";i:224;s:8:"cgn_name";s:6:"鸭蛋";s:11:"cgn_address";s:59:"北京市海淀区西三旗建材城西路中腾大厦15室";s:7:"cgn_tel";s:11:"18902564321";s:8:"cgn_code";s:6:"600214";s:11:"delete_time";N;}
                
                console.log(this.form,666)
            },
            handleChange(){

            },
            //页面加载后 获取orders页的数据   响应参数consignee_addr 发货地址
            async myOrdersList() {
                const res = await this.$http.get(`orders?pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
                console.log(res, 88)
                const { data: { goods, total }, meta: { msg, status } } = res.data
                if (status === 200) {
                    this.ordersList = goods
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
                    this.myOrdersList();
                });
            },
            handleCurrentChange(val) {
                //改变页码
                // console.log(`当前页: ${val}`);
                this.pagenum = val;
                //此方法触发时 要重新从后台获取数据
                this.myOrdersList();
            },
        },
    }
</script>

<style>
    .orderBread {
        margin-bottom: 16px;
    }

    .ordersPage {
        margin-top: 20px;
    }
</style>