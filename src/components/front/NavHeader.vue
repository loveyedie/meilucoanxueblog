/**
* Created by Administrator on 2017/12/17.
 */

<template>
  <header class="afly-header">
    <div class="afly-header-top"></div>
    <div class="afly-layout">
      <div class="afly-logo-box">
        <div class=""><h1>{{siteName}} <small> 路，就在脚下</small></h1></div>
        <div class="afly-search">
          <form id="search-form" class="form-inline" action="/search" method="post">
            <div class="form-group">
              <label for="search" class="sr-only">搜索</label>
              <input type="text" name="keyword" class="form-control input-sm" id="search" v-bind:value="keyword" placeholder="输入关键字">
            </div>
            <button type="submit" class="btn btn-black btn-sm js-search">搜索</button>

            <a role="button" href="/login" class="btn btn-black btn-sm" v-if="!user">登录</a>
            <a href="#" class="btn btn-black btn-sm dropdown-toggle afly-user-btn" v-if="user" data-toggle="dropdown" style="position: relative">
              <!-- The user image in the navbar-->
              <img v-bind:src="user || user.userPic" class="afly-user-image" width="20" alt="User Image">
              <!-- hidden-xs hides the username on small devices so only the image appears. -->
              <span class="">{{user || user.userNick}}</span>
            </a>
            <ul class="dropdown-menu dropdown-menu-right afly-user-drop" v-if="user">
              <!-- The user image in the menu -->
              <li class="user-header">
                <img v-bind:src="user || user.userPic" class="img-circle" alt="User Image">
                <p>{{user || user.userNick}} </p>
                <p><small><b>谢谢</b> 加入本站</small></p>
              </li>
              <!-- Menu Body -->
              <li class="user-body">
                <div class="row">
                  <div class="col-md-12">
                    <div class="text-center small">
                      {{user || user.signature}}
                    </div>
                  </div>
                </div>
                <!-- /.row -->
              </li>
              <!-- Menu Footer-->
              <li class="user-footer">
                <div class="row">
                  <div class="col-md-6">
                    <a href="/user/edit" class="btn btn-black">修改信息</a>
                  </div>
                  <div class="col-md-6">
                    <a href="/logout" class="btn btn-default btn-block"> <i
                      class="fa fa-sign-out"></i> 退 出</a>
                  </div>
                </div>

              </li>
            </ul>



          </form>

        </div>
      </div>

      <nav class="navbar navbar-afly">
        <div class="navbar-header"></div>
        <div class="collapse navbar-collapse">
          <ul class="nav navbar-nav">
            <li class="active"><a class="navbar-link afly-nav-link" href="/">网站首页</a></li>
            <li class="dropdown">
              <a href="javascript:void(0);" class="dropdown-toggle afly-nav-link" data-toggle="dropdown"
                 role="button" aria-haspopup="true" aria-expanded="false">关于我<span class="caret"></span></a>
              <ul class="dropdown-menu">
                <li><a href="/aboutme">我的简介</a></li>
                <li><a href="/my">我的相册</a></li>
              </ul>
            </li>
            <li class="dropdown">
              <a href="javascript:void(0);" class="dropdown-toggle afly-nav-link" data-toggle="dropdown"
                 role="button" aria-haspopup="true" aria-expanded="false">我的生活<span class="caret"></span></a>
              <ul class="dropdown-menu">


                <li><a href="/c/" ></a></li>

              </ul>
            </li>
            <li class="dropdown">
              <a href="javascript:void(0);" class="dropdown-toggle afly-nav-link" data-toggle="dropdown"
                 role="button" aria-haspopup="true" aria-expanded="false">技术知识<span class="caret"></span></a>
              <ul class="dropdown-menu">

                <li><a href="" ></a></li>

              </ul>
            </li>
            <li class=""><a href="javascript:alert('大爷，不好意思，该板块正在开发！');" class="afly-nav-link">给我留言</a></li>
          </ul>
        </div>
      </nav>
    </div>
  </header>
</template>
<script>
  import { mapState } from 'vuex'
  export default{
      data(){
        return {
          siteName: '梅落残雪',
          keyword: ''
        }
      },
      computed: mapState({
        user: function (state) {
          if(!state.user || state.user.length ==0 ){
              this.$store.dispatch('updateUserFromLs');
          }
          return state.user;
        }
      }),
      components: {},
      mounted(){
      }
  }
</script>
