<template>
  <el-card>
    <!-- 引入自定义面包屑组件 -->
    <my-bread level1="权限管理" level2="角色列表"></my-bread>
    <el-row>
      <el-col>
        <el-button type="info" class="addRoleBtn">添加角色</el-button>
      </el-col>
    </el-row>
    <!-- 显示角色列表 -> 表格内容 -->
    <el-table :data="roleLists" class="role_table" style="width: 100%">
      <!-- 设置 展开内容 -->
      <el-table-column type="expand" width="30">
        <!-- 通过设置 type="expand" 和 Scoped slot 可以开启展开行功能，el-table-column 的模板会被渲染成为展开行的内容，展开行可访问的属性与使用自定义列模板时的 Scoped slot 相同。 -->
        <!-- 视图中出现行列布局 则通过 for循环嵌套el-tag标签 外层控制行数 内层控制列数 -->
        <template slot-scope="scope">
          <!-- 一级权限 v-for遍历最外层的el-row -->
          <el-row class="firstAuth" v-for="(item1,index1) in scope.row.children" :key="index1">
            <el-col :span="4">
              <!-- 第一级是管理权限 -->
              <el-tag @close="delRole(scope.row,item1.id)" closable>{{item1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <el-row class="secondAuth" v-for="(item2,index2) in item1.children" :key="index2">
                <!-- 遍历二级权限el-row -->
                <el-col :span="4">
                  <el-tag
                    @close="delRole(scope.row,item2.id)"
                    closable
                    type="success"
                  >{{item2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="20">
                  <el-tag
                    @close="delRole(scope.row,item3.id)"
                    class="thirdAuth"
                    closable
                    type="warning"
                    v-for="(item3,index3) in item2.children"
                    :key="index3"
                  >{{item3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <!-- 当点击进来的用户 无权限 则给出提示信息 -->
          <span v-if="scope.row.children.length === 0">当前用户未分配权限</span>
        </template>
      </el-table-column>
      <el-table-column type="index" label="#" width="80"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="200"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述" width="300"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            plain
            type="primary"
            icon="el-icon-edit"
            @click="showEditUserMsgBox(scope.row)"
            circle
          ></el-button>
          <el-button
            size="mini"
            plain
            type="danger"
            icon="el-icon-delete"
            @click="showDelUserMsgBox(scope.row.id)"
            circle
          ></el-button>
          <!-- 点击弹出全部权限的dialog 设置当前角色权限 -->
          <el-button
            size="mini"
            plain
            type="success"
            icon="el-icon-check"
            circle
            @click="showSetRightDiag(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- showSetRightDiag展示设置用户权限对话框  -->
    <el-dialog title="修改权限" :visible.sync="dialogSetRight">
      <!-- 树形结构
        data数据源  show-checkbox选择框 node-key每个节点的唯一标识 通常为data数据源中的id
        default-expanded-keys 默认展开【要展开节点的key->id】
        default-checked-keys 默认选择的【要选择节点的key->id】
        props配置项 {label,children} label节点的文字标题 children节点的子节点所在容器数组
        它们的值都来源于data绑定的数据源中该数据的key名 'label' 和 'children'
        :default-expanded-keys 将所有节点默认全都展开 那么需要将全部id组成一个数组对象
        :default-checked-keys="[5]"
        :default-expanded-keys="arrExpandId"
        default-expand-all 是否默认展开所有节点 默认为false
      -->
      <el-tree
        :data="treeLists"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="arrCheckId"
        :props="defaultProps"
        ref="tree"
      ></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogSetRight = false">取 消</el-button>
        <!-- 当点击确定的时候 将数据提交后台 并关闭dialog 更新视图 -->
        <el-button type="primary" @click="confirmEditRole()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      roleLists: [], //第一层为角色信息 第二层开始为权限说明，权限一共有 3 层权限
      dialogSetRight: false,
      treeLists: [],
      defaultProps: {
        children: "children",
        label: "authName"
      },
      arrExpandId: [],
      arrCheckId: [],
      currRoleId: -1
    };
  },
  created() {
    this.myRoleList();
  },
  methods: {
    //当点击确认按钮后 提交数据 关闭dialog 更新对话框  
    async confirmEditRole() {
        this.dialogSetRight = false
        //当点击确认按钮时触发 并且通过el-treeDOM元素的内置方法 来获取此时全选 半选的id
        //获取全选id的数组，getCheckedKeys()返回目前被选中(全选)的节点的key所组成的数组
        let arr1 = this.$refs.tree.getCheckedKeys() 
        //获取半选id的数组， getHalfCheckedKeys()返回当前半选中节点的key所组成的数组
        let arr2 = this.$refs.tree.getHalfCheckedKeys() 
        //使用ES6 扩展运算符 可以合并 数组/对象
        let arr = [...arr1,...arr2]
        //roles/:roleId/rights   roleId为当前要修改权限的角色id rids请求参数 权限ID列表，包括全选id和半选id ','分割的字符串
        const res = await this.$http.post(`roles/${this.currRoleId}/rights`,{rids:arr.join(',')})
        if(res.data.meta.status === 200){
            this.$message.success(res.data.meta.msg)
            //并更新渲染视图
            this.myRoleList()
        }else{
            this.$message.warning(res.data.meta.msg)
        }
        // console.log(res,7788)
    },
    //check按钮 弹出dialog 设置用户权限 并从后台调取所有权限列表的【tree树形】数据
    async showSetRightDiag(role) {
      //弹出dialog后 获取当前弹出的角色id
      this.currRoleId = role.id;
      this.dialogSetRight = true;
      const res = await this.$http.get(`rights/tree`);
      console.log(res, 321);
      //注意：res里 每一个子对象中的pid 皆指向父对象的id值 意味着节点之间的归属嵌套
      //从后台获取 当前选中的角色对象 并取出已经存在的节点id
    //   console.log(role, 777);
      let arrTempCheckId = [];
      role.children.forEach(item1 => {
        //这里注意 因为如果最外层如果有id 那么内层的没有选择的也将会自动勾选上 存在bug 所以push(id) 仅需要push进最内层的id值即可 最内层id提取 外层会自动勾选的
        item1.children.map(item2 => {
          item2.children.forEach(item3 => arrTempCheckId.push(item3.id));
        });
      });
      this.arrCheckId = arrTempCheckId;
      const {
        data,
        meta: { msg, status }
      } = res.data;
      //    console.log(data, 321);
      if (status === 200) {
        this.$message.success(msg);
        this.treeLists = data; //将后台传来的tree类型数据取出 绑定数据
        //default-expand-all 是否默认展开所有节点 有这个属性 就不需要一个个遍历id添加了
        //为了获取:default-expanded-keys对应的id数组 默认展开全部 需要将所有id存进数组内
        // let arrTempId = []
        // this.treeLists.map(ele=>{
        //     arrTempId.push(ele.id)
        //     ele.children.forEach(value=>{
        //         arrTempId.push(value.id)
        //         value.children.map(result => arrTempId.push(result.id))
        //     })
        // })
        // console.log(arrTempId,2322)
        // this.arrExpandId = arrTempId
      } else {
        this.$message.warning(msg);
      }
    },
    // 删除当前用户所在的某一（类）权限 delete--> roles/:roleId/rights/:rightId
    // role 当前角色  rightId 权限id
    async delRole(role, rightId) {
      const res = await this.$http.delete(`roles/${role.id}/rights/${rightId}`);
      console.log(res, 222);
      // 取消所选的权限后  这个解构赋值中的data 指的是当前用户删除权限后所剩余的权限
      const {
        data,
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        this.$message.success(msg);
        role.children = data; //这里指 当删除权限后 仍旧在当前页面进行重新渲染剩余权限
      } else {
        this.$message.warning(msg);
      }
    },
    //用户进入角色列表后 调取渲染数据接口
    async myRoleList() {
      const res = await this.$http.get(`roles`);
      console.log(res, 111);
      const {
        data,
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        // this.$message.success(msg);
        this.roleLists = data;
      } else {
        this.$message.warning(msg);
      }
    }
  }
};
</script>

<style>
.addRoleBtn {
  margin: 20px 0;
}
.role_table .is-leaf,
.role_table .el-table__row > td {
  text-align: center;
}
.firstAuth,
.secondAuth,
.thirdAuth {
  margin-bottom: 8px;
}
.thirdAuth {
  margin-right: 8px;
}
</style>
