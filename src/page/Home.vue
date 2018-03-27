/**
* Created by Administrator on 2017/12/17.
 */

<template>
  <el-container class="afly-wrapper">
    <el-header class="afly-header">
      <nav-header></nav-header>
    </el-header>
    <el-container class="afly-index-top"></el-container>
    <el-container class="afly-index-body afly-layout">
      <el-main class="afly-main">
        <list v-bind:list="list"></list>
        <list v-bind:pager="pager" v-show="pager.pageCount>1"></list>
        <el-button type="primary">asd</el-button>
      </el-main>
      <el-aside class="afly-slidebar">
        <div class="afly-wedget">
          <h4 class="afly-wedget-title clearfix" slot="header">关注我</h4>
          <el-row class="afly-wedget-content afly-wedget-me">
            <el-col :span="6"><a class="block tel" href="javascript:void(0);" title="保密">我的电话</a></el-col>
            <el-col :span="6"><a class="email" href="mailto:admin@admin.com" target="_blank">我的邮箱</a></el-col>
            <el-col :span="6"><a class="qq" href="javascript:void(0);" title="11360431">我的QQ</a></el-col>
            <el-col :span="6"><a class="prize" href="https://github.com/loveyedie">github</a></el-col>
          </el-row>
        </div>
        <!--推荐图文-->
        <div class="afly-wedget">
          <div class="afly-wedget-title clearfix" slot="header">推荐图文</div>
          <el-row class="afly-wedget-content">

          </el-row>
        </div>
        <!--排行榜-->
        <div class="afly-wedget">
          <div class="afly-wedget-title clearfix" slot="header">热门排行</div>
          <el-row class="afly-wedget-content">

          </el-row>
        </div>
      </el-aside>
    </el-container>
    <el-container class="afly-index-bottom"></el-container>
    <el-footer class="afly-footer"></el-footer>
  </el-container>

</template>
<script>

  import fetch from "../fetch/http";
  import ApiSetting from "../fetch/apiSetting";
  import NavHeader from "../components/NavHeader.vue";
  import NavFooter from "../components/NavFooter.vue";
  import List from "./homeComponent/List.vue";
  import NavPager from "../components/NavPager.vue";

  export default{
      data(){
        return {
          name:'梅落残雪',
          list:[],
          pager:{}
        };
      },
      components: {
        NavHeader,
        List,
        NavPager,
        NavFooter
      },
      mounted(){
          fetch(ApiSetting.getPostList,{catId:'',p:''}).then((res) => {
              console.log(res);
              this.list = res.articles;
              this.pager = {
                page:res.page,
                pageArr:res.pageArr,
                pageCount:res.pageCount,
                pageUrl:res.pageUrl,
                count:res.count
              }
          }).catch(err => {
              console.log(err);
          })
      }
  }
</script>
