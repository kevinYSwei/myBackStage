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
        <!-- 树形结构 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogSetRight = false">取 消</el-button>
        <el-button type="primary" @click="dialogSetRight = false">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      roleLists: [], //第一层为角色信息 第二层开始为权限说明，权限一共有 3 层权限
      dialogSetRight:false
    };
  },
  created() {
    this.myRoleList();
  },
  methods: {
    //check按钮 设置用户权限 dialog
    showSetRightDiag() {
        this.dialogSetRight = true
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
        this.$message.success(msg);
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
