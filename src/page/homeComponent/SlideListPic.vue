/**
* Created by Administrator on 2017/12/17.
 */

<template>
  <ul class="list-unstyled afly-wedget-recomment">
    {{#each recommend}}
                    <li>
    <div class="row">
      <div class="col-md-3">
        <a href=""><img src="{{#if picurl}}{{picurl}}{{else}}{{_category.catpic}}{{/if}}" width="60" alt=""></a>
      </div>
      <div class="col-md-9">
        <p class="afly-hot-post"><a href="/p/{{_id}}">{{title}}</a></p>
        <p>
          <span class="afly-label-cat"><a href="/c/{{_category._id}}">{{_category.name}}</a></span>
          <span class="afly-label-date">{{formatDate updated_time 'yyyy-MM-dd' }}</span>
        </p>
      </div>
    </div>
  </li>
    {{/each}}
                </ul>
</template>
<script>
    export default{
        data(){

        },
        components: {},
        mounted(){
        }
    }
</script>
