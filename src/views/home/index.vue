<template>
  <div class="afly-router-home">
    <div class="afly-index-top"></div>
    <el-row class="afly-index-body afly-layout">
      <el-col :span="16" class="afly-main">
        <post-list v-bind:list="list"></post-list>
      </el-col>
      <el-col :span="8" class="afly-slidebar">
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
          <el-row class="afly-wedget-content"></el-row>
        </div>
      </el-col>
    </el-row>
    <div class="afly-index-bottom"></div>
  </div>
</template>
<script>
import { getPostList } from "../../api/home";
import NavHeader from "../../components/front/NavHeader.vue";
import NavFooter from "../../components/front/NavFooter.vue";
import PostList from "./component/postList.vue";
import NavPager from "../../components/front/NavPager.vue";

export default {
  data() {
    return {
      name: "梅落残雪",
      list: [],
      pager: {}
    };
  },
  components: {
    NavHeader,
    PostList,
    NavPager,
    NavFooter
  },
  mounted() {
    getPostList({ catId: "", p: "" }).then((res) => {
        console.log(res);
        this.list = res.articles;
        this.pager = {
          page: res.page,
          pageArr: res.pageArr,
          pageCount: res.pageCount,
          pageUrl: res.pageUrl,
          count: res.count
        };
      })
      .catch(err => {
        console.log(err);
      });
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .afly-router-home{margin-top: 20px;}
  .afly-index-body{
    background: #e5e5e5;
    overflow: hidden;
    width: 1000px;
    min-height: 600px;
    margin: auto;
    border-left: #d2d2d2 1px solid;
    border-right: #d2d2d2 1px solid;
  }
  .afly-main{
    min-height: 600px;
  }
  .afly-wedget{
    a{
      color: #333;
    }
    .up{color: #600;}
  }

  .afly-wedget-me a{
    display: inline-block;
    color: #747F8C;
    width: 62px;
    text-align: center;
    padding-top: 60px;
    font-size: 14px;
    &:hover{
      opacity: 0.6;
      text-decoration: none;
    }
  }

  .afly-wedget-recomment{
    margin-left: 10px;
  }

  .afly-label-cat a{
    color: #999;
    &:hover{color: #066;}
  }
  .afly-wedget-toppost{
    margin-left: 10px;
  }
  .afly-link-toppost{
    padding-left: 10px;
  }
</style>
