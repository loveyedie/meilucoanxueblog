<template>
  <header class="afly-header">
    <div class="afly-header-top"></div>
    <div class="afly-layout">
      <div class="afly-logo-box">
        <div class=""><h1>{{siteName}} <small> 路，就在脚下</small></h1></div>
        <div class="afly-search">
          <el-form :inline="true" :model="searchForm">
            <el-form-item label="">
              <el-input v-model="searchForm.keyword" placeholder="输入关键字"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="search" class="btn-black" icon="el-icon-search">搜索</el-button>
            </el-form-item>
          </el-form>

        </div>
        <div class="afly-header-user">
          <div class="afly-none-user" v-if="!token">
            <el-button type="primary" @click="gotoReg" class="btn-black"  icon="el-icon-user">注册</el-button>
            <el-button type="primary" @click="gotoLogin"  class="btn-black" icon="el-icon-user">登录</el-button>
          </div>
          <el-dropdown trigger="click" v-else>
            <el-button class="el-dropdown-link btn-black">
              <img v-bind:src="userpic | toAddFullSrc" class="afly-user-image" alt="User Image">
              <!-- hidden-xs hides the username on small devices so only the image appears. -->
              <span class="afly-user-name">{{ usernick}}</span>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <img v-bind:src="userpic | toAddFullSrc" class="img-circle" alt="User Image">
                <p>{{usernick}} </p>
                <p><small><b>谢谢</b> 加入本站</small></p>
              </el-dropdown-item>
              <el-dropdown-item>
                <div class="text-center small">
                  {{signature}}
                </div></el-dropdown-item>
              <el-dropdown-item>
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-button type="primary" @click="editUser(userid)" class="btn-black" >修改信息</el-button>

                  </el-col>
                  <el-col :span="12">
                    <el-button type="primary" @click="logout"  class="btn-black">退出</el-button>
                  </el-col>
                </el-row>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

        </div>
      </div>


      <nav class="navbar navbar-afly">
        <el-menu default-active="activeIndex" :router="true" text-color="#fff" backgroundColor="transparent" class="el-menu-afly" mode="horizontal">
          <el-menu-item index="/home" class="afly-nav-link" >网站首页</el-menu-item>
          <el-submenu index="/me/" class="afly-nav-link">
            <template slot="title" class="afly-submenu">关于我</template>
            <el-menu-item class="afly-submenu-item" index="/aboutme" >我的简介</el-menu-item>
            <el-menu-item class="afly-submenu-item" index="/home">我的相册</el-menu-item>
          </el-submenu>
          <el-submenu index="/c" class="afly-nav-link" :router="{path:'/'}">
            <template slot="title">我的生活</template>
            <el-menu-item index="/c/">xx</el-menu-item>
          </el-submenu>
          <el-submenu index="4" class="afly-nav-link" :router="{path:'/'}">
            <template slot="title">技术知识</template>
            <el-menu-item index="4-1" :router="{path:'/c'}">xx</el-menu-item>
          </el-submenu>
          <el-menu-item index="5" class="afly-nav-link"><a href="javascript:alert('大爷，不好意思，该板块正在开发！');" class="afly-nav-link">给我留言</a></el-menu-item>
        </el-menu>


      </nav>
    </div>
  </header>
</template>
<script>
import { mapGetters } from "vuex";
import { Message } from 'element-ui'
export default {
  name: "frontNavHeader",
  data() {
    return {
      siteName: "梅落残雪",
      searchForm: {keyword: '123'}
    };
  },
  computed: {...mapGetters(['token', 'userpic', 'userid', 'usernick', 'signature', 'regtime'])},
  components: {},
  mounted() {
      console.dir(mapGetters)
  },
  methods: {
    search(){
      if(this.searchForm.keyword){

      }else{
        Message({message: '请输入关键字'});
      }
    },
    gotoReg(){
      this.$router.push({path:'/reg'});
    },
    gotoLogin(){
      this.$router.push({path:'/login'});
    },
    editUser(userid){
      userid && this.$router.push({path:'/u/'+ userid});
    },
    logout(){
      //this.router.push({path:'/login'});
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.afly-logo-box {
  position: relative;
  padding: 50px 20px 20px;
  small{
    font-size: 16px;
    color: #ccc;
  }
}

/*search*/
.afly-search {
  position: absolute;
  right: 175px;
  top: 30px;
}
.afly-header-user{
  position: absolute;
  top: 30px;
  right: 0;
  width: 165px;
  .afly-user-image{
    display: inline-block;
    vertical-align: middle;
    width: 18px;
  }
  .afly-user-name{vertical-align: middle;color: #fff;}
}
.navbar-afly{ padding-left: 20px;}
.el-menu-afly{
  background: transparent;
  border: none;

  .afly-nav-link{
    color: #fff;
    &:hover{
      background: transparent!important;
    }
    .el-submenu__title:hover{
        background: transparent!important;
    }
  }


  .afly-submenu-item{
    background: #000;
    color: #ccc;
  }


}
.el-submenu__title{
    color: #fff!important;
    &:hover{
      background: transparent!important;
    }
  }
</style>
