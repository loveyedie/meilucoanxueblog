<template>
<section >
  <article class="afly-index-post"  v-for="post in list">
    <h4>
      <router-link :to='"p/" + post._id' class="afly-link-post">{{post.title}}</router-link>
    </h4>
    <div class="row afly-post-body">
      <div class="col-md-3"><img class="afly-post-pic" v-bind:src="'http://localhost:/'+ (post.picurl || post._category.catpic)" alt="pic"></div>
      <div class="col-md-9">
        <p class="afly-post-content">{{post.content}}</p>
        <router-link :to='"p/" + post._id' class="btn btn-black afly-link-more pull-right">阅读全文</router-link>
      </div>
    </div>
    <footer class="afly-post-footer">
      <span>{{post.updated_time}}</span>
      <span>作者：{{post._user.usernick}}</span>
      <span>个人博客：[<router-link :to='"c/" + post._category._id' >{{post._category.name}}</router-link>]</span>
    </footer>
  </article>
</section>


</template>
<script>
    export default{
      props:['list'],
      data(){
        return {}
      },
      components: {},
      mounted(){
      }
    }
</script>
